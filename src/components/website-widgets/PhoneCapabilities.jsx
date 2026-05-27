import {
  DevicePhoneMobileIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"
import SectionTitle from "./SectionTitle"
import NumberStatusBadge from "./NumberStatusBadge"

const DESCRIPTION =
  "When you enable Website Texting, your Rosie number is automatically enabled for SMS. This allows the widget to send and receive text messages on your behalf."

/** Status-specific footer beneath the number row. */
function StatusFooter({ status, onActivate }) {
  if (status === "inactive") {
    return (
      <button
        type="button"
        onClick={onActivate}
        className="phone-glow self-start rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600"
      >
        Activate number
      </button>
    )
  }
  if (status === "inProgress") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-gray-600">
        <InformationCircleIcon className="size-5 shrink-0" strokeWidth={1.5} />
        Setup can take a few minutes.
      </p>
    )
  }
  return (
    <p className="flex items-center gap-1.5 text-sm text-gray-600">
      <ArrowTopRightOnSquareIcon
        className="size-5 shrink-0"
        strokeWidth={1.5}
      />
      Track <span className="underline">usage in billing</span>.
    </p>
  )
}

/**
 * "Phone Number SMS Capabilities" block. The number carries one of three
 * statuses (inactive / inProgress / active); when inactive it offers an
 * Activate action that kicks off provisioning.
 */
export default function PhoneCapabilities({
  status = "active",
  onActivate,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <SectionTitle
        icon={DevicePhoneMobileIcon}
        title="Phone Number SMS Capabilities"
      />
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex h-[50px] items-center gap-3 rounded-full border border-gray-200 bg-white min-w-[280px] justify-between py-1.5 pl-5 pr-3">
          <span className="text-lg font-bold text-black">(954) 333-3343</span>
          <NumberStatusBadge status={status} />
        </div>
        <p className="max-w-[508px] flex-1 text-sm text-gray-700">
          {DESCRIPTION}
        </p>
      </div>
      <StatusFooter status={status} onActivate={onActivate} />
    </div>
  )
}
