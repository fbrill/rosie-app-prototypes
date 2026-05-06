import { motion } from "motion/react"

const QUESTIONS = [
  "Tell me about Victoria Bakos?",
  "What services do you offer?",
  "Are you open tomorrow?",
]

export const TryAskingRow = ({ subdued = false }) => (
  <div
    className={`flex flex-col gap-2 transition-opacity ${
      subdued ? "opacity-60" : ""
    }`}
  >
    <p className="text-[11px] font-bold text-purple-700 uppercase tracking-[0.1em] px-1 text-center">
      Try asking Rosie
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {QUESTIONS.map((q, idx) => (
        <motion.div
          key={q}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.08 + idx * 0.05,
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="bg-white border border-[#f6eaff] rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-[0_0_0_1px_rgba(42,20,60,0.04),0_1px_2px_-0.5px_rgba(42,20,60,0.04)]"
        >
          <div className="bg-purple-100 rounded-full size-7 flex items-center justify-center shrink-0">
            <span className="text-purple-700 font-semibold text-[13px]">Q</span>
          </div>
          <p className="text-gray-700 font-medium text-[13px] leading-[1.35]">
            {q}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
)
