import {
  CursorArrowRaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "./Badge"
import SmsIcon from "./SmsIcon"

const STEPS = [
  {
    n: 1,
    icon: CursorArrowRaysIcon,
    title: "Visitor opens it",
    body: "A chat bubble appears in the corner of your site.",
  },
  {
    n: 2,
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: "They engage",
    body: "They ask a question or start a conversation.",
  },
  {
    n: 3,
    icon: SparklesIcon,
    title: "Rosie responds",
    body: "Instant answers, drawn from your training data.",
  },
  {
    n: 4,
    icon: SmsIcon,
    title: "You capture the lead on SMS",
    body: "Name & phone captured, continued over SMS — even after they leave.",
    texting: true,
  },
]

/** One step card. The fourth (texting) step is highlighted as the upsell. */
function StepCard({ step }) {
  const { icon: Icon, texting } = step
  return (
    <div
      className={`relative flex flex-col gap-2 rounded-xl border p-4 ${
        texting ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
              texting
                ? "bg-purple-600 text-white"
                : "bg-purple-200 text-purple-700"
            }`}
          >
            {step.n}
          </span>
          {texting && <Badge label="Texting" variant="betaPurple" />}
        </div>
        <Icon
          className={`size-5 ${texting ? "text-purple-600" : "text-gray-400"}`}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-sm font-semibold text-black">{step.title}</p>
      <p className="text-[13px] leading-[1.4] text-gray-700">{step.body}</p>
    </div>
  )
}

/**
 * Dismissible "how it works + upsell" banner shown above the widget containers.
 * Walks through the four-step lead journey: Website Chat handles steps 1–3, and
 * Website Texting adds the fourth — capturing the lead — which is the upsell.
 *
 * @param {() => void} onDismiss - hide the banner
 * @param {() => void} onUpsell  - open the compare view
 */
export default function HowItWorksBanner({ onDismiss, onUpsell }) {
  return (
    <section className="rounded-[12px] border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black">
            How your website widget works
          </h2>
          <p className="mt-0.5 text-sm text-gray-600">
            Website Chat covers the first three steps. Website Texting adds the
            fourth — capturing the lead.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-black"
          aria-label="Dismiss"
        >
          <XMarkIcon className="size-5" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <StepCard key={step.n} step={step} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-700">
          Want to turn visitors into leads you can follow up with? Add{" "}
          <span className="font-semibold text-purple-700">Website Texting</span>
          .
        </p>
        <button
          type="button"
          onClick={onUpsell}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
        >
          Compare Widgets
          <ArrowRightIcon className="size-4" strokeWidth={2} />
        </button>
      </div>
    </section>
  )
}
