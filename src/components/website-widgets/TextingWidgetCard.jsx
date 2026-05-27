import {
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  IdentificationIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhoneArrowUpRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import { Badge, ActiveBadge } from "./Badge"
import HowItWorks from "./HowItWorks"
import PhoneCapabilities from "./PhoneCapabilities"

const TEXTING_STEPS = [
  {
    n: 1,
    icon: CursorArrowRaysIcon,
    title: "Visitor opens widget",
    body: "A bubble appears in the corner of your site.",
  },
  {
    n: 2,
    icon: IdentificationIcon,
    title: "They enter name + phone",
    body: "Captured before the conversation starts.",
  },
  {
    n: 3,
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: "Rosie texts them",
    body: "The conversation continues over SMS.",
  },
  {
    n: 4,
    icon: PhoneArrowUpRightIcon,
    title: "You capture a lead",
    body: "Call them back anytime — even after they leave your site.",
  },
]

/**
 * Website Texting card across its setup stages: provisioning the SMS number
 * (inactive → in progress → active), and the live active state with a
 * switch-back-to-chat affordance. The add-on is enabled straight from the
 * compare table, so this card opens on the number-activation step.
 *
 * @param {string} stage           - "texting-inactive" | "texting-inprogress" | "texting-active"
 * @param {string} numberStatus    - "inactive" | "inProgress" | "active"
 * @param {() => void} onActivateNumber
 * @param {() => void} onSwitchToChat
 */
export default function TextingWidgetCard({
  stage,
  numberStatus,
  onActivateNumber,
  onSwitchToChat,
}) {
  const isActive = stage === "texting-active"

  return (
    <SectionCard
      icon={ChatBubbleLeftRightIcon}
      title="Website Texting"
      headerRight={
        <div className="flex items-center gap-2.5">
          {isActive ? (
            <ActiveBadge />
          ) : (
            <Badge label="Inactive" variant="inactive" />
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6 p-6">
        <p className="text-sm text-gray-700">
          Turn visitors into real leads. Website Texting captures name &amp;
          phone before the conversation starts, then continues over SMS — so you
          can follow up even after they leave.
        </p>

        <PhoneCapabilities
          status={numberStatus}
          onActivate={onActivateNumber}
          className="rounded-[12px] border border-gray-200 bg-gray-25 p-5"
        />

        {isActive && <HowItWorks steps={TEXTING_STEPS} />}
      </div>

      {/* Switch-back row, only when texting is live */}
      {isActive && (
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 bg-gray-25 px-6 py-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-200">
            <ChatBubbleOvalLeftEllipsisIcon
              className="size-5 text-gray-700"
              strokeWidth={1.5}
            />
          </span>
          <div className="min-w-[220px] flex-1">
            <p className="text-base font-semibold text-black">
              Prefer anonymous Q&amp;A?
            </p>
            <p className="text-sm text-gray-700">
              Switch back to Website Chat anytime — it&apos;s instant and keeps
              your existing snippet.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToChat}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            <ArrowUturnLeftIcon className="size-4" strokeWidth={2} />
            Switch to Website Chat
          </button>
        </div>
      )}
    </SectionCard>
  )
}
