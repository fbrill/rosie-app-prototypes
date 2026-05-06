import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { PhoneIcon } from "@heroicons/react/24/solid"
import { CallPill } from "./CallPill"
import { TryAskingRow } from "./TryAskingRow"

export const LivePanel = () => {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setElapsed((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0")
  const ss = String(elapsed % 60).padStart(2, "0")

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-200/70 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          className="relative flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(147,50,224,0.45)",
              "0 0 0 22px rgba(147,50,224,0)",
            ],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        >
          <PhoneIcon className="size-7 text-white" />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-purple-700 font-bold text-base leading-7">
            Call in progress
          </p>
          <p className="text-black font-bold text-2xl tabular-nums tracking-[-0.02em]">
            {mm}:{ss}
          </p>
        </div>
        <CallPill size="compact" />
        <TryAskingRow />
      </div>
    </>
  )
}
