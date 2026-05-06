import { AnimatePresence, motion } from "motion/react"
import {
  CallCard,
  FeedbackCard,
  Hero,
  PageShell,
  PostCallChips,
  useTestCallMachine,
} from "./shared"

const TestCall = () => {
  const {
    callState,
    feedback,
    setFeedback,
    askedTransfer,
    askedAppointment,
    showCallDetails,
  } = useTestCallMachine("Test Call")

  const showPostCall = callState === "complete"

  return (
    <PageShell>
      <Hero callState={callState} />
      {callState !== "complete" && <CallCard callState={callState} />}

      <AnimatePresence>
        {showPostCall && (
          <motion.div
            key="post-call"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 mt-4"
          >
            <FeedbackCard
              feedback={feedback}
              setFeedback={setFeedback}
              onGoLive={goToPricing}
              onTestAgain={() => window.location.reload()}
              askedTransfer={askedTransfer}
              askedAppointment={askedAppointment}
              showCallDetails={showCallDetails}
            />
            <PostCallChips />
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

const goToPricing = () => {
  if (typeof window !== "undefined") {
    window.alert("→ Pricing page (placeholder — wire up /pricing when ready)")
  }
}

export default TestCall
