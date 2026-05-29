import {
  CalendarDaysIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import EditableText from "../edit-mode/EditableText"

/**
 * Interim-state notices for the widget journey, shared between the version-A
 * stacked selector (WidgetSelector) and the version-B inline comparison
 * (WidgetCompareInline). Each is a 1:1 extraction of the banner that used to
 * live inline in WidgetSelector — the consumer owns the stage-gating and any
 * dismiss state.
 */

/** Blue banner after a "Switch now" back to Chat — add-on expires at period end. */
export function ChatSwitchNotice({ periodEndLabel, onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
      <InformationCircleIcon
        className="mt-0.5 size-5 shrink-0 text-blue-700"
        strokeWidth={1.5}
      />
      <div className="flex-1 leading-snug">
        <p className="font-semibold">
          <EditableText id="notice.chatSwitch.title" as="span">
            You&apos;ve switched back to Website Chat
          </EditableText>
        </p>
        <p className="mt-1 text-blue-800">
          <EditableText id="notice.chatSwitch.bodyLead" as="span" multiline>
            Your Website Texting add-on is set to expire on
          </EditableText>{" "}
          {periodEndLabel}{" "}
          <EditableText id="notice.chatSwitch.bodyTail" as="span" multiline>
            — you won&apos;t be charged again.
          </EditableText>
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-1 shrink-0 rounded-full p-1 text-blue-700 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        <XMarkIcon className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

/** Emerald success banner when Website Texting goes live. */
export function TextingLiveNotice({ onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <CheckCircleIcon
        className="mt-0.5 size-5 shrink-0 text-emerald-600"
        strokeWidth={1.5}
      />
      <div className="flex-1 leading-snug">
        <p className="font-semibold">
          <EditableText id="notice.textingLive.title" as="span">
            You&apos;ve switched to Website Texting
          </EditableText>
        </p>
        <p className="mt-1 text-emerald-800">
          <EditableText id="notice.textingLive.body" as="span" multiline>
            Nothing else to do — your existing embed code keeps working.
            You&apos;ll start seeing more leads show up in your Conversations
            inbox.
          </EditableText>
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-1 shrink-0 rounded-full p-1 text-emerald-700 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        <XMarkIcon className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

/** Indeterminate spinner — used in the provisioning notice and footer. */
export function Spinner({ className = "size-5 text-blue-500" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

/** Blue banner while the SMS number is being provisioned. */
export function ProvisioningNotice() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-blue-200 bg-blue-50 p-4">
      <div className="bg-white border border-black/10 rounded-full pl-3 pr-5 py-1.5 flex items-center gap-2.5">
        <span className="text-base font-bold text-black flex items-center gap-2.5">
          <Spinner className="mr-1 -ml-1 size-5 text-blue-500" />
          (954) 333-3343
        </span>
      </div>
      <div className="flex flex-col">
        <p className="font-medium text-sm text-black">
          <EditableText id="notice.provisioning.title" as="span" multiline>
            We&apos;re provisioning your number for SMS - this takes a few
            minutes.
          </EditableText>
        </p>
        <p className="text-sm text-gray-700">
          <EditableText id="notice.provisioning.body" as="span" multiline>
            Your site keeps showing Website Chat until it&apos;s ready, then
            switches over automatically.
          </EditableText>
        </p>
      </div>
    </div>
  )
}

/** Blue banner when a switch back to Chat is scheduled for the period end. */
export function ScheduledSwitchNotice({ periodEndLabel, onKeepTexting }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[10px] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
      <CalendarDaysIcon
        className="size-5 shrink-0 text-blue-700"
        strokeWidth={1.5}
      />
      <p className="min-w-[200px] flex-1 leading-snug">
        <span className="font-semibold">
          <EditableText id="notice.scheduled.lead" as="span">
            Switching to Website Chat on
          </EditableText>{" "}
          {periodEndLabel}.
        </span>{" "}
        <EditableText id="notice.scheduled.body" as="span" multiline>
          You keep Website Texting until your billing period ends.
        </EditableText>
      </p>
      <button
        type="button"
        onClick={onKeepTexting}
        className="shrink-0 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/90"
      >
        <EditableText id="notice.scheduled.keepBtn">
          Keep Website Texting
        </EditableText>
      </button>
    </div>
  )
}
