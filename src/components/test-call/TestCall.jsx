import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import confetti from "canvas-confetti"
import { useDialKit } from "dialkit"
import {
  CheckIcon,
  PhoneArrowUpRightIcon,
  ArrowRightIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid"
import {
  LockClosedIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  BuildingOffice2Icon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  SparklesIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline"

const TestCall = () => {
  const [callState, setCallState] = useState("waiting") // waiting | inProgress | complete
  const [feedback, setFeedback] = useState("great") // "great" | "work"
  const [goLive, setGoLive] = useState(false)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const dk = useDialKit(
    "Test Call",
    {
      startCall: { type: "action", label: "▶ Start call" },
      endCall: { type: "action", label: "■ End call" },
      reset: { type: "action", label: "↺ Reset" },
      runLifecycle: { type: "action", label: "↻ Run full lifecycle" },
      askedTransfer: false,
      askedAppointment: false,
    },
    {
      onAction: (action) => {
        clearTimers()
        if (action === "startCall") {
          setCallState("inProgress")
        } else if (action === "endCall") {
          setCallState("complete")
        } else if (action === "reset") {
          setCallState("waiting")
          setFeedback("great")
          setGoLive(false)
        } else if (action === "runLifecycle") {
          setCallState("waiting")
          setFeedback("great")
          setGoLive(false)
          timersRef.current.push(
            setTimeout(() => setCallState("inProgress"), 450),
          )
          timersRef.current.push(
            setTimeout(() => setCallState("complete"), 4500),
          )
        }
      },
    },
  )

  useEffect(() => () => clearTimers(), [])

  const askedTransfer = dk.askedTransfer
  const askedAppointment = dk.askedAppointment

  // Reset downstream state when we go back to waiting
  useEffect(() => {
    if (callState === "waiting") {
      setFeedback("great")
      setGoLive(false)
    }
  }, [callState])

  return (
    <div className="bg-gray-200 p-2.5 min-h-screen">
      <div className="bg-gradient-to-b from-white to-gray-25 rounded-[10px] p-4 sm:p-7 min-h-[calc(100vh-20px)]">
        <div className="max-w-[720px] mx-auto">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <img src="/images/logo.svg" alt="Rosie" />
          </div>

          {/* Stepper */}
          <Stepper />

          {/* Hero — single line, imperative */}
          <motion.div layout className="mt-8 sm:mt-12 mb-6 sm:mb-8 text-center">
            <h1 className="text-[32px] sm:text-[40px] font-bold text-black tracking-[-0.03em] leading-[1.1]">
              Call <span className="text-purple-600">Rosie.</span>
            </h1>
          </motion.div>

          {/* Call card (adapts across lifecycle) */}
          <CallCard callState={callState} />

          {/* Try asking — shown during waiting/in-progress */}
          <AnimatePresence>
            {callState !== "complete" && (
              <motion.div
                key="try-asking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-4"
              >
                <TryAskingRow subdued={callState === "inProgress"} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Post-call stack */}
          <AnimatePresence mode="wait">
            {callState === "complete" && !goLive && (
              <motion.div
                key="post-call"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4 mt-4"
              >
                <CapturedCard
                  askedTransfer={askedTransfer}
                  askedAppointment={askedAppointment}
                />
                <FeedbackCard
                  feedback={feedback}
                  setFeedback={setFeedback}
                  onGoLive={() => setGoLive(true)}
                  askedTransfer={askedTransfer}
                  askedAppointment={askedAppointment}
                />
              </motion.div>
            )}

            {callState === "complete" && goLive && (
              <motion.div
                key="ready"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <ReadyCard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default TestCall

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

const Stepper = () => {
  const steps = [
    { id: "01", name: "Train", status: "complete" },
    { id: "02", name: "Customize", status: "complete" },
    { id: "03", name: "Test", status: "current" },
    { id: "04", name: "Go Live", status: "upcoming" },
  ]

  return (
    <nav aria-label="Progress" className="mt-7">
      <ol
        role="list"
        className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white md:flex md:divide-y-0"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === "complete" ? (
              <span className="flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ccfbee]">
                    <CheckIcon
                      aria-hidden="true"
                      className="size-4 text-[#0e7768]"
                    />
                  </span>
                  <span className="ml-4 text-base font-medium text-gray-700">
                    {step.name}
                  </span>
                </span>
              </span>
            ) : step.status === "current" ? (
              <span
                aria-current="step"
                className="flex items-center px-6 py-4 text-sm font-medium"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-700">
                  <span className="text-sm font-semibold text-white">
                    {step.id}
                  </span>
                </span>
                <span className="ml-4 text-base font-semibold text-purple-700">
                  {step.name}
                </span>
              </span>
            ) : (
              <span className="flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      {step.id}
                    </span>
                  </span>
                  <span className="ml-4 text-base font-medium text-gray-700">
                    {step.name}
                  </span>
                </span>
              </span>
            )}

            {stepIdx !== steps.length - 1 ? (
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 hidden h-full w-5 md:block"
              >
                <svg
                  fill="none"
                  viewBox="0 0 22 80"
                  preserveAspectRatio="none"
                  className="size-full text-gray-200"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    stroke="currentcolor"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  CallCard — idle / in-progress / complete                           */
/* ------------------------------------------------------------------ */

const CARD_SHADOW =
  "shadow-[0_0_0_1px_rgba(42,20,60,0.08),0_1px_1px_-0.5px_rgba(42,20,60,0.04),0_3px_3px_-1.5px_rgba(42,20,60,0.04),0_24px_24px_-12px_rgba(42,20,60,0.04)]"

const CallCard = ({ callState }) => {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 32 }}
      className={`rounded-[20px] ${CARD_SHADOW} overflow-hidden`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {callState === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-200 via-purple-100 to-purple-25 px-6 py-10 sm:py-12"
          >
            <NumberRings />
            <div className="relative flex flex-col items-center gap-5">
              <p className="text-purple-700 font-bold text-base leading-7">
                Call Rosie now to try it out
              </p>
              <CallPill hero />
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1">
                  <LockClosedIcon className="size-3.5 text-gray-700 stroke-[2]" />
                  <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em]">
                    Only you can reach Rosie right now.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-700 text-xs font-medium underline cursor-pointer mt-1"
                >
                  Request local area code
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {callState === "inProgress" && (
          <motion.div
            key="inProgress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-200 via-purple-100 to-purple-25 px-6 py-10 sm:py-12"
          >
            <LivePanel />
          </motion.div>
        )}

        {callState === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="bg-white p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full"
          >
            <div className="flex-1 flex flex-col gap-1.5 items-start">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-[#ccfbee]">
                  <CheckIcon className="size-4 text-[#0e7768]" />
                </span>
                <h2 className="text-xl font-bold text-black tracking-[-0.02em] leading-[30px]">
                  Call complete
                </h2>
              </div>
              <div className="flex gap-1.5 items-center">
                <LockClosedIcon className="size-4 text-gray-700 stroke-[2]" />
                <p className="text-sm font-medium text-gray-700 tracking-[-0.01em]">
                  Only you can call Rosie until you go live.
                </p>
              </div>
              <button
                type="button"
                className="flex gap-1.5 items-center cursor-pointer group mt-1"
              >
                <PlusCircleIcon className="size-4 text-gray-700 stroke-[2]" />
                <p className="text-sm font-medium text-gray-700 tracking-[-0.01em] group-hover:text-black">
                  View call details
                </p>
              </button>
            </div>

            <div className="bg-purple-25 border border-[#f6eaff] rounded-xl p-3 flex items-center justify-center w-full sm:w-auto sm:shrink-0">
              <CallPill />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Animated rings behind the call pill — subtle "this is the action" cue
const NumberRings = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.28, 0], scale: [0.6, 1.6, 2.2] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          delay: i * 1.05,
          ease: "easeOut",
        }}
        className="absolute size-48 rounded-full border border-purple-400/60"
      />
    ))}
  </div>
)

/* ---------- in progress ---------- */

const LivePanel = () => {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setElapsed((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0")
  const ss = String(elapsed % 60).padStart(2, "0")

  return (
    <>
      {/* amplitude-ish pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-200/70 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          className="relative flex items-center justify-center size-14 rounded-full bg-purple-600"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(147,50,224,0.45)",
              "0 0 0 18px rgba(147,50,224,0)",
            ],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        >
          <PhoneIcon className="size-6 text-white" />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-purple-700 font-bold text-base leading-7">
            Call in progress
          </p>
          <p className="text-black font-bold text-2xl tabular-nums tracking-[-0.02em]">
            {mm}:{ss}
          </p>
        </div>
        <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em] text-center max-w-[260px]">
          We&apos;ll capture the transcript, summary, and notify you when it
          ends.
        </p>
      </div>
    </>
  )
}

/* ---------- shared ---------- */

const CallPill = ({ hero = false }) => {
  return (
    <div
      className={`bg-white border border-[rgba(42,20,60,0.1)] rounded-full flex items-center justify-between pl-2 pr-5 py-2 gap-2 w-full max-w-[272px] ${
        hero ? "shadow-[0_2px_10px_-2px_rgba(42,20,60,0.12)]" : ""
      }`}
    >
      <div className="bg-purple-200 border border-purple-200 rounded-full h-[34px] px-3 flex items-center gap-1.5">
        <PhoneArrowUpRightIcon className="size-4 text-purple-700" />
        <span className="text-purple-700 text-sm font-medium">Call</span>
      </div>
      <p className="w-full text-center text-black font-bold text-lg leading-[30px] tracking-[-0.02em]">
        (913) 423-8370
      </p>
    </div>
  )
}

const TryAskingRow = ({ subdued = false }) => {
  const questions = [
    "Tell me about Victoria Bakos?",
    "What services do you offer?",
    "Are you open tomorrow?",
  ]
  return (
    <div
      className={`flex flex-col gap-2 transition-opacity ${
        subdued ? "opacity-60" : ""
      }`}
    >
      <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.06em] px-1">
        Try asking Rosie
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {questions.map((q, idx) => (
          <motion.div
            key={q}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.08 + idx * 0.05,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-white border border-[#f6eaff] rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-[0_0_0_1px_rgba(42,20,60,0.04),0_1px_2px_-0.5px_rgba(42,20,60,0.04)]"
          >
            <div className="bg-purple-100 rounded-full size-7 flex items-center justify-center shrink-0">
              <span className="text-purple-700 font-semibold text-[13px]">
                Q
              </span>
            </div>
            <p className="text-gray-700 font-medium text-[13px] leading-[1.35]">
              {q}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CapturedCard — "here's what Rosie got" post-call preview            */
/* ------------------------------------------------------------------ */

const CapturedCard = ({ askedTransfer, askedAppointment }) => {
  const summary = buildSummary({ askedTransfer, askedAppointment })
  const transcript = buildTranscript({ askedTransfer, askedAppointment })

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-[20px] ${CARD_SHADOW} overflow-hidden`}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-full bg-purple-100">
            <SparklesIcon className="size-3.5 text-purple-700 stroke-[2]" />
          </span>
          <h3 className="text-[15px] font-semibold text-black tracking-[-0.01em]">
            Here&apos;s what Rosie captured
          </h3>
        </div>
        <span className="text-xs font-medium text-gray-700">
          2m 14s · just now
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Caller */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 border border-[#f6eaff] flex items-center justify-center">
            <span className="text-purple-700 font-semibold text-sm">FB</span>
          </div>
          <div className="flex flex-col">
            <p className="text-[15px] font-semibold text-black tracking-[-0.01em]">
              Francois Brill
            </p>
            <p className="text-[13px] font-medium text-gray-700 tabular-nums">
              +1 (913) 423-8370
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-[0.04em]">
            Summary
          </p>
          <p className="text-[14px] text-black tracking-[-0.01em] leading-[1.5]">
            {summary}
          </p>
        </div>

        {/* Transcript excerpt */}
        <div className="bg-gray-25 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
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
                className={`text-[13px] leading-[1.5] ${
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

      {/* Footer — value-sell for notifications */}
      <div className="px-6 py-3.5 bg-gradient-to-r from-purple-25 via-white to-purple-25 border-t border-[#f6eaff] flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <span className="size-6 rounded-full bg-white border border-[#f6eaff] flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="size-3.5 text-purple-700 stroke-[2]" />
            </span>
            <span className="size-6 rounded-full bg-white border border-[#f6eaff] flex items-center justify-center">
              <EnvelopeIcon className="size-3.5 text-purple-700 stroke-[2]" />
            </span>
          </div>
          <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em]">
            <span className="text-black font-semibold">Text and email </span>
            summary sent to you
          </p>
        </div>
        <p className="text-[12px] font-medium text-gray-700">
          You&apos;ll get this for every call.
        </p>
      </div>
    </motion.div>
  )
}

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

/* ------------------------------------------------------------------ */
/*  FeedbackCard — segmented toggle + swapping content                  */
/* ------------------------------------------------------------------ */

const FeedbackCard = ({
  feedback,
  setFeedback,
  onGoLive,
  askedTransfer,
  askedAppointment,
}) => {
  return (
    <motion.div
      layout
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.24, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-[20px] p-6 ${CARD_SHADOW} flex flex-col gap-5 overflow-hidden`}
    >
      {/* Header + segmented selector */}
      <motion.div
        layout="position"
        className="flex flex-col gap-4 items-center"
      >
        <div className="flex flex-col gap-1 items-center text-center">
          <h2 className="text-xl font-bold text-black tracking-[-0.02em]">
            How did it sound?
          </h2>
          <p className="text-sm font-medium text-gray-700 tracking-[-0.01em]">
            Pick a side — you can switch between these any time.
          </p>
        </div>

        <FeedbackToggle feedback={feedback} setFeedback={setFeedback} />
      </motion.div>

      {/* Body swaps based on selection */}
      <AnimatePresence mode="wait" initial={false}>
        {feedback === "great" ? (
          <motion.div
            key="great"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <GreatPath
              onGoLive={onGoLive}
              onSwitch={() => setFeedback("work")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="work"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <WorkPath
              onGoLive={onGoLive}
              askedTransfer={askedTransfer}
              askedAppointment={askedAppointment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FeedbackToggle = ({ feedback, setFeedback }) => {
  const options = [
    { id: "great", label: "Sounded great" },
    { id: "work", label: "Needs some work" },
  ]

  return (
    <div className="relative inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 w-full max-w-[360px]">
      {options.map((opt) => {
        const active = feedback === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFeedback(opt.id)}
            className="relative flex-1 px-4 py-2 rounded-full cursor-pointer z-10"
          >
            {active && (
              <motion.span
                layoutId="feedback-toggle-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 bg-white rounded-full shadow-[0_1px_2px_0_rgba(16,24,40,0.08),0_0_0_1px_rgba(42,20,60,0.06)]"
              />
            )}
            <span
              className={`relative text-sm font-semibold tracking-[-0.01em] transition-colors ${
                active ? "text-purple-700" : "text-gray-700"
              }`}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Great path ---------- */

const GreatPath = ({ onGoLive, onSwitch }) => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="w-full bg-gradient-to-br from-purple-25 to-white border border-[#f6eaff] rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="shrink-0 size-11 rounded-full bg-purple-100 flex items-center justify-center">
          <SparklesIcon className="size-5 text-purple-700 stroke-[2]" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <p className="text-[15px] font-semibold text-black tracking-[-0.01em]">
            Rosie is ready for real callers.
          </p>
          <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em]">
            Choose a live plan and she&apos;ll start answering calls today. You
            can keep fine-tuning anytime.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center w-full sm:w-auto">
        <motion.button
          type="button"
          onClick={onGoLive}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-full sm:w-auto border border-gray-900/[0.08] text-white rounded-full px-6 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(230,100,100,0.25) 14%, rgba(44,18,65,0) 100%), linear-gradient(90deg, #9332e0 0%, #9332e0 100%)",
          }}
        >
          <span className="text-[15px] font-medium text-white">
            Explore live plans
          </span>
          <ArrowRightIcon className="size-4 text-white" />
        </motion.button>
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm font-medium text-gray-700 tracking-[-0.01em] cursor-pointer hover:text-black px-3 py-2"
        >
          I&apos;ll keep tweaking
        </button>
      </div>
    </div>
  )
}

/* ---------- Work path ---------- */

const TUNE_TILES = [
  {
    id: "greeting",
    icon: MegaphoneIcon,
    title: "Tweak the greeting",
    description: "Change what Rosie says when she picks up",
  },
  {
    id: "voice",
    icon: SpeakerWaveIcon,
    title: "Swap voice or name",
    description: "Pick a different voice or rename your agent",
  },
  {
    id: "pronounce",
    icon: IdentificationIcon,
    title: "Fix pronunciations",
    description: "Teach Rosie how to say your business name",
  },
  {
    id: "info",
    icon: BuildingOffice2Icon,
    title: "Update business info",
    description: "Hours, services, and FAQs that weren't quite right",
  },
]

const WorkPath = ({ onGoLive, askedTransfer, askedAppointment }) => {
  const smartTiles = []
  if (askedTransfer) {
    smartTiles.push({
      id: "transfer",
      icon: ArrowsRightLeftIcon,
      title: "Enable call transfers",
      description:
        "Your caller asked for a live person — let Rosie hand calls off",
      smart: true,
    })
  }
  if (askedAppointment) {
    smartTiles.push({
      id: "appts",
      icon: CalendarDaysIcon,
      title: "Turn on appointments",
      description:
        "Your caller tried to book — let Rosie put meetings on your calendar",
      smart: true,
    })
  }

  const tiles = [...smartTiles, ...TUNE_TILES]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiles.map((tile, idx) => (
          <TuneTile key={tile.id} tile={tile} index={idx} />
        ))}
      </div>

      <div className="flex items-center justify-center pt-1">
        <button
          type="button"
          onClick={onGoLive}
          className="text-sm font-medium text-gray-700 tracking-[-0.01em] cursor-pointer hover:text-black px-3 py-2"
        >
          These can wait — let&apos;s go live →
        </button>
      </div>
    </div>
  )
}

const TuneTile = ({ tile, index }) => {
  const Icon = tile.icon
  return (
    <motion.button
      type="button"
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.05 + index * 0.04,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2 }}
      className={`group w-full text-left rounded-xl p-4 cursor-pointer flex gap-3 items-start transition-colors ${
        tile.smart
          ? "bg-gradient-to-br from-purple-25 to-white border border-purple-200 hover:border-purple-600"
          : "bg-white border border-[rgba(42,20,60,0.08)] hover:border-purple-600"
      }`}
    >
      <div
        className={`shrink-0 size-9 rounded-full flex items-center justify-center ${
          tile.smart ? "bg-purple-200" : "bg-purple-100"
        }`}
      >
        <Icon className="size-4.5 text-purple-700 stroke-[2]" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[14px] font-semibold text-black tracking-[-0.01em]">
            {tile.title}
          </p>
          {tile.smart && (
            <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-[0.04em] bg-purple-100 rounded-full px-1.5 py-0.5 shrink-0">
              Suggested
            </span>
          )}
        </div>
        <p className="text-[12.5px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.35]">
          {tile.description}
        </p>
      </div>
      <ArrowRightIcon className="size-4 text-gray-700 group-hover:text-purple-700 mt-1 shrink-0 transition-colors" />
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/*  ReadyCard — after user picks "explore live plans"                  */
/* ------------------------------------------------------------------ */

const ReadyCard = () => {
  return (
    <div
      className={`bg-white rounded-[20px] p-6 ${CARD_SHADOW} relative overflow-hidden`}
    >
      <Confetti />
      <div className="flex flex-col gap-4 items-center p-6 relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 380,
            damping: 18,
          }}
          className="bg-[#ccfbee] border border-[rgba(153,246,223,0.63)] rounded-full size-12 flex items-center justify-center"
        >
          <CheckIcon className="size-6 text-[#0c9582]" />
        </motion.div>

        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1 items-center text-center max-w-[370px]"
        >
          <h2 className="text-2xl font-bold text-black tracking-[-0.02em] leading-8">
            Rosie is Ready
          </h2>
          <p className="text-sm font-medium text-gray-700 tracking-[-0.01em]">
            Choose a live plan to start taking calls from real customers. You
            can always fine-tune settings later.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3 items-center"
        >
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="border border-gray-900/[0.08] text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] rounded-full px-7 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(230,100,100,0.25) 14%, rgba(44,18,65,0) 100%), linear-gradient(90deg, #9332e0 0%, #9332e0 100%)",
            }}
          >
            <span className="text-base font-medium text-white">
              Explore Live Plans
            </span>
            <ArrowRightIcon className="size-5 text-white" />
          </motion.button>
          <button
            type="button"
            className="text-sm font-medium text-gray-700 tracking-[-0.01em] cursor-pointer hover:text-black"
          >
            Maybe Later
          </button>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Confetti                                                            */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#0c9582",
  "#9332e0",
]

const Confetti = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const fire = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    })

    const timeout = setTimeout(() => {
      fire({
        origin: { x: 0.5, y: 1 },
        angle: 90,
        spread: 110,
        startVelocity: 25,
        gravity: 0.55,
        decay: 0.94,
        ticks: 400,
        particleCount: 380,
        scalar: 0.95,
        colors: CONFETTI_COLORS,
      })
    }, 450)

    return () => {
      clearTimeout(timeout)
      fire.reset()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
