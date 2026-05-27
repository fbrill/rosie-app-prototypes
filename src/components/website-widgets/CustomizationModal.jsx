"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline"
import {
  GreetingWidget,
  ExpandedWidget,
  WELCOME_DEFAULTS,
} from "./WidgetPreview"

const TYPE_LABEL = { chat: "Website Chat", texting: "Website Texting" }
const MAX_MESSAGE = 150

const POSITION_OPTIONS = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
]

const OPEN_MODE_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "delay", label: "After 5 seconds" },
  { value: "scroll", label: "On scroll" },
]

// Where the widget sits inside the preview frame, per position setting.
const POSITION_ALIGN = {
  "bottom-right": "items-end justify-end",
  "bottom-left": "items-end justify-start",
  "top-right": "items-start justify-end",
  "top-left": "items-start justify-start",
}

/** Label + optional sublabel for a settings row. */
function FieldLabel({ label, sublabel }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-black">{label}</p>
      {sublabel && <p className="text-sm text-gray-600">{sublabel}</p>}
    </div>
  )
}

/** Side-by-side settings row: labels on the left, control on the right. */
function Row({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <FieldLabel label={label} sublabel={sublabel} />
      <div className="shrink-0">{children}</div>
    </div>
  )
}

/** Native select dressed to match the design system. */
function Select({ value, onChange, options, width = "w-[170px]" }) {
  return (
    <div className={`relative ${width}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-[10px] border border-gray-300 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
        strokeWidth={2}
      />
    </div>
  )
}

/**
 * Website-widget customization modal. Two columns: a settings form on the left
 * (primary color, avatar, welcome message, position, open mode) and a live
 * preview on the right with Greeting / Expanded tabs. Title and the welcome
 * placeholder vary by `type` ("chat" vs "texting"). Edits are kept in a local
 * draft; Save lifts them up, Cancel discards.
 *
 * @param {boolean} open
 * @param {"chat"|"texting"} type
 * @param {object} settings                 - current saved settings
 * @param {() => void} onCancel
 * @param {(next: object) => void} onSave
 */
export default function CustomizationModal({
  open,
  type = "texting",
  settings,
  onCancel,
  onSave,
}) {
  const [draft, setDraft] = useState(settings)
  const [tab, setTab] = useState("expanded")
  const fileRef = useRef(null)

  // Reset the draft (and preview tab) every time the modal opens.
  useEffect(() => {
    if (open) {
      setDraft(settings)
      setTab("expanded")
    }
  }, [open, settings])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onCancel()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ avatarUrl: String(reader.result) })
    reader.readAsDataURL(file)
    e.target.value = "" // allow re-picking the same file
  }

  const label = TYPE_LABEL[type] ?? "Website Widget"
  const message = draft?.welcomeMessage ?? ""

  return (
    <AnimatePresence>
      {open && draft && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_48px_-12px_rgba(42,20,60,0.25)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} configuration`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-6 py-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-[19px] font-bold tracking-[-0.02em] text-black">
                  {label} — Configuration
                </h2>
                <p className="text-[13px] font-medium tracking-[-0.01em] text-gray-700">
                  Change your website widget.
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                aria-label="Close"
              >
                <XMarkIcon className="size-5 stroke-[2]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              {/* Form */}
              <div className="flex w-full flex-col gap-6 overflow-y-auto px-6 py-6 md:w-[430px] md:shrink-0">
                <Row label="Primary Color" sublabel="Used on buttons & headers.">
                  <div className="flex items-center gap-2">
                    <label className="relative block size-9 cursor-pointer overflow-hidden rounded-lg border border-gray-300">
                      <span
                        className="block size-full"
                        style={{ backgroundColor: draft.primaryColor }}
                      />
                      <input
                        type="color"
                        value={draft.primaryColor}
                        onChange={(e) => set({ primaryColor: e.target.value })}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label="Primary color"
                      />
                    </label>
                    <input
                      type="text"
                      value={draft.primaryColor}
                      onChange={(e) => set({ primaryColor: e.target.value })}
                      maxLength={7}
                      className="w-[104px] rounded-[10px] border border-gray-300 px-3 py-2 text-sm uppercase text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      aria-label="Primary color hex"
                    />
                  </div>
                </Row>

                <Row label="Avatar" sublabel="Format: PNG, JPG. Max 2MB.">
                  <div className="flex items-center gap-3">
                    <img
                      src={draft.avatarUrl}
                      alt=""
                      className="size-10 rounded-full border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      <ArrowUpTrayIcon className="size-4" strokeWidth={2} />
                      Replace
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={onPickAvatar}
                      className="hidden"
                    />
                  </div>
                </Row>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-black">
                    Widget Welcome Message
                  </p>
                  <div className="relative">
                    <textarea
                      rows={4}
                      maxLength={MAX_MESSAGE}
                      value={message}
                      onChange={(e) => set({ welcomeMessage: e.target.value })}
                      placeholder={WELCOME_DEFAULTS[type]}
                      className="w-full resize-none rounded-[10px] border border-gray-300 p-3 pb-7 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-gray-500">
                      {message.length} / {MAX_MESSAGE}
                    </span>
                  </div>
                </div>

                <Row label="Widget Position">
                  <Select
                    value={draft.position}
                    onChange={(v) => set({ position: v })}
                    options={POSITION_OPTIONS}
                  />
                </Row>

                <Row label="When should the widget open?">
                  <Select
                    value={draft.openMode}
                    onChange={(v) => set({ openMode: v })}
                    options={OPEN_MODE_OPTIONS}
                  />
                </Row>
              </div>

              {/* Preview */}
              <div className="flex w-full min-w-0 flex-col px-6 py-6 md:flex-1">
                <div className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[16px] border border-gray-200 bg-gradient-to-b from-slate-50 to-slate-200 p-5">
                  {/* Header bar — sits inside the gradient */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold uppercase tracking-[0.12em] text-black">
                      Preview
                    </span>
                    <div className="inline-flex items-center rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(16,24,40,0.12)]">
                      {[
                        ["greeting", "Greeting Widget"],
                        ["expanded", "Expanded Widget"],
                      ].map(([value, text]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setTab(value)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            tab === value
                              ? "bg-black text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Widget area — positioned per the chosen corner */}
                  <div
                    className={`flex flex-1 pt-6 ${
                      POSITION_ALIGN[draft.position] ?? POSITION_ALIGN["bottom-right"]
                    }`}
                  >
                    {tab === "greeting" ? (
                      <GreetingWidget type={type} settings={draft} />
                    ) : (
                      <ExpandedWidget type={type} settings={draft} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-25 px-6 py-4">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSave(draft)}
                className="cursor-pointer rounded-full bg-purple-700 px-5 py-2 text-[14px] font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.08)] transition-colors hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
