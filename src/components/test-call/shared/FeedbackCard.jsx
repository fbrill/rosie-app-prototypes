import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/solid"
import {
  SpeakerWaveIcon,
  MegaphoneIcon,
  BuildingOffice2Icon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  IdentificationIcon,
  PhoneIcon,
  PlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"
import { CARD_SHADOW } from "./constants"
import { CapturedCard } from "./CapturedCard"
import { Confetti } from "./Confetti"

const CTA_LABEL = "Choose a live plan"

export const FeedbackCard = ({
  feedback,
  setFeedback,
  onGoLive,
  onTestAgain,
  askedTransfer,
  askedAppointment,
  showCallDetails = false,
}) => {
  return (
    <motion.div
      layout
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-white rounded-[20px] ${CARD_SHADOW} flex flex-col overflow-hidden`}
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <motion.div layout="position" className="flex justify-center">
          <FeedbackToggle feedback={feedback} setFeedback={setFeedback} />
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          {feedback === "great" && (
            <motion.div
              key="great"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <GreatPath onGoLive={onGoLive} />
            </motion.div>
          )}
          {feedback === "work" && (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <WorkPath
                onGoLive={onGoLive}
                onTestAgain={onTestAgain}
                askedTransfer={askedTransfer}
                askedAppointment={askedAppointment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showCallDetails && (
        <CallDetailsFooter
          askedTransfer={askedTransfer}
          askedAppointment={askedAppointment}
        />
      )}
    </motion.div>
  )
}

const CallDetailsFooter = ({ askedTransfer, askedAppointment }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-gray-100 bg-gray-25/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 cursor-pointer hover:bg-gray-25 transition-colors"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
          <DocumentTextIcon className="size-4 text-gray-600 stroke-[2]" />
          See what Rosie captured
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-700"
        >
          <ChevronDownIcon className="size-4 stroke-[2]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">
              <CapturedCard
                askedTransfer={askedTransfer}
                askedAppointment={askedAppointment}
                flat
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FeedbackToggle = ({ feedback, setFeedback }) => {
  const options = [
    { id: "great", label: "Sounded great" },
    { id: "work", label: "Needs some work" },
  ]
  const noSelection = feedback === null || feedback === undefined

  return (
    <div className="relative inline-flex p-1 bg-purple-50 rounded-full border border-purple-200 w-full max-w-[360px]">
      {options.map((opt) => {
        const active = feedback === opt.id
        // No selection yet → both options bold + full opacity (inviting).
        // After a pick → active stays bold, inactive drops to weight 500 / 0.8.
        const emphasized = noSelection || active
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
              className={`relative text-md text-purple-700 tracking-[-0.01em] transition-all ${
                emphasized ? "font-bold opacity-100" : "font-medium opacity-80"
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

const GreatPath = ({ onGoLive }) => (
  <div className="relative flex flex-col items-center gap-4 text-center">
    <Confetti intensity="celebrate" delay={150} />
    <div className="relative flex flex-col items-center gap-2 max-w-[440px]">
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.05,
          type: "spring",
          stiffness: 380,
          damping: 18,
        }}
        className="flex items-center justify-center size-10 rounded-full bg-[#ccfbee] border border-[rgba(153,246,223,0.63)]"
      >
        <CheckIcon className="size-5 text-[#0c9582]" />
      </motion.span>
      <h3 className="text-[20px] sm:text-[22px] font-bold text-black tracking-[-0.02em] leading-[28px]">
        Rosie is ready
      </h3>
      <p className="text-[14px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.5]">
        The next step is to choose a live plan and get you connected.
      </p>
    </div>
    <PrimaryCTA onClick={onGoLive} label={CTA_LABEL} />
  </div>
)

export const PrimaryCTA = ({ onClick, label, size = "md" }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
    className={`w-full sm:w-auto border border-gray-900/[0.08] text-white rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${
      size === "lg" ? "px-7 py-3 text-base" : "px-6 py-2.5 text-[15px]"
    }`}
    style={{
      backgroundImage:
        "linear-gradient(180deg, rgba(230,100,100,0.25) 14%, rgba(44,18,65,0) 100%), linear-gradient(90deg, #9332e0 0%, #9332e0 100%)",
    }}
  >
    <span className="font-medium text-white">{label}</span>
    <ArrowRightIcon className={size === "lg" ? "size-5" : "size-4"} />
  </motion.button>
)

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

const WorkPath = ({
  onGoLive,
  onTestAgain,
  askedTransfer,
  askedAppointment,
}) => {
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-1 border-t border-gray-100 mt-1">
        <p className="text-[12.5px] font-medium text-gray-700 tracking-[-0.01em] pt-3 sm:pt-0 sm:pr-1">
          When you&apos;re done tweaking:
        </p>
        <button
          type="button"
          onClick={onTestAgain}
          className="text-sm font-semibold text-purple-700 tracking-[-0.01em] cursor-pointer hover:text-purple-600 flex items-center gap-1 px-3 py-2"
        >
          <PhoneIcon className="size-4 stroke-[2]" />
          Test the call again
        </button>
        <button
          type="button"
          onClick={onGoLive}
          className="text-sm font-medium text-gray-700 tracking-[-0.01em] cursor-pointer hover:text-black px-3 py-2"
        >
          Or just go live →
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
      <PlusIcon className="size-4 text-gray-700 group-hover:text-purple-700 mt-1 shrink-0 transition-colors stroke-[2.5]" />
    </motion.button>
  )
}
