import { useEffect, useState } from "react"
import {
  WindowIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
  GiftIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import InfoBanner from "./InfoBanner"
import SmsIcon from "./SmsIcon"
import { FeatureList } from "./widgetCompareData"
import EditableText from "../edit-mode/EditableText"
import {
  ChatSwitchNotice,
  ChatLiveNotice,
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

// The switch CTA is a quiet, secondary action — emphasis on the page should come
// from the active tile's border + pill, not from the button that takes you away.
const changeBtn =
  "flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-purple-200 hover:text-purple-700 hover:border-purple-200 w-full px-10 cursor-pointer"
const activeBtn =
  "flex items-center justify-center gap-1.5 cursor-default rounded-full border border-transparent bg-purple-100/70 py-2.5 text-center text-sm font-semibold text-purple-700 w-full px-10 [&>span]:text-purple-900"
// In the entry state the user MUST choose, so the select CTAs are prominent
// (filled purple) rather than the quiet outline "switch" treatment.
const selectBtn =
  "flex items-center justify-center gap-1.5 rounded-full bg-purple-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-purple-800 w-full px-10 cursor-pointer"

/**
 * One option card: icon + title + subtitle, neutral price, a vertical checkmark
 * feature list (with an optional intro line), and a footer slot. The active
 * widget gets a purple selected treatment.
 */
function WidgetCard({
  icon: Icon,
  title,
  subtitle,
  price,
  priceNote,
  priceBadge,
  features,
  featuresIntro,
  featuresIdPrefix,
  active,
  footer,
}) {
  return (
    <div
      className={`flex flex-col rounded-[12px] border-2 p-6 transition-colors ${
        active
          ? "border-purple-400 bg-purple-25 shadow-sm shadow-purple-100"
          : "border-gray-200 bg-white"
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
      </div>

      <div
        className={`flex flex-col gap-1 p-4 rounded-lg mt-4 ${active ? "bg-purple-100/70" : "bg-gray-50"}`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-black">{price}</p>
          {priceBadge}
        </div>
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
 * @param {"none"|"chat"|"texting"} liveWidget
 * @param {string} periodEndLabel
 * @param {boolean} chatSelectedNotice
 * @param {boolean} chatSwitchNotice
 * @param {boolean} isTrial                     - account in trial → texting is free during it
 * @param {() => void} onSelectChat             - pick Chat from the entry state
 * @param {() => void} onChangeToTexting        - subscribe (auto-provisions)
 * @param {() => void} onChangeToChat           - open the billing switch-back modal
 * @param {() => void} onKeepTexting            - cancel a scheduled switch
 * @param {() => void} onDismissChatSelectedNotice
 * @param {() => void} onDismissChatSwitchNotice
 */
export default function WidgetCompareInline({
  stage,
  liveWidget,
  periodEndLabel,
  chatSelectedNotice,
  chatSwitchNotice,
  isTrial = false,
  onSelectChat,
  onChangeToTexting,
  onChangeToChat,
  onKeepTexting,
  onDismissChatSelectedNotice,
  onDismissChatSwitchNotice,
}) {
  const noneSelected = liveWidget === "none"
  const chatActive = liveWidget === "chat"
  const textingActive = liveWidget === "texting"
  const isProvisioning = stage === "provisioning"
  const isScheduled = stage === "texting-scheduled"

  // Re-show the texting-live success banner on each stage change; dismissible.
  const [successDismissed, setSuccessDismissed] = useState(false)
  useEffect(() => setSuccessDismissed(false), [stage])

  // Scroll down to the Installation section (the next step after selecting).
  const scrollToInstall = () =>
    document
      .getElementById("installation")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })

  const chatFooter = chatActive ? (
    <button type="button" disabled className={activeBtn}>
      <CheckIcon className="size-4 shrink-0" strokeWidth={2} />
      <EditableText id="compare.chat.activeBtn">Selected Widget</EditableText>
    </button>
  ) : noneSelected ? (
    <button type="button" onClick={onSelectChat} className={selectBtn}>
      <EditableText id="compare.chat.selectBtn">
        Select Website Chat
      </EditableText>
    </button>
  ) : isScheduled ? (
    <div className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gray-100 px-10 py-3 text-center text-sm font-medium text-gray-500">
      <CalendarDaysIcon className="size-4 shrink-0" strokeWidth={2} />
      Resumes {periodEndLabel}
    </div>
  ) : (
    <button type="button" onClick={onChangeToChat} className={changeBtn}>
      <EditableText id="compare.chat.changeBtn">
        Switch to Website Chat
      </EditableText>
      <ArrowRightIcon className="size-4 shrink-0" strokeWidth={2} />
    </button>
  )

  const textingFooter = textingActive ? (
    <button type="button" disabled className={activeBtn}>
      <CheckIcon className="size-4 shrink-0" strokeWidth={2} />
      <EditableText id="compare.texting.activeBtn">Selected Widget</EditableText>
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
  ) : noneSelected ? (
    <button type="button" onClick={onChangeToTexting} className={selectBtn}>
      <EditableText id="compare.texting.selectBtn">
        Select Website Texting
      </EditableText>
    </button>
  ) : (
    <button type="button" onClick={onChangeToTexting} className={changeBtn}>
      <EditableText id="compare.texting.changeBtn">
        Switch to Website Texting
      </EditableText>
      <ArrowRightIcon className="size-4 shrink-0" strokeWidth={2} />
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
        {noneSelected ? (
          <EditableText id="compare.infoNone" multiline>
            Choose the widget you want on your site to get started. Neither is
            live yet — nothing runs on your site until you pick one.
          </EditableText>
        ) : (
          <EditableText id="compare.info" multiline>
            You can run one widget at a time. Switching is instant and keeps your
            existing install snippet — only the live experience changes.
          </EditableText>
        )}
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
            priceBadge={
              isTrial ? (
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-amber-700">
                  <GiftIcon
                    className="size-3.5 shrink-0 text-amber-500"
                    strokeWidth={1.8}
                  />
                  <EditableText id="compare.texting.trialBanner" as="span">
                    Free during trial
                  </EditableText>
                </span>
              ) : null
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

        {stage === "chat" && chatSelectedNotice && (
          <ChatLiveNotice
            onDismiss={onDismissChatSelectedNotice}
            onGoToInstall={scrollToInstall}
          />
        )}

        {stage === "chat" && chatSwitchNotice && (
          <ChatSwitchNotice
            periodEndLabel={periodEndLabel}
            onDismiss={onDismissChatSwitchNotice}
          />
        )}

        {stage === "texting" && !successDismissed && (
          <TextingLiveNotice
            onDismiss={() => setSuccessDismissed(true)}
            onGoToInstall={scrollToInstall}
          />
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
