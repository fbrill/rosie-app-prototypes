import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"

// Simulated SMS-number provisioning delay (In Progress → Active).
const PROVISIONING_DELAY_MS = 2500

/**
 * Stage machine for the Website Widgets activation journey. One widget runs at a
 * time; the user clicks from the default (Website Chat) through comparing,
 * enabling the $50/mo add-on (straight from the compare table), and provisioning
 * the SMS number, then can switch back to chat. Activating texting or switching
 * channels marks an unpublished change (drives the header Publish button).
 *
 *   chat → compare → texting-inactive
 *        activateNumber(): inactive → inprogress → (timer) → active
 *   texting-active ⇄ chat   (each switch → pending publish)
 *
 * DialKit action buttons jump straight to any stage *statically* (no timers) so
 * each state — including the three number states — can be inspected/screenshotted.
 */
export function useWidgetJourney() {
  const [stage, setStage] = useState("chat")
  // Once the add-on has been enabled + number activated, later chat⇄texting
  // switches are instant (no re-setup), matching "switching is instant".
  const [addonProvisioned, setAddonProvisioned] = useState(false)
  // Whether the live widget has an unpublished change (drives the header
  // Publish button). The nonce bumps on every change so the button re-arms
  // even when one pending change immediately follows another.
  const [pendingPublish, setPendingPublish] = useState(false)
  const [publishNonce, setPublishNonce] = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  // Flag an unpublished change to the live widget (activating texting or
  // switching channels) and re-arm the Publish button.
  const markPending = () => {
    setPendingPublish(true)
    setPublishNonce((n) => n + 1)
  }

  // --- Click-path transitions -------------------------------------------------
  const openCompare = () => setStage("compare")
  const closeCompare = () => setStage("chat")
  // Enabling the add-on happens straight from the compare table — no
  // interstitial band — landing on the SMS-number activation screen.
  const upgrade = () => setStage("texting-inactive")

  const activateNumber = () => {
    clearTimers()
    setStage("texting-inprogress")
    timersRef.current.push(
      setTimeout(() => {
        setAddonProvisioned(true)
        setStage("texting-active")
        markPending() // texting is now live → publish
      }, PROVISIONING_DELAY_MS),
    )
  }

  const switchToChat = () => {
    clearTimers()
    setStage("chat")
    markPending() // reverting to chat is also a change → publish
  }

  // After provisioning, jump straight to live texting (no compare/add-on steps).
  const switchToTexting = () => {
    clearTimers()
    setStage("texting-active")
    markPending()
  }

  // --- DialKit static jumps ---------------------------------------------------
  const dk = useDialKit(
    "Website Widgets",
    {
      goChat: { type: "action", label: "↦ Chat active (default)" },
      goCompare: { type: "action", label: "↦ Compare view" },
      goNumberInactive: { type: "action", label: "↦ Number: Inactive" },
      goNumberInProgress: { type: "action", label: "↦ Number: In Progress" },
      goTextingActive: { type: "action", label: "↦ Texting active" },
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
          case "goNumberInactive":
            setStage("texting-inactive")
            setPendingPublish(false)
            break
          case "goNumberInProgress":
            setStage("texting-inprogress")
            setPendingPublish(false)
            break
          case "goTextingActive":
            setAddonProvisioned(true)
            setStage("texting-active")
            markPending()
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

  const numberStatus =
    stage === "texting-active"
      ? "active"
      : stage === "texting-inprogress"
        ? "inProgress"
        : "inactive"

  const previewType =
    stage === "chat" || stage === "compare" ? "chat" : "texting"

  return {
    stage,
    numberStatus,
    previewType,
    addonProvisioned,
    pendingPublish,
    publishNonce,
    // click handlers
    openCompare,
    closeCompare,
    upgrade,
    activateNumber,
    switchToChat,
    switchToTexting,
    markPending,
  }
}
