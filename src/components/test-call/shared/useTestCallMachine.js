import { useEffect, useRef, useState } from "react"
import { useDialKit } from "dialkit"
import { PROCESSING_DELAY_MS } from "./constants"

// State machine for the test call lifecycle.
// waiting -> inProgress -> processing -> complete
// Three "End → Option" buttons replace the single end-call: each ends the call
// AND picks which post-complete variant to render (a/b/c). `endCall` is kept
// as an alias for option A to keep `runLifecycle` simple.
export const useTestCallMachine = (panelLabel = "Test Call") => {
  const [callState, setCallState] = useState("waiting")
  const [feedback, setFeedback] = useState(null)
  const [endScenario, setEndScenario] = useState("a")
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const finishCall = (scenario) => {
    setEndScenario(scenario)
    setFeedback(null)
    setCallState("processing")
    timersRef.current.push(
      setTimeout(() => setCallState("complete"), PROCESSING_DELAY_MS),
    )
  }

  const dk = useDialKit(
    panelLabel,
    {
      startCall: { type: "action", label: "▶ Start call" },
      endA: { type: "action", label: "■ End → A (toggle)" },
      endB: { type: "action", label: "■ End → B (split picker)" },
      endC: { type: "action", label: "■ End → C (ready by default)" },
      reset: { type: "action", label: "↺ Reset" },
      runLifecycle: { type: "action", label: "↻ Run full lifecycle (A)" },
      showCallDetails: false,
      askedTransfer: false,
      askedAppointment: false,
    },
    {
      onAction: (action) => {
        clearTimers()
        if (action === "startCall") {
          setCallState("inProgress")
        } else if (action === "endA") {
          finishCall("a")
        } else if (action === "endB") {
          finishCall("b")
        } else if (action === "endC") {
          finishCall("c")
        } else if (action === "reset") {
          setCallState("waiting")
          setFeedback(null)
          setEndScenario("a")
        } else if (action === "runLifecycle") {
          setCallState("waiting")
          setFeedback(null)
          setEndScenario("a")
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
    endScenario,
    askedTransfer: dk.askedTransfer,
    askedAppointment: dk.askedAppointment,
    showCallDetails: dk.showCallDetails,
  }
}
