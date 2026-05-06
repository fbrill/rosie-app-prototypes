import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"
import { PROCESSING_DELAY_MS } from "./constants"

// State machine for the test call lifecycle.
// waiting -> inProgress -> processing -> complete
// `endCall` auto-advances through `processing` so the UI mimics the real
// hangup -> post-call processing handoff Jessica asked for.
export const useTestCallMachine = (panelLabel = "Test Call") => {
  const [callState, setCallState] = useState("waiting")
  const [feedback, setFeedback] = useState(null)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const dk = useDialKit(
    panelLabel,
    {
      startCall: { type: "action", label: "▶ Start call" },
      endCall: { type: "action", label: "■ End call (auto-advance)" },
      reset: { type: "action", label: "↺ Reset" },
      runLifecycle: { type: "action", label: "↻ Run full lifecycle" },
      showCallDetails: false,
      askedTransfer: false,
      askedAppointment: false,
    },
    {
      onAction: (action) => {
        clearTimers()
        if (action === "startCall") {
          setCallState("inProgress")
        } else if (action === "endCall") {
          setCallState("processing")
          timersRef.current.push(
            setTimeout(() => setCallState("complete"), PROCESSING_DELAY_MS),
          )
        } else if (action === "reset") {
          setCallState("waiting")
          setFeedback(null)
        } else if (action === "runLifecycle") {
          setCallState("waiting")
          setFeedback(null)
          timersRef.current.push(
            setTimeout(() => setCallState("inProgress"), 450),
          )
          timersRef.current.push(
            setTimeout(() => setCallState("processing"), 4500),
          )
          timersRef.current.push(
            setTimeout(
              () => setCallState("complete"),
              4500 + PROCESSING_DELAY_MS,
            ),
          )
        }
      },
    },
  )

  useEffect(() => () => clearTimers(), [])

  // Reset downstream when we go back to waiting
  useEffect(() => {
    if (callState === "waiting") setFeedback(null)
  }, [callState])

  return {
    callState,
    feedback,
    setFeedback,
    askedTransfer: dk.askedTransfer,
    askedAppointment: dk.askedAppointment,
    showCallDetails: dk.showCallDetails,
  }
}
