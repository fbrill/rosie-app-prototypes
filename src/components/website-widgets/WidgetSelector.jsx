import {
  WindowIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import InfoBanner from "./InfoBanner"
import SmsIcon from "./SmsIcon"
import { LiveBadge } from "./Badge"
import NumberStatusBadge from "./NumberStatusBadge"

/** Purple icon treatment when active; grayscale when not. */
function IconCircle({ icon: Icon, active }) {
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
        active ? "bg-purple-200" : "bg-gray-100"
      }`}
    >
      <Icon
        className={`size-5 ${active ? "text-purple-700" : "text-gray-400"}`}
        strokeWidth={1.5}
      />
    </span>
  )
}

/** One widget option row in the radio group. */
function OptionRow({ icon, title, desc, active, right }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-[12px] border p-4 transition-colors ${
        active ? "border-purple-300 bg-purple-25" : "border-gray-200 bg-white"
      }`}
    >
      <IconCircle icon={icon} active={active} />
      <div className="min-w-[180px] flex-1">
        <p
          className={`text-base font-semibold ${
            active ? "text-black" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
      <div className="ml-auto shrink-0">{right}</div>
    </div>
  )
}

const outlineBtn =
  "flex shrink-0 items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"

/**
 * Single "Widget" container: an info note that only one widget can be live at a
 * time, then a radio group of the two widget types (Website Chat / Website
 * Texting). The live type gets the purple icon + radio treatment and a "Live"
 * pill; the other is grayscale with the action to switch to it (Compare for
 * Texting, Switch for Chat). Interim stages (provisioning, scheduled switch)
 * render as notices below the group.
 *
 * @param {string} stage
 * @param {"chat"|"texting"} liveWidget
 * @param {string} periodEndLabel
 * @param {() => void} onUpsell       - open the compare view
 * @param {() => void} onSwitchToChat - open the billing switch-back modal
 * @param {() => void} onKeepTexting  - cancel a scheduled switch
 */
export default function WidgetSelector({
  stage,
  liveWidget,
  periodEndLabel,
  onUpsell,
  onSwitchToChat,
  onKeepTexting,
}) {
  const chatLive = liveWidget === "chat"
  const textingLive = liveWidget === "texting"
  const isProvisioning = stage === "provisioning"
  const isScheduled = stage === "texting-scheduled"

  const chatRight = chatLive ? (
    <LiveBadge label="Active" />
  ) : isScheduled ? (
    <span className="text-sm font-medium text-gray-500">
      Resumes {periodEndLabel}
    </span>
  ) : (
    <button
      type="button"
      onClick={onSwitchToChat}
      className={`${outlineBtn} border-gray-300 bg-white text-gray-900 hover:bg-gray-50`}
    >
      <ArrowUturnLeftIcon className="size-4" strokeWidth={2} />
      Switch to Chat
    </button>
  )

  const textingRight = textingLive ? (
    <LiveBadge label="Live" />
  ) : isProvisioning ? (
    <NumberStatusBadge status="inProgress" />
  ) : (
    <button
      type="button"
      onClick={onUpsell}
      className={`${outlineBtn} border-purple-300 bg-white text-purple-700 hover:bg-purple-50`}
    >
      Compare
      <ArrowRightIcon className="size-4" strokeWidth={2} />
    </button>
  )

  return (
    <SectionCard icon={WindowIcon} title="Widget">
      <InfoBanner>
        You can run one widget at a time. Switching is instant and keeps your
        existing install snippet — only the live experience changes.
      </InfoBanner>

      <div className="flex flex-col gap-3 p-6">
        <OptionRow
          icon={ChatBubbleOvalLeftEllipsisIcon}
          title="Website Chat"
          desc="Instant, anonymous answers to common questions — free and great for quick support, but it can't capture who the visitor was."
          active={chatLive}
          right={chatRight}
        />

        <OptionRow
          icon={SmsIcon}
          title="Website Texting"
          desc="Captures name & phone, then continues over SMS — so you can follow up and turn visitors into leads, even after they leave. $50/mo."
          active={textingLive}
          right={textingRight}
        />

        {isProvisioning && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-blue-200 bg-blue-50 p-4">
            <div className="bg-white border border-black/10 rounded-full pl-3 pr-5 py-1.5 flex items-center gap-2.5">
              <span className="text-base font-bold text-black flex items-center gap-2.5">
                <ClockIcon className="size-4 shrink-0 text-blue-700" />
                (954) 333-3343
              </span>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-sm text-black">
                We&apos;re provisioning your number for SMS - this takes a few
                minutes.
              </p>
              <p className="text-sm text-gray-700">
                Your site keeps showing Website Chat until it&apos;s ready, then
                switches over automatically.
              </p>
            </div>
          </div>
        )}

        {isScheduled && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[10px] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <CalendarDaysIcon
              className="size-5 shrink-0 text-blue-700"
              strokeWidth={1.5}
            />
            <p className="min-w-[200px] flex-1 leading-snug">
              <span className="font-semibold">
                Switching to Website Chat on {periodEndLabel}.
              </span>{" "}
              You keep Website Texting until your billing period ends.
            </p>
            <button
              type="button"
              onClick={onKeepTexting}
              className="shrink-0 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/90"
            >
              Keep Website Texting
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
