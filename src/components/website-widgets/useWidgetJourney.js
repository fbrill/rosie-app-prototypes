import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"

// Simulated SMS-number provisioning delay (subscribe → live texting).
const PROVISIONING_DELAY_MS = 2500

/**
 * State machine for the Website Widgets top section. Website Chat is the free,
 * always-available default; Website Texting is a $50/mo add-on. One widget is
 * live on the site at a time, surfaced as two stacked containers.
 *
 *   chat ──(compare → subscribe)──▶ provisioning ──(auto, ~2.5s)──▶ texting
 *   texting ──(switch back)──▶ chat (now)  |  texting-scheduled (end of period)
 *
 * Subscribing auto-provisions the number — no extra click. While provisioning,
 * Chat stays live. Switching texting → chat is billing-aware (now vs scheduled).
 * Switching widgets takes effect immediately, so it does NOT arm Publish — only
 * appearance/customization edits do (via markPending). DialKit jumps statically
 * to any state for review.
 */
export function useWidgetJourney() {
  const [stage, setStage] = useState("chat")
  // Once texting has been subscribed + provisioned, re-enabling is instant.
  const [addonProvisioned, setAddonProvisioned] = useState(false)
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
  const openCompare = () => setStage("compare")
  const closeCompare = () => setStage("chat")

  // Subscribing happens straight from the compare table: auto-provision, no
  // activate click. If already provisioned once, go live instantly.
  const subscribeTexting = () => {
    clearTimers()
    if (addonProvisioned) {
      setStage("texting")
    } else {
      startProvisioning()
    }
  }

  // Switch the live widget back to Chat immediately (forfeits the paid period).
  const switchToChatNow = () => {
    clearTimers()
    setStage("chat")
  }

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

  // --- DialKit static jumps ---------------------------------------------------
  const dk = useDialKit(
    "Website Widgets",
    {
      goChat: { type: "action", label: "↦ Chat live (default)" },
      goCompare: { type: "action", label: "↦ Compare view" },
      goProvisioning: { type: "action", label: "↦ Texting: provisioning" },
      goTextingLive: { type: "action", label: "↦ Texting: live" },
      goScheduledSwitch: { type: "action", label: "↦ Texting: ending (scheduled)" },
      reset: { type: "action", label: "↺ Reset journey" },
    },
    {
      onAction: (action) => {
        clearTimers()
        switch (action) {
          case "goChat":
            setStage("chat")
            setPendingPublish(false)
            break
          case "goCompare":
            setStage("compare")
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
  void dk

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
    pendingPublish,
    publishNonce,
    // transitions
    openCompare,
    closeCompare,
    subscribeTexting,
    switchToChatNow,
    scheduleSwitchToChat,
    keepTexting,
    markPending,
  }
}
