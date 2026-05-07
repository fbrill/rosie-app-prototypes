import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRightIcon, CheckIcon, PlayIcon } from "@heroicons/react/24/solid"
import {
  SpeakerWaveIcon,
  MegaphoneIcon,
  BuildingOffice2Icon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  IdentificationIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"
import { BUSINESS_NAME, CARD_SHADOW } from "./constants"
import { CallPill } from "./CallPill"
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

const WorkPath = ({ onGoLive, askedTransfer, askedAppointment }) => {
  const [editedTiles, setEditedTiles] = useState({})
  const [openModal, setOpenModal] = useState(null)

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
  const activeTile = tiles.find((t) => t.id === openModal)

  const handleSave = (tileId, value) => {
    setEditedTiles((prev) => ({ ...prev, [tileId]: value ?? true }))
    setOpenModal(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiles.map((tile, idx) => (
          <TuneTile
            key={tile.id}
            tile={tile}
            index={idx}
            edited={Boolean(editedTiles[tile.id])}
            onClick={() => setOpenModal(tile.id)}
          />
        ))}
      </div>

      <TestAgainBanner onGoLive={onGoLive} />

      <Modal
        open={openModal === "pronounce"}
        onClose={() => setOpenModal(null)}
      >
        <PronunciationModal
          initialValue={editedTiles.pronounce}
          onClose={() => setOpenModal(null)}
          onSave={(value) => handleSave("pronounce", value)}
        />
      </Modal>
      <Modal
        open={openModal === "greeting"}
        onClose={() => setOpenModal(null)}
        maxWidth="max-w-2xl"
      >
        <GreetingModal
          onClose={() => setOpenModal(null)}
          onSave={() => handleSave("greeting", true)}
        />
      </Modal>
      <Modal
        open={
          openModal !== null &&
          openModal !== "pronounce" &&
          openModal !== "greeting"
        }
        onClose={() => setOpenModal(null)}
      >
        {activeTile && (
          <StubModal
            tile={activeTile}
            edited={Boolean(editedTiles[openModal])}
            onClose={() => setOpenModal(null)}
            onSave={() => handleSave(openModal, true)}
          />
        )}
      </Modal>
    </div>
  )
}

const TestAgainBanner = ({ onGoLive }) => (
  <div className="rounded-2xl bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 border border-purple-200 p-4 sm:p-5 flex flex-col items-center gap-3">
    <p className="text-[13.5px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.5] text-center max-w-[440px]">
      Make changes above to tune how your agent understands your business — then
      test the call again and go live.
    </p>
    <CallPill size="default" />
    <button
      type="button"
      onClick={onGoLive}
      className="text-[13px] font-medium text-gray-700 tracking-[-0.01em] cursor-pointer hover:text-black underline"
    >
      Ready? Go live →
    </button>
  </div>
)

const TuneTile = ({ tile, index, edited, onClick }) => {
  const Icon = tile.icon
  return (
    <motion.button
      type="button"
      onClick={onClick}
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
          {tile.smart && !edited && (
            <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-[0.04em] bg-purple-100 rounded-full px-1.5 py-0.5 shrink-0">
              Suggested
            </span>
          )}
          {edited && (
            <span className="text-[10px] font-semibold text-[#0c9582] uppercase tracking-[0.04em] bg-[#ccfbee] rounded-full px-1.5 py-0.5 shrink-0">
              Updated
            </span>
          )}
        </div>
        <p className="text-[12.5px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.35]">
          {tile.description}
        </p>
      </div>
      {edited ? (
        <CheckCircleIcon className="size-5 text-[#0c9582] mt-0.5 shrink-0 stroke-[2]" />
      ) : (
        <PencilSquareIcon className="size-4 text-gray-700 group-hover:text-purple-700 mt-1 shrink-0 transition-colors stroke-[2]" />
      )}
    </motion.button>
  )
}

/* ---------- Modals ---------- */

const Modal = ({ open, onClose, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-[20px] shadow-[0_24px_48px_-12px_rgba(42,20,60,0.25)] w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ModalHeader = ({ title, subtitle, onClose }) => (
  <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-2">
    <div className="flex flex-col gap-1">
      <h2 className="text-[19px] font-bold text-black tracking-[-0.02em]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em]">
          {subtitle}
        </p>
      )}
    </div>
    <button
      type="button"
      onClick={onClose}
      className="shrink-0 size-8 rounded-full flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
      aria-label="Close"
    >
      <XMarkIcon className="size-5 stroke-[2]" />
    </button>
  </div>
)

const PronunciationModal = ({ initialValue, onClose, onSave }) => {
  const [value, setValue] = useState(
    typeof initialValue === "string" ? initialValue : "",
  )

  return (
    <div className="flex flex-col">
      <ModalHeader
        title="Fix pronunciation"
        subtitle="Help Rosie say your business name correctly."
        onClose={onClose}
      />

      <div className="px-6 py-4 flex flex-col gap-4">
        <Field label="Business Name">
          <input
            type="text"
            value={BUSINESS_NAME}
            disabled
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-[14px] font-medium text-gray-700 tracking-[-0.01em] cursor-not-allowed"
          />
        </Field>

        <Field label="Name Pronunciation">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Vick-tor-ee-uh Bay-kohs"
              className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2.5 text-[14px] font-medium text-black tracking-[-0.01em] placeholder:text-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            <button
              type="button"
              disabled={!value.trim()}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:hover:bg-purple-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <PlayIcon className="size-3.5" />
              Preview
            </button>
          </div>
          <p className="text-[12.5px] font-medium text-gray-700 tracking-[-0.01em] mt-1.5">
            Spell it out phonetically so Rosie says it correctly on calls.{" "}
            <span className="font-bold text-black">Leave blank</span> to use
            your Name field as-is.
          </p>
        </Field>

        <div className="bg-purple-25 border border-purple-100 rounded-xl p-3 flex items-start gap-2.5">
          <InformationCircleIcon className="size-4 shrink-0 text-purple-700 stroke-[2] mt-0.5" />
          <p className="text-[12.5px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.5]">
            Spell it as plain English words the way it sounds — no hyphens
            needed. For example:{" "}
            <span className="font-semibold text-purple-700">
              &quot;Schütz&quot;
            </span>{" "}
            →{" "}
            <span className="font-semibold text-purple-700">
              &quot;Shoots&quot;
            </span>
            , or{" "}
            <span className="font-semibold text-purple-700">
              &quot;HVAC&quot;
            </span>{" "}
            →{" "}
            <span className="font-semibold text-purple-700">
              &quot;Aitch Vack&quot;
            </span>
            .
          </p>
        </div>
      </div>

      <ModalFooter
        onCancel={onClose}
        onSave={() => onSave(value.trim() || true)}
      />
    </div>
  )
}

const GreetingModal = ({ onClose, onSave }) => {
  const [tab, setTab] = useState("default")

  return (
    <div className="flex flex-col">
      <ModalHeader
        title="Greeting"
        subtitle="Rosie will say this greeting every time she answers the phone."
        onClose={onClose}
      />

      <div className="border-t border-gray-100" />

      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-black tracking-[-0.01em]">
              Phone Greeting
            </span>
            <InformationCircleIcon className="size-4 text-gray-500 stroke-[2]" />
          </div>
          <GreetingTabs tab={tab} setTab={setTab} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "default" ? (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <DefaultGreetingCard />
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <CustomGreetingPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ModalFooter onCancel={onClose} onSave={onSave} />
    </div>
  )
}

const GreetingTabs = ({ tab, setTab }) => {
  const options = [
    { id: "default", label: "Default" },
    { id: "custom", label: "Write My Own" },
  ]
  return (
    <div className="relative inline-flex p-1 bg-gray-100 rounded-full border border-gray-200">
      {options.map((opt) => {
        const active = tab === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTab(opt.id)}
            className="relative px-4 py-1.5 rounded-full cursor-pointer z-10"
          >
            {active && (
              <motion.span
                layoutId="greeting-tab-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 bg-purple-100 rounded-full"
              />
            )}
            <span
              className={`relative text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
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

const DefaultGreetingCard = () => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-2">
    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.06em]">
      Default Greeting
    </p>
    <p className="text-[14px] text-black tracking-[-0.01em] leading-[1.55]">
      Hello, thank you for calling {BUSINESS_NAME}. Our call may be recorded
      today for quality control purposes. My name is Rosie, how can I help you.
    </p>
  </div>
)

const CustomGreetingPlaceholder = () => (
  <div className="bg-purple-25 border border-purple-100 rounded-xl p-5 flex items-start gap-3">
    <div className="shrink-0 size-9 rounded-full bg-purple-100 flex items-center justify-center">
      <MegaphoneIcon className="size-5 text-purple-700 stroke-[2]" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-[14px] font-semibold text-black tracking-[-0.01em]">
        Standard greeting customization options
      </p>
      <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.5]">
        Write your own greeting with company info, dynamic tags, and an optional
        legal disclaimer. Editor coming soon — stick with the default for now.
      </p>
    </div>
  </div>
)

const StubModal = ({ tile, edited, onClose, onSave }) => {
  const Icon = tile.icon
  return (
    <div className="flex flex-col">
      <ModalHeader
        title={tile.title}
        subtitle={tile.description}
        onClose={onClose}
      />
      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 bg-purple-25 border border-purple-100 rounded-xl p-4">
          <div className="shrink-0 size-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Icon className="size-5 text-purple-700 stroke-[2]" />
          </div>
          <p className="text-[13px] font-medium text-gray-700 tracking-[-0.01em] leading-[1.5]">
            This step is a placeholder for the real editor. Click{" "}
            <span className="font-semibold text-black">Save</span> to mark it as
            updated for the prototype walkthrough.
          </p>
        </div>
      </div>
      <ModalFooter
        onCancel={onClose}
        onSave={onSave}
        saveLabel={edited ? "Save changes" : "Mark updated"}
      />
    </div>
  )
}

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[12px] font-semibold text-gray-700 uppercase tracking-[0.04em]">
      {label}
    </span>
    {children}
  </label>
)

const ModalFooter = ({ onCancel, onSave, saveLabel = "Save" }) => (
  <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-25">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 rounded-full text-[14px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={onSave}
      className="px-5 py-2 rounded-full text-[14px] font-semibold text-white bg-purple-700 hover:bg-purple-600 cursor-pointer transition-colors shadow-[0_1px_2px_0_rgba(16,24,40,0.08)]"
    >
      {saveLabel}
    </button>
  </div>
)
