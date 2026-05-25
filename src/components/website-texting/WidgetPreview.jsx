import {
  XMarkIcon,
  UserCircleIcon,
  DevicePhoneMobileIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline"

/** Round avatar with a green online indicator. */
function Avatar({ size = 32 }) {
  return (
    <span
      className="relative inline-block shrink-0 rounded-full border border-black/10"
      style={{ width: size, height: size }}
    >
      <img
        src="/images/avatar-placeholder.png"
        alt=""
        className="size-full rounded-full object-cover"
      />
      <span className="absolute -bottom-px -right-px size-2.5 rounded-[4px] border-[1.5px] border-white bg-[#17b26a]" />
    </span>
  )
}

/**
 * Collapsed state: an opened mini-prompt card with a launcher pill beneath it.
 */
function CollapsedWidget({ copy }) {
  return (
    <div className="flex w-[200px] flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_12px_24px_-8px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between">
          <Avatar size={32} />
          <XMarkIcon className="size-4 text-black" />
        </div>
        <p className="text-base font-semibold leading-tight text-black">
          Hello 👋
        </p>
        <p className="text-[10px] leading-4 text-black">{copy.collapsedBody}</p>
        <button
          type="button"
          className="flex items-center justify-center gap-1 rounded-md bg-black px-3.5 py-2 text-sm font-medium text-white"
        >
          <ChatBubbleOvalLeftEllipsisIcon
            className="size-5"
            strokeWidth={1.5}
          />
          {copy.collapsedCta}
        </button>
      </div>

      <button
        type="button"
        className="ml-auto flex items-center gap-1 rounded-full bg-teal-400 px-4 py-2.5 text-sm font-medium text-black"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="size-5" strokeWidth={1.5} />
        {copy.launcher}
      </button>
    </div>
  )
}

/** Field placeholder used in the texting widget's lead-capture form. */
function Field({ icon: Icon, placeholder }) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-lg border border-neutral-400 bg-white p-2">
      <Icon className="size-6 shrink-0 text-neutral-500" strokeWidth={1.5} />
      <span className="text-sm text-neutral-500">{placeholder}</span>
    </div>
  )
}

/**
 * Expanded state. Texting captures name + phone before continuing over SMS;
 * Chat drops the lead-capture form and SMS-consent copy entirely.
 */
function ExpandedWidget({ type, copy }) {
  const isTexting = type === "texting"
  return (
    <div className="w-[330px] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-[0px_20px_40px_-12px_rgba(0,0,0,0.2)]">
      <div className="rounded-t-xl border border-neutral-200 bg-white">
        {/* Teal header */}
        <div className="flex items-center gap-4 rounded-t-xl bg-teal-400 p-3">
          <Avatar size={40} />
          <p className="flex-1 text-sm font-bold text-black">
            North Shore Painting
          </p>
          <XMarkIcon className="size-4 text-black" />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="text-sm font-semibold leading-5 text-neutral-700">
            <p>Hello 👋</p>
            <p>{copy.expandedBody}</p>
          </div>

          {isTexting && (
            <>
              <Field icon={UserCircleIcon} placeholder="Your Name" />
              <Field
                icon={DevicePhoneMobileIcon}
                placeholder="Your Phone Number"
              />
            </>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-lg bg-teal-400 px-3.5 py-2.5 text-sm font-semibold text-black"
          >
            <ChatBubbleOvalLeftEllipsisIcon
              className="size-5"
              strokeWidth={1.5}
            />
            {copy.expandedCta}
          </button>

          {isTexting && (
            <p className="text-[8px] leading-[11px] text-neutral-500">
              By tapping “start conversation” you consent to receive text
              messages from North Shore Painting at the number you entered.
              Message frequency varies and may be automated. Consent not
              required to buy. Std msg/data rates apply, reply STOP to opt out,
              HELP for help. <span className="underline">Privacy Policy</span>.{" "}
              <span className="underline">Terms of Service</span>.
            </p>
          )}
        </div>
      </div>

      <p className="py-2.5 text-center text-[10px] text-neutral-400">
        Powered by <span className="underline">Rosie</span>.
      </p>
    </div>
  )
}

const COPY = {
  texting: {
    collapsedBody:
      "Welcome to North Shore Painting. Text us now for immediate response.",
    collapsedCta: "Contact Us",
    launcher: "Text Us",
    expandedBody:
      "Provide your name and phone number and we'll text you right away.",
    expandedCta: "Start Conversation",
  },
  chat: {
    collapsedBody:
      "Welcome to North Shore Painting. Ask us anything — we reply instantly.",
    collapsedCta: "Chat Now",
    launcher: "Chat With Us",
    expandedBody: "Ask us anything and we'll answer right away.",
    expandedCta: "Start chatting",
  },
}

/**
 * Static preview canvas showing the website widget in both its collapsed and
 * expanded states, plus a floating launcher button. `type` switches between the
 * SMS lead-capture (texting) and AI chat (chat) presentations.
 */
export default function WidgetPreview({ type = "texting" }) {
  const copy = COPY[type] ?? COPY.texting
  return (
    <div className="relative min-h-[554px] w-full overflow-hidden rounded-[12px] border border-gray-200 bg-gradient-to-b from-slate-50 to-slate-200 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.72px] text-black">
        Preview
      </p>

      {/* Collapsed mock — lower left */}
      <div className="absolute bottom-10 left-[90px]">
        <CollapsedWidget copy={copy} />
      </div>

      {/* Expanded mock — upper right */}
      <div className="absolute right-[25px] bottom-[90px]">
        <ExpandedWidget type={type} copy={copy} />
      </div>

      {/* Floating launcher */}
      <button
        type="button"
        className="absolute bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-black text-white"
        aria-label="Close widget"
      >
        <XMarkIcon className="size-6" />
      </button>
    </div>
  )
}
