import {
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
  DevicePhoneMobileIcon,
  SwatchIcon,
  PencilIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import { ActiveBadge } from "./Badge"
import WidgetPreview from "./WidgetPreview"

/** Purple-circle icon + title (+ optional description) used for in-card sections. */
function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-200">
        <Icon className="size-5 text-purple-700" strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-black">{title}</h3>
        {description && (
          <p className="text-sm text-gray-700">{description}</p>
        )}
      </div>
    </div>
  )
}

/**
 * "Texting Settings" card — billing note, the SMS-enabled Rosie number, and the
 * widget appearance section with a live preview. All actions are visual-only.
 */
export default function TextingSettingsCard() {
  return (
    <SectionCard icon={ChatBubbleLeftRightIcon} title="Texting Settings">
      {/* Billing message bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-25 px-4 py-3">
        <div className="flex flex-1 items-center gap-1.5">
          <InformationCircleIcon
            className="size-5 shrink-0 text-gray-600"
            strokeWidth={1.5}
          />
          <p className="text-sm text-gray-900 opacity-80">
            Track <span className="underline">usage in billing</span>
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-gray-900"
        >
          <ArrowTopRightOnSquareIcon className="size-5" strokeWidth={1.5} />
          Try Website Texting
        </button>
      </div>

      {/* Phone Number SMS Capabilities */}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6">
        <SectionTitle
          icon={DevicePhoneMobileIcon}
          title="Phone Number SMS Capabilities"
        />
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex h-[50px] items-center justify-center gap-3 rounded-full border border-gray-200 bg-gray-25 py-1.5 pl-5 pr-3">
            <span className="text-lg font-bold text-black">(954) 333-3343</span>
            <ActiveBadge />
          </div>
          <p className="max-w-[508px] flex-1 text-sm text-gray-700">
            When you enable Website Texting, your Rosie number is automatically
            enabled for SMS. This allows the widget to send and receive text
            messages on your behalf.
          </p>
        </div>
      </div>

      {/* Widget Appearance + preview */}
      <div className="flex flex-col gap-4 p-6 pb-4">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle
            icon={SwatchIcon}
            title="Widget Appearance"
            description="Captures name & phone number before the conversation starts. Continues over SMS."
          />
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 rounded-full bg-purple-200 px-4 py-2.5 text-sm font-medium text-purple-700"
          >
            <PencilIcon className="size-5" strokeWidth={1.5} />
            Edit Widget
          </button>
        </div>

        <WidgetPreview />
      </div>
    </SectionCard>
  )
}
