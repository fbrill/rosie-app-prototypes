import { motion } from "motion/react"

const HEADLINE_BY_STATE = {
  waiting: ["Call your", "Rosie receptionist"],
  inProgress: ["Listening...", null],
  processing: ["Wrapping things up...", null],
  complete: ["How did", "it sound?"],
}

const SUBHEAD_BY_STATE = {
  waiting:
    "She's ready and waiting. Pick up your phone, dial the number below, and try a question.",
  inProgress:
    "This is exactly what your caller will experience when calling {businessName}.",
  processing: "Generating your call summary — usually takes just a moment.",
  complete: null,
}

// Variant C frames the complete state as a celebration before any feedback.
const COMPLETE_C = {
  headline: ["Rosie is", "ready"],
  sub: "Choose a live plan to start taking real calls.",
}

export const Hero = ({ callState, variant = "a" }) => {
  if (callState === "complete" && variant === "c") {
    return <HeroLayout primary={COMPLETE_C.headline[0]} accent={COMPLETE_C.headline[1]} sub={COMPLETE_C.sub} />
  }

  const headline = HEADLINE_BY_STATE[callState]
  if (!headline) return null

  const [primary, accent] = headline
  const sub = SUBHEAD_BY_STATE[callState]
  return <HeroLayout primary={primary} accent={accent} sub={sub} />
}

const HeroLayout = ({ primary, accent, sub }) => (
  <motion.div
    layout
    className="mt-5 sm:mt-10 mb-4 sm:mb-6 text-center flex flex-col gap-1.5 sm:gap-2 items-center"
  >
    <h1 className="text-[26px] sm:text-[38px] font-bold text-black tracking-[-0.03em] leading-[1.1]">
      {primary}
      {accent && (
        <>
          {" "}
          <span className="text-purple-600">{accent}</span>
        </>
      )}
    </h1>
    {sub && (
      <p className="text-[14px] sm:text-[15px] font-medium text-gray-700 tracking-[-0.01em]">
        {sub}
      </p>
    )}
  </motion.div>
)
