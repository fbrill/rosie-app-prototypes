"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"

const STACK_SCALE_STEP = 0.12
const STACK_PEEK_Y = 25
const EXIT_SLIDE_DOWN = 20
const DURATION_MS = 280
const tween = { duration: DURATION_MS / 1000, ease: "linear" }

function getStackStyle(stackIndex) {
  return {
    scale: 1 - stackIndex * STACK_SCALE_STEP,
    y: -stackIndex * STACK_PEEK_Y,
  }
}

export default function BannerStack({ banners }) {
  const [dismissedIds, setDismissedIds] = useState(new Set())

  const displayBanners = banners.filter((b) => !dismissedIds.has(b.id))
  const handleDismiss = useCallback((id) => {
    const banner = banners.find((b) => b.id === id)
    if (banner?.dismissible) setDismissedIds((prev) => new Set(prev).add(id))
  }, [banners])

  if (displayBanners.length === 0) return null

  const list = [...displayBanners].reverse()

  return (
    <div className="relative w-full" style={{ minHeight: 180 }}>
      <AnimatePresence initial={false}>
        {list.map((banner, i) => {
          const stackIndex = list.length - 1 - i
          const { scale, y } = getStackStyle(stackIndex)
          const isFront = i === list.length - 1

          return (
            <motion.div
              key={banner.id}
              initial={false}
              animate={{ scale, y, opacity: 1 }}
              exit={{ opacity: 0, y: EXIT_SLIDE_DOWN, transition: tween }}
              transition={tween}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                transformOrigin: "center 100%",
                zIndex: i,
              }}
              className={isFront ? "" : "pointer-events-none"}
            >
              <div className={isFront ? "pointer-events-auto" : ""}>
                {banner.renderContent({
                  onDismiss: banner.dismissible
                    ? () => handleDismiss(banner.id)
                    : undefined,
                  isExiting: false,
                })}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
