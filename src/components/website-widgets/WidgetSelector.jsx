import { useEffect, useState } from "react"
import {
  WindowIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import InfoBanner from "./InfoBanner"
import SmsIcon from "./SmsIcon"
import { LiveBadge } from "./Badge"
import NumberStatusBadge from "./NumberStatusBadge"
import {
  ChatSwitchNotice,
  TextingLiveNotice,
  ProvisioningNotice,
  ScheduledSwitchNotice,
} from "./WidgetJourneyNotices"

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

/** One widget option row — top/bottom rows share a single bordered container. */
function OptionRow({ icon, title, desc, active, right }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 p-4 transition-colors ${
        active ? "bg-purple-25" : "bg-white"
      }`}
    >
      <IconCircle icon={icon} active={active} />
      <div className="min-w-[180px] flex-1">
        <p className="text-base font-semibold text-black">{title}</p>
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
 * @param {boolean} chatSwitchNotice         - show the post-switch-now info banner
 * @param {() => void} onUpsell              - open the compare view
 * @param {() => void} onSwitchToChat        - open the billing switch-back modal
 * @param {() => void} onKeepTexting         - cancel a scheduled switch
 * @param {() => void} onDismissChatSwitchNotice - dismiss the post-switch-now banner
 */
export default function WidgetSelector({
  stage,
  liveWidget,
  periodEndLabel,
  chatSwitchNotice,
  onUpsell,
  onSwitchToChat,
  onKeepTexting,
  onDismissChatSwitchNotice,
}) {
  const chatLive = liveWidget === "chat"
  const textingLive = liveWidget === "texting"
  const isProvisioning = stage === "provisioning"
  const isScheduled = stage === "texting-scheduled"

  // Success banner shown when Texting goes live; re-shows on each stage change
  // (e.g. after provisioning completes) and can be dismissed.
  const [successDismissed, setSuccessDismissed] = useState(false)
  useEffect(() => setSuccessDismissed(false), [stage])

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
    <LiveBadge label="Active" />
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
    <SectionCard icon={WindowIcon} title="Widget Type">
      <InfoBanner>
        You can run one widget at a time. Switching is instant and keeps your
        existing install snippet — only the live experience changes.
      </InfoBanner>

      <div className="flex flex-col gap-3 p-6">
        <div className="divide-y divide-gray-200 overflow-hidden rounded-[12px] border border-gray-200">
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
        </div>

        {stage === "chat" && chatSwitchNotice && (
          <ChatSwitchNotice
            periodEndLabel={periodEndLabel}
            onDismiss={onDismissChatSwitchNotice}
          />
        )}

        {stage === "texting" && !successDismissed && (
          <TextingLiveNotice onDismiss={() => setSuccessDismissed(true)} />
        )}

        {isProvisioning && <ProvisioningNotice />}

        {isScheduled && (
          <ScheduledSwitchNotice
            periodEndLabel={periodEndLabel}
            onKeepTexting={onKeepTexting}
          />
        )}
      </div>
    </SectionCard>
  )
}
