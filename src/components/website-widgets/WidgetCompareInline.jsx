import { useEffect, useState } from "react"
import {
  WindowIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import InfoBanner from "./InfoBanner"
import SmsIcon from "./SmsIcon"
import { LiveBadge } from "./Badge"
import { FeatureList } from "./widgetCompareData"
import EditableText from "../edit-mode/EditableText"
import {
  ChatSwitchNotice,
  TextingLiveNotice,
  ProvisioningNotice,
  ScheduledSwitchNotice,
  Spinner,
} from "./WidgetJourneyNotices"

// Feature summaries (B-only): Chat lists its three core strengths; Texting lists
// only the value it adds on top of Chat (under an "Everything in Website Chat,
// plus" line). All render as checkmarks.
const CHAT_FEATURES = [
  "Instant answers, 24/7",
  "No contact info required",
  "Trained on your business info",
]
const TEXTING_FEATURES = [
  "Captures name + phone",
  "Continues over SMS after they leave",
  "Notifies you of new leads",
  "Call them back anytime",
]

const changeBtn =
  "flex items-center justify-center gap-1.5 rounded-full bg-black py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-black/90 w-full px-10 cursor-pointer"
const activeBtn =
  "cursor-default rounded-full bg-black/10 py-3 text-center text-sm font-semibold text-black/60 w-full px-10"

/**
 * One option card: icon + title + subtitle, neutral price, a vertical checkmark
 * feature list (with an optional intro line), and a footer slot. The active
 * widget gets a purple selected treatment and an "Active" badge.
 */
function WidgetCard({
  icon: Icon,
  title,
  subtitle,
  price,
  priceNote,
  features,
  featuresIntro,
  featuresIdPrefix,
  active,
  footer,
}) {
  return (
    <div
      className={`flex flex-col rounded-[12px] border p-6 transition-colors ${
        active ? "border-purple-300 bg-purple-25" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              active ? "bg-purple-200" : "bg-gray-100"
            }`}
          >
            <Icon
              className={`size-6 ${active ? "text-purple-700" : "text-gray-700"}`}
              strokeWidth={1.5}
            />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        {active && <LiveBadge label="Active" />}
      </div>

      <div
        className={`flex flex-col gap-1 p-4 rounded-lg mt-4 ${active ? "bg-purple-100/70" : "bg-gray-50"}`}
      >
        <p className={`text-lg font-semibold text-black`}>{price}</p>
        <p className={`text-sm ${active ? "text-black/50" : "text-gray-600"}`}>
          {priceNote}
        </p>
      </div>

      <div className="mt-4">
        {featuresIntro && (
          <p className="mb-2.5 text-sm font-medium text-gray-600">
            {featuresIntro}
          </p>
        )}
        <FeatureList
          features={features.map((label) => ({ label, yes: true }))}
          idPrefix={featuresIdPrefix}
        />
      </div>

      <div className="mt-auto pt-6">{footer}</div>
    </div>
  )
}

/**
 * Version B's "Website Widget" container: one inline, side-by-side comparison of
 * Website Chat and Website Texting — styled like a radio group of two options
 * without radio buttons. Neutral framing (no "Recommended"/"Upgrade"): here are
 * your two options, here's the difference, here's the one you're using, with the
 * option to switch. Reuses the shared journey notices for the interim states.
 *
 * @param {string} stage
 * @param {"chat"|"texting"} liveWidget
 * @param {string} periodEndLabel
 * @param {boolean} chatSwitchNotice
 * @param {() => void} onChangeToTexting        - subscribe (auto-provisions)
 * @param {() => void} onChangeToChat           - open the billing switch-back modal
 * @param {() => void} onKeepTexting            - cancel a scheduled switch
 * @param {() => void} onDismissChatSwitchNotice
 */
export default function WidgetCompareInline({
  stage,
  liveWidget,
  periodEndLabel,
  chatSwitchNotice,
  onChangeToTexting,
  onChangeToChat,
  onKeepTexting,
  onDismissChatSwitchNotice,
}) {
  const chatActive = liveWidget === "chat"
  const textingActive = liveWidget === "texting"
  const isProvisioning = stage === "provisioning"
  const isScheduled = stage === "texting-scheduled"

  // Re-show the texting-live success banner on each stage change; dismissible.
  const [successDismissed, setSuccessDismissed] = useState(false)
  useEffect(() => setSuccessDismissed(false), [stage])

  const chatFooter = chatActive ? (
    <button type="button" disabled className={activeBtn}>
      <EditableText id="compare.chat.activeBtn">Active widget</EditableText>
    </button>
  ) : isScheduled ? (
    <div className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gray-100 px-10 py-3 text-center text-sm font-medium text-gray-500">
      <CalendarDaysIcon className="size-4 shrink-0" strokeWidth={2} />
      Resumes {periodEndLabel}
    </div>
  ) : (
    <button type="button" onClick={onChangeToChat} className={changeBtn}>
      <EditableText id="compare.chat.changeBtn">Change to this one</EditableText>
    </button>
  )

  const textingFooter = textingActive ? (
    <button type="button" disabled className={activeBtn}>
      <EditableText id="compare.texting.activeBtn">Active widget</EditableText>
    </button>
  ) : isProvisioning ? (
    <div
      aria-live="polite"
      className="flex cursor-default items-center justify-center gap-2 rounded-full bg-blue-50 py-3 text-center text-sm font-semibold text-blue-700"
    >
      <Spinner className="size-5 text-blue-500" />
      <EditableText id="compare.texting.switchingBtn">
        Switching over...
      </EditableText>
    </div>
  ) : (
    <button type="button" onClick={onChangeToTexting} className={changeBtn}>
      <EditableText id="compare.texting.changeBtn">Change to this one</EditableText>
    </button>
  )

  return (
    <SectionCard
      icon={WindowIcon}
      title={
        <EditableText id="compare.sectionTitle" as="span">
          Website Widget
        </EditableText>
      }
    >
      <InfoBanner>
        <EditableText id="compare.info" multiline>
          You can run one widget at a time. Switching is instant and keeps your
          existing install snippet — only the live experience changes.
        </EditableText>
      </InfoBanner>

      <div className="flex flex-col gap-5 p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <WidgetCard
            icon={ChatBubbleOvalLeftEllipsisIcon}
            title={
              <EditableText id="compare.chat.title" as="span">
                Website Chat
              </EditableText>
            }
            subtitle={
              <EditableText id="compare.chat.subtitle" as="span">
                Anonymous Q&A on your site
              </EditableText>
            }
            price={
              <EditableText id="compare.chat.price" as="span">
                Free
              </EditableText>
            }
            priceNote={
              <EditableText id="compare.chat.priceNote" as="span">
                included with every plan
              </EditableText>
            }
            features={CHAT_FEATURES}
            featuresIdPrefix="compare.chatFeatures"
            active={chatActive}
            footer={chatFooter}
          />

          <WidgetCard
            icon={SmsIcon}
            title={
              <EditableText id="compare.texting.title" as="span">
                Website Texting
              </EditableText>
            }
            subtitle={
              <EditableText id="compare.texting.subtitle" as="span">
                Lead capture + SMS follow-up
              </EditableText>
            }
            price={
              <>
                $50{" "}
                <span className="text-sm font-medium text-gray-700">/mo</span>
              </>
            }
            priceNote={
              <EditableText id="compare.texting.priceNote" as="span">
                25 conversations included per month · $1 per additional
              </EditableText>
            }
            features={TEXTING_FEATURES}
            featuresIntro={
              <EditableText id="compare.texting.featuresIntro" as="span">
                Everything in Website Chat, plus:
              </EditableText>
            }
            featuresIdPrefix="compare.textingFeatures"
            active={textingActive}
            footer={textingFooter}
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
