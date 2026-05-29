import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

/**
 * Feature lists + the FeatureList renderer shared between the version-A compare
 * takeover (CompareView) and the version-B inline comparison (WidgetCompareInline).
 * Kept in one place so the two variants always show identical feature copy.
 */

export const CHAT_FEATURES = [
  { label: "Instant answers, 24/7", yes: true },
  { label: "No contact info required", yes: true },
  { label: "Trained on your business info", yes: true },
  { label: "No name or phone captured", yes: false },
  { label: "Conversation ends when tab closes", yes: false },
  { label: "No follow-up possible", yes: false },
]

export const TEXTING_FEATURES = [
  { label: "Instant answers, 24/7", yes: true },
  { label: "Trained on your business info", yes: true },
  { label: "Captures name + phone", yes: true },
  { label: "Continues over SMS after they leave", yes: true },
  { label: "Push notification when a lead comes in", yes: true },
  { label: "You can call them back tomorrow", yes: true },
]

export function FeatureList({ features }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {features.map((f) => (
        <li key={f.label} className="flex items-start gap-2">
          {f.yes ? (
            <CheckIcon
              className="mt-0.5 size-5 shrink-0 text-purple-600"
              strokeWidth={2}
            />
          ) : (
            <XMarkIcon
              className="mt-0.5 size-5 shrink-0 text-gray-400"
              strokeWidth={2}
            />
          )}
          <span
            className={`text-sm ${f.yes ? "font-medium text-black" : "text-gray-500"}`}
          >
            {f.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
