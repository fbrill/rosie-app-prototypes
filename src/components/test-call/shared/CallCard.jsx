import { AnimatePresence, motion } from "motion/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { CallPill } from "./CallPill"
import { LivePanel } from "./LivePanel"
import { ProcessingPanel } from "./ProcessingPanel"
import { TryAskingRow } from "./TryAskingRow"
import { CARD_SHADOW, USER_TEST_NUMBER } from "./constants"

export const CallCard = ({ callState }) => {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 32 }}
      className={`rounded-[20px] ${CARD_SHADOW} overflow-hidden`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {callState === "waiting" && <WaitingPanel key="waiting" />}
        {callState === "inProgress" && (
          <motion.div
            key="inProgress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-200 via-purple-100 to-purple-25 px-6 py-10 sm:pb-6 sm:pt-12"
          >
            <LivePanel />
          </motion.div>
        )}
        {callState === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-purple-25 px-6 py-10 sm:py-12"
          >
            <ProcessingPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const WaitingPanel = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="relative overflow-hidden bg-gradient-to-br from-purple-200 via-purple-100 to-purple-25 px-5 py-12 sm:p-6 sm:pt-20"
  >
    <div className="relative flex flex-col items-center gap-8 sm:gap-12 h-full justify-between">
      <RingingPill />
      <TryAskingRow />
    </div>
  </motion.div>
)

// The number pill IS the focal point. A soft purple glow pulses outward from
// behind it — same feel as the listening state. CSS-driven so the animation
// loops reliably under React strict mode. `inline-flex` makes the wrapper
// shrink to the pill's actual width so the glow doesn't leak past it.
const RingingPill = () => (
  <div className="relative inline-flex">
    <span aria-hidden className="phone-glow absolute inset-0 rounded-full" />
    <CallPill size="hero" />
  </div>
)

// Footer shown post-call. Until the user goes live, only numbers in this list
// can reach Rosie — they can add more for team-testing, or request a local
// area code so the live number matches their region.
export const PostCallChips = () => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-x-5 gap-y-2 text-center px-1">
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <p className="text-[12px] font-medium text-gray-700 tracking-[-0.01em]">
        Allow test calls from:
      </p>
      <span className="bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-black tabular-nums">
        {USER_TEST_NUMBER}
      </span>
      <button
        type="button"
        className="flex items-center gap-0.5 text-[12px] font-semibold text-purple-700 hover:text-purple-600 cursor-pointer rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5"
      >
        <PlusIcon className="size-3.5 stroke-[2.5]" />
        Add
      </button>
    </div>
    <span className="hidden sm:inline text-gray-300">·</span>
    <button
      type="button"
      className="text-[12px] font-medium text-gray-700 underline cursor-pointer hover:text-black"
    >
      Request local area code
    </button>
  </div>
)
