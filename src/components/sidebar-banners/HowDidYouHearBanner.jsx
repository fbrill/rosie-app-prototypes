"use client"

import { useState } from "react"
import {
  QuestionMarkCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline"

const PLACEHOLDER = "Select an option..."

export default function HowDidYouHearBanner() {
  const [selected, setSelected] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    "Search engine",
    "Social media",
    "Friend or colleague",
    "Advertisement",
    "Other",
  ]

  return (
    <div className="rounded-xl border border-purple-200/60 bg-gradient-to-br from-purple-100/70 to-purple-50/70 p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm tracking-tight font-semibold text-purple-700 flex items-center gap-1">
            <QuestionMarkCircleIcon className="size-5 text-purple-700" />
            How did you hear about us?
          </h3>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-2 py-2 text-left text-sm text-gray-700"
          >
            <span className={selected ? "text-gray-900" : "text-gray-500"}>
              {selected || PLACEHOLDER}
            </span>
            <ChevronDownIcon
              className={`size-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setIsOpen(false)}
              />
              <ul
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                role="listbox"
              >
                {options.map((opt) => (
                  <li key={opt} role="option">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(opt)
                        setIsOpen(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <button
          type="button"
          className="w-full rounded-full bg-purple-200 px-3 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-300"
        >
          Share Feedback
        </button>
      </div>
    </div>
  )
}
