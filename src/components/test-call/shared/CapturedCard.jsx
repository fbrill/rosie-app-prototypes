import { ArrowRightIcon } from "@heroicons/react/24/solid"
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import { CARD_SHADOW } from "./constants"

const buildSummary = ({ askedTransfer, askedAppointment }) => {
  const parts = ["Caller asked about hours and services at Victoria Bakos"]
  if (askedAppointment) parts.push("tried to book a consultation")
  if (askedTransfer) parts.push("asked to be transferred to someone live")
  return parts.join(", ") + "."
}

const buildTranscript = ({ askedTransfer, askedAppointment }) => {
  const base = [
    {
      speaker: "Rosie",
      text: "Hi, thanks for calling Victoria Bakos — how can I help?",
    },
    {
      speaker: "Caller",
      text: "Hey, are y'all open tomorrow and what do you offer?",
    },
  ]
  if (askedAppointment) {
    base.push({
      speaker: "Caller",
      text: "Can I book a consult for next Tuesday at 2?",
    })
  }
  if (askedTransfer) {
    base.push({
      speaker: "Caller",
      text: "Actually — can you put me through to a person?",
    })
  }
  return base.slice(0, 3)
}

export const CapturedCard = ({
  askedTransfer,
  askedAppointment,
  dense = false,
  flat = false,
}) => {
  const summary = buildSummary({ askedTransfer, askedAppointment })
  const transcript = buildTranscript({ askedTransfer, askedAppointment })

  // `flat` strips the wrapper card styling so this can be embedded inside
  // another card (e.g. as a footer in FeedbackCard).
  const wrapperClass = flat
    ? ""
    : `bg-white rounded-[16px] ${CARD_SHADOW} overflow-hidden`

  return (
    <div className={wrapperClass}>
      {!flat && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-6 rounded-full bg-purple-100">
              <DocumentTextIcon className="size-3.5 text-gray-600 stroke-[2]" />
            </span>
            <h3 className="text-[14px] font-semibold text-black tracking-[-0.01em]">
              What Rosie captured
            </h3>
          </div>
          <span className="text-xs font-medium text-gray-700">
            2m 14s · just now
          </span>
        </div>
      )}

      <div className={`px-5 ${dense ? "py-3" : "py-4"} flex flex-col gap-4`}>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 border border-[#f6eaff] flex items-center justify-center">
            <span className="text-purple-700 font-semibold text-sm">FB</span>
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-semibold text-black tracking-[-0.01em]">
              Francois Brill
            </p>
            <p className="text-[12.5px] font-medium text-gray-700 tabular-nums">
              +1 (913) 423-8370
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-[0.04em]">
            Summary
          </p>
          <p className="text-[13.5px] text-black tracking-[-0.01em] leading-[1.5]">
            {summary}
          </p>
        </div>

        <div className="bg-gray-25 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <DocumentTextIcon className="size-4 text-gray-700 stroke-[2]" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-[0.04em]">
                Transcript
              </p>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-purple-700 hover:text-purple-600 cursor-pointer flex items-center gap-0.5"
            >
              View full <ArrowRightIcon className="size-3" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {transcript.map((line, idx) => (
              <p
                key={idx}
                className={`text-[12.5px] leading-[1.5] ${
                  line.speaker === "Rosie" ? "text-purple-700" : "text-gray-700"
                }`}
              >
                <span className="font-semibold">{line.speaker}: </span>
                <span className="font-medium">{line.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
