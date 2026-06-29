import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"

// Simulated SMS-number provisioning delay (subscribe → live texting).
const PROVISIONING_DELAY_MS = 2500

/**
 * State machine for the Website Widgets top section. A fresh account starts in
 * the "none" entry state — neither widget is live yet, so the user must pick one
 * to proceed (this makes it clear Website Chat is NOT already running on their
 * site). Website Chat is free; Website Texting is a $50/mo add-on. One widget is
 * live on the site at a time, surfaced as two side-by-side containers.
 *
 *   none ──(select chat)──▶ chat
 *   none ──(select texting / subscribe)──▶ provisioning ──(auto, ~2.5s)──▶ texting
 *   chat ──(subscribe)──▶ provisioning ──(auto, ~2.5s)──▶ texting
 *   texting ──(switch back)──▶ chat (now)  |  texting-scheduled (end of period)
 *
 * Selecting Chat for the first time surfaces a dismissible success banner;
 * selecting Texting opens the subscribe modal, which auto-provisions the number
 * (no extra click). While provisioning, the site shows nothing new yet. Switching
 * texting → chat is billing-aware (now vs scheduled). Switching widgets takes
 * effect immediately, so it does NOT arm Publish — only appearance/customization
 * edits do (via markPending). DialKit jumps statically to any state for review
 * and carries an "Account in trial" toggle (`inTrial`) that flips the
 * enable-texting flow between its free-trial and paid framing.
 */
export function useWidgetJourney() {
  // "none" = nothing selected yet (new-account entry state).
  const [stage, setStage] = useState("none")
  // Once texting has been subscribed + provisioned, re-enabling is instant.
  const [addonProvisioned, setAddonProvisioned] = useState(false)
  // True right after Website Chat is selected from the entry state — drives the
  // green "Chat is live, now install it" success banner.
  const [chatSelectedNotice, setChatSelectedNotice] = useState(false)
  // True after a billing-aware "Switch now" back to Chat — drives the info
  // banner that tells the user their Texting add-on will expire at period end.
  const [chatSwitchNotice, setChatSwitchNotice] = useState(false)
  // Unpublished change → drives the header Publish button. The nonce bumps on
  // every change so the button re-arms even for back-to-back changes.
  const [pendingPublish, setPendingPublish] = useState(false)
  const [publishNonce, setPublishNonce] = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  // Arms the header Publish button. Only appearance/customization changes call
  // this — switching the live widget takes effect immediately, no publish.
  const markPending = () => {
    setPendingPublish(true)
    setPublishNonce((n) => n + 1)
  }

  // Kick off the simulated provisioning → live-texting transition.
  const startProvisioning = () => {
    clearTimers()
    setStage("provisioning")
    timersRef.current.push(
      setTimeout(() => {
        setAddonProvisioned(true)
        setStage("texting")
      }, PROVISIONING_DELAY_MS),
    )
  }

  // --- Click-path transitions -------------------------------------------------
  // Select Website Chat from the entry state (or re-pick it). Free + instant,
  // so it goes live right away and surfaces a one-time "now install it" banner.
  const selectChat = () => {
    clearTimers()
    setChatSwitchNotice(false)
    setStage("chat")
    setChatSelectedNotice(true)
  }

  // Subscribing auto-provisions the number — no activate click. If already
  // provisioned once, go live instantly.
  const subscribeTexting = () => {
    clearTimers()
    setChatSwitchNotice(false)
    setChatSelectedNotice(false)
    if (addonProvisioned) {
      setStage("texting")
    } else {
      startProvisioning()
    }
  }

  // Switch the live widget back to Chat immediately (forfeits the paid period).
  // Surfaces a one-time info banner about the add-on expiring at period end.
  const switchToChatNow = () => {
    clearTimers()
    setStage("chat")
    setChatSelectedNotice(false)
    setChatSwitchNotice(true)
  }

  const dismissChatSwitchNotice = () => setChatSwitchNotice(false)
  const dismissChatSelectedNotice = () => setChatSelectedNotice(false)

  // Keep texting live but schedule the switch to Chat for the period end.
  const scheduleSwitchToChat = () => {
    clearTimers()
    setStage("texting-scheduled")
  }

  // Cancel a scheduled switch — texting stays live.
  const keepTexting = () => {
    clearTimers()
    setStage("texting")
  }

  // --- DialKit: trial toggle + static state jumps -----------------------------
  const dials = useDialKit(
    "Website Widgets",
    {
      // Account billing context. In trial, the Website Texting add-on is free
      // until the trial ends; toggle off to preview the standard paid flow.
      accountInTrial: true,
      goNone: { type: "action", label: "↦ New (nothing selected)" },
      goChat: { type: "action", label: "↦ Chat live" },
      goProvisioning: { type: "action", label: "↦ Texting: provisioning" },
      goTextingLive: { type: "action", label: "↦ Texting: live" },
      goScheduledSwitch: { type: "action", label: "↦ Texting: ending (scheduled)" },
      reset: { type: "action", label: "↺ Reset journey" },
    },
    {
      onAction: (action) => {
        clearTimers()
        setChatSwitchNotice(false)
        setChatSelectedNotice(false)
        switch (action) {
          case "goNone":
            setStage("none")
            setAddonProvisioned(false)
            setPendingPublish(false)
            break
          case "goChat":
            setStage("chat")
            setPendingPublish(false)
            break
          case "goProvisioning":
            // Static jump — no auto-advance timer, so the state can be inspected.
            setStage("provisioning")
            setPendingPublish(false)
            break
          case "goTextingLive":
            setAddonProvisioned(true)
            setStage("texting")
            setPendingPublish(false)
            break
          case "goScheduledSwitch":
            setAddonProvisioned(true)
            setStage("texting-scheduled")
            setPendingPublish(false)
            break
          case "reset":
            setAddonProvisioned(false)
            setStage("none")
            setPendingPublish(false)
            break
          default:
            break
        }
      },
    },
  )

  useEffect(() => () => clearTimers(), [])

  // Which widget is actually live on the site right now. "none" until the user
  // picks one. Texting only goes live once provisioning completes, so the site
  // stays on Chat (or nothing) until then.
  const liveWidget =
    stage === "none"
      ? "none"
      : stage === "texting" || stage === "texting-scheduled"
        ? "texting"
        : "chat"

  const numberStatus =
    stage === "texting" || stage === "texting-scheduled"
      ? "active"
      : stage === "provisioning"
        ? "inProgress"
        : "inactive"

  // The customization preview mirrors the live widget, falling back to Chat in
  // the entry state so there's always something sensible to preview.
  const previewType = liveWidget === "none" ? "chat" : liveWidget

  return {
    stage,
    liveWidget,
    numberStatus,
    previewType,
    addonProvisioned,
    inTrial: dials.accountInTrial,
    chatSelectedNotice,
    chatSwitchNotice,
    pendingPublish,
    publishNonce,
    // transitions
    selectChat,
    subscribeTexting,
    switchToChatNow,
    scheduleSwitchToChat,
    keepTexting,
    dismissChatSelectedNotice,
    dismissChatSwitchNotice,
    markPending,
  }
}
