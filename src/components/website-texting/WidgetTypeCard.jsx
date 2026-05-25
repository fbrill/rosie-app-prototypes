"use client"

import { useState } from "react"
import {
  InformationCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import { Badge } from "./Badge"

const OPTIONS = [
  {
    id: "chat",
    title: "Website Chat",
    description:
      "Answer questions instantly. Visitors chat directly with your AI agent. (No contact info collected)",
  },
  {
    id: "texting",
    title: "Website Texting",
    premium: true,
    description:
      "Turn visitors into real leads. Collects name and phone number, then continues the conversation over SMS.",
  },
]

function Radio({ selected }) {
  if (selected) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600">
        <span className="size-2.5 rounded-full bg-white" />
      </span>
    )
  }
  return <span className="size-6 shrink-0 rounded-full border-2 border-gray-300" />
}

/**
 * "Widget Type" card — two radio tiles letting the user pick Website Chat or
 * Website Texting. Selection is interactive (highlight moves) but does not yet
 * drive conditional content; that is deferred to the options plan.
 */
export default function WidgetTypeCard() {
  const [selected, setSelected] = useState("texting")

  return (
    <SectionCard icon={ChatBubbleOvalLeftEllipsisIcon} title="Widget Type">
      {/* Info bar */}
      <div className="flex items-start gap-2 border-b border-gray-100 bg-gray-25 p-4">
        <InformationCircleIcon
          className="size-5 shrink-0 text-gray-600"
          strokeWidth={1.5}
        />
        <p className="text-sm text-gray-900 opacity-80">
          Rosie can either capture the lead through texting or converse with the
          lead on your website.
        </p>
      </div>

      {/* Option tiles */}
      <div className="flex flex-col gap-4 p-6 sm:flex-row">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={`flex flex-1 items-start gap-2 rounded-[10px] border-2 px-5 py-4 text-left ${
                isSelected
                  ? "border-purple-300 bg-purple-100"
                  : "border-transparent bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <Radio selected={isSelected} />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-medium text-black">
                    {option.title}
                  </span>
                  {option.premium && (
                    <Badge label="Premium" variant="premium" />
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-gray-800">
                  {option.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </SectionCard>
  )
}
