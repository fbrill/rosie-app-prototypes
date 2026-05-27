import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"

const CHAT_FEATURES = [
  { label: "Instant answers, 24/7", yes: true },
  { label: "No contact info required", yes: true },
  { label: "Trained on your business info", yes: true },
  { label: "No name or phone captured", yes: false },
  { label: "Conversation ends when tab closes", yes: false },
  { label: "No follow-up possible", yes: false },
]

const TEXTING_FEATURES = [
  { label: "Instant answers, 24/7", yes: true },
  { label: "Trained on your business info", yes: true },
  { label: "Captures name + phone", yes: true },
  { label: "Continues over SMS after they leave", yes: true },
  { label: "Push notification when a lead comes in", yes: true },
  { label: "You can call them back tomorrow", yes: true },
]

function FeatureList({ features }) {
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

/**
 * Compare takeover: Website Chat vs Website Texting side by side, with the
 * "one widget at a time" reassurance. Chat is the current widget; Texting is
 * the upgrade (or an instant switch once provisioned).
 *
 * @param {() => void} onBack
 * @param {() => void} onUpgrade
 * @param {boolean} provisioned - texting already set up → instant switch
 */
export default function CompareView({ onBack, onUpgrade, provisioned }) {
  return (
    <section className="rounded-[12px] border border-gray-200 bg-white p-6 sm:p-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black"
      >
        <ArrowLeftIcon className="size-4" strokeWidth={2} />
        Back to Website Chat
      </button>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-black">
        Compare website widgets
      </h2>
      <p className="mt-1 text-gray-700">
        Both work great. Texting captures contact info so you can follow up —
        chat doesn&apos;t.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Chat column */}
        <div className="flex flex-col rounded-[12px] border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <ChatBubbleOvalLeftEllipsisIcon
                className="size-6 text-gray-700"
                strokeWidth={1.5}
              />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-black">Website Chat</h3>
              <p className="text-sm text-gray-600">
                Anonymous Q&amp;A on your site
              </p>
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-black">Free </p>
          <p className="text-sm font-medium text-gray-600">
            included with every plan
          </p>

          <div className="my-5 h-px bg-gray-200" />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-gray-600">
            Best for
          </p>
          <p className="mb-4 text-sm text-gray-700">
            Answering quick questions for casual visitors who aren&apos;t ready
            to commit yet.
          </p>
          <FeatureList features={CHAT_FEATURES} />

          <button
            type="button"
            disabled
            className="mt-6 cursor-default rounded-full bg-gray-100 py-3 text-center text-sm font-semibold text-gray-700"
          >
            Your current widget
          </button>
        </div>

        {/* Texting column (recommended) */}
        <div className="relative flex flex-col rounded-[12px] border-2 border-purple-300 p-6 bg-gradient-to-t from-purple-50 to-purple-25">
          <span className="absolute -top-3 left-6 rounded-full bg-purple-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-white">
            Recommended
          </span>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-200">
              <ChatBubbleLeftRightIcon
                className="size-6 text-purple-700"
                strokeWidth={1.5}
              />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-black">
                Website Texting
              </h3>
              <p className="text-sm text-purple-700">
                Lead Capture + SMS follow-up
              </p>
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-black">
            $50 <span className="text-sm font-medium text-gray-700">/mo</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            25 conversations included per month
            <span className="text-sm font-medium text-gray-500 px-2">·</span>
            $1 per additional conversation
          </p>

          <div className="my-5 h-px bg-gray-200" />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-purple-700">
            Best for
          </p>
          <p className="mb-4 text-sm text-gray-700">
            Turning website visitors into real leads you can call back — even
            after they leave.
          </p>
          <FeatureList features={TEXTING_FEATURES} />

          <button
            type="button"
            onClick={onUpgrade}
            className="mt-6 flex items-center justify-center gap-1.5 rounded-full bg-purple-700 py-3 text-center text-sm font-semibold text-white hover:bg-purple-600"
          >
            {provisioned ? "Switch to Website Texting" : "Upgrade for $50/mo"}
            <ArrowRightIcon className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Reassurance footnote */}
      <div className="mt-5 flex items-start gap-2 rounded-[10px] border border-gray-200 bg-gray-25 p-4">
        <InformationCircleIcon
          className="size-5 shrink-0 text-gray-600"
          strokeWidth={1.5}
        />
        <div>
          <p className="text-sm font-semibold text-black">
            You can only run one widget at a time
          </p>
          <p className="text-sm text-gray-700">
            Switching is instant and doesn&apos;t require a new install — your
            existing snippet stays on your site.
          </p>
        </div>
      </div>
    </section>
  )
}
