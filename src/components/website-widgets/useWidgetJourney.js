import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"

// Simulated SMS-number provisioning delay (subscribe → live texting).
const PROVISIONING_DELAY_MS = 2500

/**
 * State machine for the Website Widgets top section. Website Chat is the free,
 * always-available default; Website Texting is a $50/mo add-on. One widget is
 * live on the site at a time, surfaced as two stacked containers.
 *
 *   chat ──(subscribe)──▶ provisioning ──(auto, ~2.5s)──▶ texting
 *   texting ──(switch back)──▶ chat (now)  |  texting-scheduled (end of period)
 *
 * Subscribing auto-provisions the number — no extra click. While provisioning,
 * Chat stays live. Switching texting → chat is billing-aware (now vs scheduled).
 * Switching widgets takes effect immediately, so it does NOT arm Publish — only
 * appearance/customization edits do (via markPending). DialKit jumps statically
 * to any state for review and carries an "Account in trial" toggle (`inTrial`)
 * that flips the enable-texting flow between its free-trial and paid framing.
 */
export function useWidgetJourney() {
  const [stage, setStage] = useState("chat")
  // Once texting has been subscribed + provisioned, re-enabling is instant.
  const [addonProvisioned, setAddonProvisioned] = useState(false)
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
  // Subscribing auto-provisions the number — no activate click. If already
  // provisioned once, go live instantly.
  const subscribeTexting = () => {
    clearTimers()
    setChatSwitchNotice(false)
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
    setChatSwitchNotice(true)
  }

  const dismissChatSwitchNotice = () => setChatSwitchNotice(false)

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
      goChat: { type: "action", label: "↦ Chat live (default)" },
      goProvisioning: { type: "action", label: "↦ Texting: provisioning" },
      goTextingLive: { type: "action", label: "↦ Texting: live" },
      goScheduledSwitch: { type: "action", label: "↦ Texting: ending (scheduled)" },
      reset: { type: "action", label: "↺ Reset journey" },
    },
    {
      onAction: (action) => {
        clearTimers()
        setChatSwitchNotice(false)
        switch (action) {
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
            setStage("chat")
            setPendingPublish(false)
            break
          default:
            break
        }
      },
    },
  )

  useEffect(() => () => clearTimers(), [])

  // Which widget is actually live on the site right now. Texting only goes live
  // once provisioning completes, so the site stays on Chat until then.
  const liveWidget =
    stage === "texting" || stage === "texting-scheduled" ? "texting" : "chat"

  const numberStatus =
    stage === "texting" || stage === "texting-scheduled"
      ? "active"
      : stage === "provisioning"
        ? "inProgress"
        : "inactive"

  // The customization preview mirrors the live widget.
  const previewType = liveWidget

  return {
    stage,
    liveWidget,
    numberStatus,
    previewType,
    addonProvisioned,
    inTrial: dials.accountInTrial,
    chatSwitchNotice,
    pendingPublish,
    publishNonce,
    // transitions
    subscribeTexting,
    switchToChatNow,
    scheduleSwitchToChat,
    keepTexting,
    dismissChatSwitchNotice,
    markPending,
  }
}
