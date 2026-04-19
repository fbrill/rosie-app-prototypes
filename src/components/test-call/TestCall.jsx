import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import confetti from "canvas-confetti"
import { useDialKit } from "dialkit"
import {
  CheckIcon,
  PhoneArrowUpRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid"
import {
  CakeIcon,
  WrenchScrewdriverIcon,
  LockClosedIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline"

const TestCall = () => {
  const [isCompleted, setIsCompleted] = useState(false)
  const [feedback, setFeedback] = useState(null) // null | "great" | "work"
  const [view, setView] = useState("feedback") // "feedback" | "ready"

  const handleCallComplete = () => setIsCompleted(true)
  const handleContinue = () => setView("ready")

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

          {/* Title */}
          <div className="max-w-[500px] mx-auto mt-8 sm:mt-12 mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl font-bold text-black tracking-[-0.02em] leading-8">
              Your agent is ready.
              <br />
              Make your first{" "}
              <span className="text-purple-600">test call.</span>
            </h1>
          </div>

          {/* Call card */}
          <CallCard isCompleted={isCompleted} />

          {/* Feedback / Ready card */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {view === "feedback" ? (
                <motion.div
                  key="feedback"
                  initial={false}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 1, 1] }}
                >
                  <FeedbackCard
                    isUnlocked={isCompleted}
                    onComplete={handleCallComplete}
                    onContinue={handleContinue}
                    feedback={feedback}
                    setFeedback={setFeedback}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ReadyCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestCall

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

const CallCard = ({ isCompleted }) => {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 32 }}
      className="bg-white rounded-[20px] p-6 shadow-[0_0_0_1px_rgba(42,20,60,0.08),0_1px_1px_-0.5px_rgba(42,20,60,0.04),0_3px_3px_-1.5px_rgba(42,20,60,0.04),0_24px_24px_-12px_rgba(42,20,60,0.04)] overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isCompleted ? (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 items-center"
          >
            <div className="flex flex-col gap-2 items-center max-w-[436px]">
              <h2 className="text-xl font-bold text-black tracking-[-0.02em] text-center">
                Know what your callers will hear when they call.
              </h2>
              <p className="text-sm font-medium text-gray-700 text-center tracking-[-0.01em]">
                <LockClosedIcon className="inline size-3.5 -mt-0.5 mr-1 text-gray-700 stroke-[2]" />
                Only you can call Rosie.
                <br />
                No external callers will be able to reach the agent until you go
                live.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
              <RosieNumber />
              <TryAsking />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full"
          >
            <div className="flex-1 flex flex-col gap-1.5 items-start">
              <h2 className="text-xl font-bold text-black tracking-[-0.02em] leading-[30px]">
                Your Rosie Number
              </h2>
              <div className="flex gap-1.5 items-center">
                <LockClosedIcon className="size-5 text-gray-700" />
                <p className="text-sm font-medium text-gray-700 tracking-[-0.01em]">
                  Only you can place test calls to Rosie.
                </p>
              </div>
              <button
                type="button"
                className="flex gap-1.5 items-center cursor-pointer group"
              >
                <PlusCircleIcon className="size-5 text-gray-700" />
                <p className="text-sm font-medium text-gray-700 tracking-[-0.01em] group-hover:text-black">
                  View Details
                </p>
              </button>
            </div>

            <div className="bg-purple-25 border border-[#f6eaff] rounded-xl p-4 flex items-center justify-center w-full sm:w-auto sm:shrink-0">
              <CallPill />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const RosieNumber = () => {
  return (
    <div className="flex-1 bg-purple-25 border border-[#f6eaff] rounded-xl flex items-center justify-center min-h-[215px]">
      <div className="flex flex-col items-center justify-between h-full py-5 px-4 gap-4">
        <p className="text-purple-700 font-bold text-base leading-7">
          Your Rosie Number
        </p>

        <CallPill />

        <button
          type="button"
          className="text-gray-700 text-xs font-medium underline cursor-pointer"
        >
          Request local area code
        </button>
      </div>
    </div>
  )
}

const CallPill = () => {
  return (
    <div className="bg-white border border-[rgba(42,20,60,0.1)] rounded-full flex items-center justify-between pl-2 pr-5 py-2 gap-2 w-full max-w-[272px]">
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

const TryAsking = () => {
  const questions = [
    "Tell me about Victoria Bakos?",
    "What services do you offer?",
    "Are you open tomorrow?",
  ]
  return (
    <div className="flex-1 bg-white border border-[#f6eaff] rounded-xl overflow-hidden flex flex-col">
      <div className="bg-purple-25 px-4 py-2 h-[50px] flex items-center">
        <p className="text-purple-700 font-bold text-base leading-7">
          Try asking Rosie...
        </p>
      </div>
      {questions.map((q) => (
        <div
          key={q}
          className="border-t border-[#f6eaff] px-4 py-2 h-[55px] flex items-center gap-2"
        >
          <div className="bg-purple-100 rounded-full size-8 flex items-center justify-center shrink-0">
            <span className="text-purple-700 font-semibold text-base leading-7">
              Q
            </span>
          </div>
          <p className="text-gray-700 font-semibold text-[15px] leading-7">
            {q}
          </p>
        </div>
      ))}
    </div>
  )
}

const FeedbackCard = ({
  isUnlocked,
  onComplete,
  onContinue,
  feedback,
  setFeedback,
}) => {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 32 }}
      className="bg-white rounded-[20px] p-6 min-h-[228px] flex flex-col gap-6 shadow-[0_0_0_1px_rgba(42,20,60,0.08),0_1px_1px_-0.5px_rgba(42,20,60,0.04),0_3px_3px_-1.5px_rgba(42,20,60,0.04),0_24px_24px_-12px_rgba(42,20,60,0.04)] relative overflow-hidden"
    >
      <motion.div
        layout="position"
        className="flex flex-col gap-2.5 text-center"
      >
        <h2 className="text-xl font-bold text-black tracking-[-0.02em]">
          How was your call?
        </h2>
        <p className="text-sm font-medium text-gray-700 tracking-[-0.01em]">
          Take a moment to reflect — did Rosie sound the way you&apos;d want
          your callers to experience her?
        </p>
      </motion.div>

      {isUnlocked && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 items-stretch sm:items-center w-full">
          <FeedbackOption
            index={0}
            variant="primary"
            icon={<CakeIcon className="size-5 text-purple-700" />}
            title="Sounded great!"
            description="Ready to take real customer calls."
            cta="Continue"
            isSelected={feedback === "great"}
            onClick={() => {
              setFeedback("great")
              onContinue()
            }}
          />
          <FeedbackOption
            index={1}
            variant="secondary"
            icon={<WrenchScrewdriverIcon className="size-5 text-purple-700" />}
            title="Need some work"
            description="Let's fix a few things first."
            cta="Make Changes"
            isSelected={feedback === "work"}
            onClick={() => setFeedback("work")}
          />
        </div>
      )}

      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            key="lock"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-gradient-to-b from-white/60 to-white backdrop-blur-[3.5px] flex flex-col gap-2.5 items-center justify-center"
          >
            <p className="text-black text-sm font-medium tracking-[-0.01em]">
              Complete a test call to continue...
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="bg-purple-200 border border-purple-200 hover:bg-purple-300 hover:border-purple-300 rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer ani"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-700 opacity-60 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-purple-700" />
              </span>
              <span className="text-purple-700 text-sm font-medium tracking-[-0.01em]">
                Call Complete
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FeedbackOption = ({
  index,
  variant = "default",
  icon,
  title,
  description,
  cta,
  isSelected,
  onClick,
}) => {
  const cardBg = variant === "secondary" ? "bg-white" : "bg-purple-25"
  const iconBg = variant === "secondary" ? "bg-purple-100" : "bg-purple-200"

  const isPrimary = variant === "primary"
  const isSecondary = variant === "secondary"

  const ctaBase =
    "rounded-full px-4 py-2 flex items-center justify-center gap-1 w-full border border-gray-900/[0.08]"
  const ctaColor = isPrimary
    ? "text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
    : isSecondary
      ? "bg-purple-100 text-purple-700"
      : "bg-purple-200 text-purple-700"

  const ctaStyle = isPrimary
    ? {
        backgroundImage:
          "linear-gradient(180deg, rgba(230,100,100,0.25) 14%, rgba(44,18,65,0) 100%), linear-gradient(90deg, #9332e0 0%, #9332e0 100%)",
      }
    : undefined

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.45 + index * 0.07,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex-1"
    >
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`w-full ${cardBg} border ${
          isSelected ? "border-purple-600" : "border-[rgba(42,20,60,0.08)]"
        } rounded-lg p-6 flex flex-col gap-4 items-center text-center cursor-pointer`}
      >
        <div
          className={`${iconBg} rounded-full size-12 flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-black text-lg font-semibold leading-7">{title}</p>
          <p className="text-gray-700 text-sm font-medium tracking-[-0.01em]">
            {description}
          </p>
        </div>
        <div className={`${ctaBase} ${ctaColor}`} style={ctaStyle}>
          <span className="text-sm font-medium tracking-[-0.01em]">{cta}</span>
          <ArrowRightIcon
            className={`size-4 ${isPrimary ? "text-white" : "text-purple-700"}`}
          />
        </div>
      </motion.button>
    </motion.div>
  )
}

const ReadyCard = () => {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_0_0_1px_rgba(42,20,60,0.08),0_1px_1px_-0.5px_rgba(42,20,60,0.04),0_3px_3px_-1.5px_rgba(42,20,60,0.04),0_24px_24px_-12px_rgba(42,20,60,0.04)] relative overflow-hidden">
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

const POSITION_X = {
  "bottom-left": 0.15,
  "bottom-center": 0.5,
  "bottom-right": 0.85,
}

const Confetti = () => {
  const canvasRef = useRef(null)
  const fireRef = useRef(null)
  const paramsRef = useRef(null)

  const p = useDialKit(
    "Confetti",
    {
      position: {
        type: "select",
        options: [
          { value: "bottom-left", label: "Bottom Left" },
          { value: "bottom-center", label: "Bottom Center" },
          { value: "bottom-right", label: "Bottom Right" },
        ],
        default: "bottom-center",
      },
      volume: [380, 50, 800],
      speed: [25, 20, 120],
      fire: { type: "action", label: "Fire" },
    },
    {
      onAction: (action) => {
        if (action === "fire") firePreset()
      },
    },
  )
  paramsRef.current = p

  const firePreset = () => {
    const fire = fireRef.current
    const current = paramsRef.current
    if (!fire || !current) return
    fire({
      origin: { x: POSITION_X[current.position] ?? 0.5, y: 1 },
      angle: 90,
      spread: 110,
      startVelocity: current.speed,
      gravity: 0.55,
      decay: 0.94,
      ticks: 400,
      particleCount: current.volume,
      scalar: 0.95,
      colors: CONFETTI_COLORS,
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const fire = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    })
    fireRef.current = fire

    const timeout = setTimeout(firePreset, 450)

    return () => {
      clearTimeout(timeout)
      fire.reset()
      fireRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
