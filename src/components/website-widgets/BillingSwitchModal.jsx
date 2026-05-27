"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  XMarkIcon,
  CalendarDaysIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline"

/**
 * Billing-aware switch from Website Texting back to Website Chat. Because mid-
 * cycle cancellations aren't prorated, the user chooses to switch immediately
 * (forfeiting the rest of the paid period) or to keep texting until the billing
 * period ends and switch automatically then.
 *
 * @param {boolean} open
 * @param {string} periodEndLabel      - end of the current billing period
 * @param {() => void} onSwitchNow     - switch to Chat immediately
 * @param {() => void} onSchedule      - schedule the switch for the period end
 * @param {() => void} onClose         - dismiss without changing anything
 */
export default function BillingSwitchModal({
  open,
  periodEndLabel,
  onSwitchNow,
  onSchedule,
  onClose,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-[20px] bg-white shadow-[0_24px_48px_-12px_rgba(42,20,60,0.25)]"
            role="dialog"
            aria-modal="true"
            aria-label="Switch to Website Chat"
          >
            <div className="flex items-start justify-between gap-3 px-6 pb-2 pt-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[19px] font-bold tracking-[-0.02em] text-black">
                  Switch back to Website Chat?
                </h2>
                <p className="text-[13px] font-medium leading-snug tracking-[-0.01em] text-gray-700">
                  Website Texting is paid through {periodEndLabel} and
                  isn&apos;t prorated. Choose when to switch your live widget
                  back to Website Chat.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                aria-label="Close"
              >
                <XMarkIcon className="size-5 stroke-[2]" />
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 px-6 py-4">
              <button
                type="button"
                onClick={onSchedule}
                className="group flex items-start gap-3 rounded-[12px] border border-gray-200 bg-white p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-25"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-200">
                  <CalendarDaysIcon
                    className="size-5 text-purple-700"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-black">
                    Switch at end of billing period
                  </span>
                  <span className="block text-[13px] leading-snug text-gray-700">
                    Keep Website Texting until {periodEndLabel}, then switch to
                    Website Chat automatically. Recommended — you&apos;ve already
                    paid for it.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={onSwitchNow}
                className="group flex items-start gap-3 rounded-[12px] border border-gray-200 bg-white p-4 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <ArrowUturnLeftIcon
                    className="size-5 text-gray-700"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-black">
                    Switch now
                  </span>
                  <span className="block text-[13px] leading-snug text-gray-700">
                    Go back to Website Chat right away. You&apos;ll lose the rest
                    of this billing period — no refund for unused days.
                  </span>
                </span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-25 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
