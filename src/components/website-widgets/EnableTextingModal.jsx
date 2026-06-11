"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  XMarkIcon,
  CheckCircleIcon,
  GiftIcon,
} from "@heroicons/react/24/outline"
import EditableText from "../edit-mode/EditableText"

/**
 * Confirmation step shown before enabling the Website Texting add-on. Restates
 * the plan (price + what's included) and surfaces the billing agreement so the
 * user explicitly opts in to monthly charges and overages before we provision
 * an SMS number. Confirming kicks off the same subscribe → provision flow as a
 * direct switch.
 *
 * While the account is still in its free trial (`isTrial`), the same plan is
 * shown but framed as free until the trial ends: a callout reassures the user
 * nothing is charged today and the price block leads with "$0 due today, then
 * $50/month after {trialEndLabel}".
 *
 * @param {boolean} open
 * @param {boolean} [isTrial]        - account is in its free trial → texting is free until the trial ends
 * @param {string}  [trialEndLabel]  - when the trial ends and billing begins (e.g. "June 24, 2026")
 * @param {() => void} onConfirm  - enable texting (subscribe + auto-provision)
 * @param {() => void} onClose    - dismiss without enabling
 */
export default function EnableTextingModal({
  open,
  isTrial = false,
  trialEndLabel,
  onConfirm,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-[450px] flex-col gap-5 rounded-[16px] border border-[#f2e0ff] bg-gradient-to-b from-purple-25 to-purple-100 p-8 shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
            role="dialog"
            aria-modal="true"
            aria-label="Enable Website Texting"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-[15px] top-[15px] flex size-10 cursor-pointer items-center justify-center rounded-full text-purple-700 transition-colors hover:bg-purple-200"
            >
              <XMarkIcon className="size-6 stroke-[2]" />
            </button>

            <EditableText
              id="enableTexting.title"
              as="h2"
              className="pr-10 text-[28px] font-medium leading-[1.3] text-black"
            >
              Enable Website Texting
            </EditableText>

            {/* Trial callout — texting is free until the trial converts to paid */}
            {isTrial && (
              <div className="flex items-start gap-2.5 rounded-t-[12px] -mb-10 pb-9 border border-black/10 bg-gradient-to-b from-white via-white to-amber-50 p-3.5">
                <GiftIcon
                  className="mt-px size-5 shrink-0 text-amber-500"
                  strokeWidth={1.8}
                />
                <div className="min-w-0">
                  <EditableText
                    id="enableTexting.trialTitle"
                    as="p"
                    className="text-[14px] font-semibold leading-5 text-black"
                  >
                    Free for the rest of your trial
                  </EditableText>
                  <EditableText
                    id="enableTexting.trialBody"
                    as="p"
                    multiline
                    className="mt-0.5 text-[13px] leading-[1.4] text-gray-800"
                  >
                    Turn on Website Texting now at no charge. You won't be
                    billed until your trial ends — cancel anytime before then.
                  </EditableText>
                </div>
              </div>
            )}

            {/* Plan card */}
            <div className="overflow-hidden rounded-[12px] border-2 border-purple-600 bg-white shadow-[0_4px_6px_-1px_rgba(130,42,198,0.09),0_2px_4px_-1px_rgba(130,42,198,0.06)]">
              <div className="flex flex-col gap-1 p-5">
                <div className="flex items-center justify-between">
                  <EditableText
                    id="enableTexting.planName"
                    as="span"
                    className="text-[16px] font-semibold leading-6 text-black"
                  >
                    Website Texting
                  </EditableText>
                  <EditableText
                    id="enableTexting.planTag"
                    as="span"
                    className="text-[10px] font-medium uppercase text-gray-600"
                  >
                    Add-On
                  </EditableText>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Headline price stays $50/month in every state so it's never
                      misread as free — the trial sub-line carries the "free now"
                      nuance and the date billing begins. */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-end gap-1">
                      <span className="text-[26px] font-bold leading-8 tracking-[-0.52px] text-black">
                        $50
                      </span>
                      <EditableText
                        id="enableTexting.priceNote"
                        as="span"
                        className="pb-[3px] text-[12px] leading-4 text-gray-800"
                      >
                        per month
                      </EditableText>
                    </div>
                    {isTrial && (
                      <p className="text-[12px] font-medium leading-4 text-amber-700">
                        <EditableText
                          id="enableTexting.trialPriceSub"
                          as="span"
                        >
                          Free during your trial — billing starts
                        </EditableText>
                        {trialEndLabel ? (
                          <>
                            {" "}
                            <span className="font-semibold">
                              {trialEndLabel}
                            </span>
                          </>
                        ) : null}
                      </p>
                    )}
                  </div>
                  <div className="h-px w-full bg-gray-200" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 px-5 pb-5">
                <div className="flex items-start gap-2">
                  <CheckCircleIcon
                    className="size-4 shrink-0 text-purple-600"
                    strokeWidth={1.5}
                  />
                  <EditableText
                    id="enableTexting.feature1"
                    className="text-[13px] leading-[1.25] tracking-[-0.13px] text-gray-900"
                  >
                    25 conversations included per month
                  </EditableText>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircleIcon
                    className="size-4 shrink-0 text-purple-600"
                    strokeWidth={1.5}
                  />
                  <EditableText
                    id="enableTexting.feature2"
                    className="text-[13px] leading-[1.25] tracking-[-0.13px] text-gray-900"
                  >
                    $1 per additional conversation
                  </EditableText>
                </div>
              </div>
            </div>

            {/* CTA + billing agreement */}
            <div className="flex flex-col items-center gap-5">
              <button
                type="button"
                onClick={onConfirm}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-purple-600 bg-gradient-to-b from-[#E66464]/25 px-5 text-[14px] font-medium tracking-[-0.14px] text-white transition-colors hover:bg-purple-800"
              >
                <EditableText id="enableTexting.confirmBtn" as="span">
                  Enable Website Texting
                </EditableText>
              </button>

              <p className="text-center text-[12px] font-medium leading-[1.4] text-[#323232]">
                {isTrial ? (
                  <EditableText id="enableTexting.trialDisclaimer" as="span">
                    You won't be charged during your trial. Billing begins when
                    your trial ends, and you agree to monthly charges and
                    overages from then.
                  </EditableText>
                ) : (
                  <EditableText id="enableTexting.disclaimer" as="span">
                    By enabling Website Texting, you agree to monthly charges
                    and overages
                  </EditableText>
                )}{" "}
                <EditableText
                  id="enableTexting.terms"
                  as="span"
                  className="cursor-pointer text-purple-700 hover:underline"
                >
                  Terms of Service
                </EditableText>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
