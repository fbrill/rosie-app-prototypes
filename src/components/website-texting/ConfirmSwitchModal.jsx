"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const LABELS = { chat: "Website Chat", texting: "Website Texting" }

/**
 * Confirmation dialog shown before switching the live website widget from one
 * channel to another. Self-contained shell (backdrop + scale/opacity card +
 * Escape + click-outside) mirroring the test-call Modal for visual parity.
 *
 * @param {boolean} open
 * @param {() => void} onClose   - cancel / dismiss
 * @param {() => void} onConfirm - proceed with the switch
 * @param {"chat"|"texting"} from - currently active channel
 * @param {"chat"|"texting"} to   - channel being switched to
 */
export default function ConfirmSwitchModal({ open, onClose, onConfirm, from, to }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const toLabel = LABELS[to] ?? "this widget"
  const fromLabel = LABELS[from] ?? "active"

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-[20px] bg-white shadow-[0_24px_48px_-12px_rgba(42,20,60,0.25)]"
          >
            <div className="flex items-start justify-between gap-3 px-6 pb-2 pt-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[19px] font-bold tracking-[-0.02em] text-black">
                  Switch to {toLabel}?
                </h2>
                <p className="text-[13px] font-medium tracking-[-0.01em] text-gray-700">
                  This replaces your active {fromLabel} widget on your site.
                  Visitors will see the new widget immediately. {/* placeholder copy */}
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

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-25 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="cursor-pointer rounded-full bg-purple-700 px-5 py-2 text-[14px] font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.08)] transition-colors hover:bg-purple-600"
              >
                Switch to {toLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
