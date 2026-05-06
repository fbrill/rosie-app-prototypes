import { motion } from "motion/react"
import { SparklesIcon } from "@heroicons/react/24/outline"

export const ProcessingPanel = () => (
  <div className="relative flex flex-col items-center gap-4">
    <motion.div
      className="relative flex items-center justify-center size-14 rounded-full bg-gradient-to-br from-purple-100 to-purple-200"
      animate={{ rotate: 360 }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
    >
      <SparklesIcon className="size-6 text-purple-700 stroke-[2]" />
    </motion.div>
    <div className="flex flex-col items-center gap-1 text-center max-w-[300px]">
      <p className="text-purple-700 font-bold text-base leading-7">
        Processing your call
      </p>
      <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em]">
        Generating the summary and transcript — this usually takes a moment.
      </p>
    </div>
    <div className="flex items-center gap-1.5 mt-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-purple-500"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
)
