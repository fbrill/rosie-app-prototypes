import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline"
import InfoBanner from "./InfoBanner"
import SmsIcon from "./SmsIcon"
import { CHAT_FEATURES, TEXTING_FEATURES, FeatureList } from "./widgetCompareData"
import EditableText from "../edit-mode/EditableText"

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
        <EditableText id="compareView.backBtn">Back to Website Widgets</EditableText>
      </button>

      <EditableText
        id="compareView.heading"
        as="h2"
        className="mt-4 text-2xl font-semibold tracking-tight text-black"
      >
        Compare website widgets
      </EditableText>
      <EditableText id="compareView.subtitle" as="p" multiline className="mt-1 text-gray-700">
        Both work great. Texting captures contact info so you can follow up —
        chat doesn't.
      </EditableText>

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
              <h3 className="text-lg font-semibold text-black">
                <EditableText id="compareView.chat.title" as="span">
                  Website Chat
                </EditableText>
              </h3>
              <p className="text-sm text-gray-600">
                <EditableText id="compareView.chat.subtitle" as="span">
                  Anonymous Q&A on your site
                </EditableText>
              </p>
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-black">
            <EditableText id="compareView.chat.price" as="span">Free</EditableText>
          </p>
          <p className="text-sm font-medium text-gray-600">
            <EditableText id="compareView.chat.priceNote" as="span">
              included with every plan
            </EditableText>
          </p>

          <div className="my-5 h-px bg-gray-200" />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-gray-600">
            <EditableText id="compareView.chat.bestForLabel" as="span">
              Best for
            </EditableText>
          </p>
          <p className="mb-4 text-sm text-gray-700">
            <EditableText id="compareView.chat.bestForBody" as="span" multiline>
              Answering quick questions for casual visitors who aren't ready to
              commit yet.
            </EditableText>
          </p>
          <FeatureList features={CHAT_FEATURES} idPrefix="compareView.chatFeatures" />

          <button
            type="button"
            disabled
            className="mt-6 cursor-default rounded-full bg-gray-100 py-3 text-center text-sm font-semibold text-gray-700"
          >
            <EditableText id="compareView.chat.currentBtn">Your current widget</EditableText>
          </button>
        </div>

        {/* Texting column (recommended) */}
        <div className="relative flex flex-col rounded-[12px] border-2 border-purple-300 p-6 bg-gradient-to-t from-purple-50 to-purple-25">
          <span className="absolute -top-3 left-6 rounded-full bg-purple-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-white">
            <EditableText id="compareView.texting.badge" as="span">
              Recommended
            </EditableText>
          </span>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-200">
              <SmsIcon className="size-6 text-purple-700" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-black">
                <EditableText id="compareView.texting.title" as="span">
                  Website Texting
                </EditableText>
              </h3>
              <p className="text-sm text-purple-700">
                <EditableText id="compareView.texting.subtitle" as="span">
                  Lead Capture + SMS follow-up
                </EditableText>
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
            <EditableText id="compareView.texting.bestForLabel" as="span">
              Best for
            </EditableText>
          </p>
          <p className="mb-4 text-sm text-gray-700">
            <EditableText id="compareView.texting.bestForBody" as="span" multiline>
              Turning website visitors into real leads you can call back — even
              after they leave.
            </EditableText>
          </p>
          <FeatureList features={TEXTING_FEATURES} idPrefix="compareView.textingFeatures" />

          <button
            type="button"
            onClick={onUpgrade}
            className="mt-6 flex items-center justify-center gap-1.5 rounded-full bg-purple-700 py-3 text-center text-sm font-semibold text-white hover:bg-purple-600"
          >
            {provisioned ? (
              <EditableText id="compareView.texting.switchBtn">
                Switch to Website Texting
              </EditableText>
            ) : (
              <EditableText id="compareView.texting.upgradeBtn">
                Upgrade for $50/mo
              </EditableText>
            )}
            <ArrowRightIcon className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Reassurance footnote */}
      <InfoBanner
        variant="card"
        title={
          <EditableText id="compareView.reassure.title" as="span">
            You can only run one widget at a time
          </EditableText>
        }
        className="mt-5"
      >
        <EditableText id="compareView.reassure.body" as="span" multiline>
          Switching is instant and doesn't require a new install — your existing
          snippet stays on your site.
        </EditableText>
      </InfoBanner>
    </section>
  )
}
