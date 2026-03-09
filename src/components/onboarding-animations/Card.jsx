import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { classNames, useMediaQuery } from "@/utils"
import {
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid"

const Card = ({
  inEditMode,
  setInEditMode,
  activeCard,
  currentStep,
  direction,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [businessName, setBusinessName] = useState("Gratia Bakery & Cafe")
  const [businessPhone, setBusinessPhone] = useState("(555) 123-1234")
  const [businessOverview, setBusinessOverview] = useState(
    "Gratia Bakery & Cafe is a bakery and cafe that serves delicious pastries and coffee.",
  )

  const variants = {
    enter: (direction) => {
      return {
        x: isDesktop && direction === "next" ? 50 : isDesktop ? -50 : 0,
        opacity: 0,
        rotate: isDesktop && direction === "next" ? 3 : isDesktop ? -3 : 0,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotate: 0,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: isDesktop && direction === "next" ? -50 : isDesktop ? 50 : 0,
        opacity: 0,
        rotate: isDesktop && direction === "next" ? 3 : isDesktop ? -3 : 0,
      }
    },
  }
  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          layout
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            isDesktop
              ? {
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  rotate: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }
              : {
                  opacity: { duration: 0.2 },
                }
          }
          className="origin-bottom"
        >
          <div className="bg-white flex flex-col rounded-xl border border-gray-200 z-10 relative">
            {/* Card header */}

            {/* Card content */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                layout="preserve-aspect"
                className={classNames(
                  "p-8 z-10 relative",
                  inEditMode ? "border-b border-gray-200" : "border-none",
                )}
              >
                <h3 className="text-2xl font-bold sm:text-center">
                  {activeCard.title}
                </h3>
              </motion.div>
              {currentStep !== 0 ? (
                <CardContentPlaceholder title={activeCard.title} />
              ) : inEditMode ? (
                <CardContentEdit
                  setInEditMode={setInEditMode}
                  businessName={businessName}
                  setBusinessName={setBusinessName}
                  businessPhone={businessPhone}
                  setBusinessPhone={setBusinessPhone}
                  businessOverview={businessOverview}
                  setBusinessOverview={setBusinessOverview}
                />
              ) : (
                <CardContentPreview
                  setInEditMode={setInEditMode}
                  businessName={businessName}
                  businessPhone={businessPhone}
                  businessOverview={businessOverview}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Shadows */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[97%] bg-gray-200/60 rounded-xl z-1"
            animate={{
              y: inEditMode ? 2 : 6,
              rotate: inEditMode ? -1 : -2,
            }}
            transition={{ type: "spring" }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-[95%] bg-gray-100/80 rounded-xl z-0"
            animate={{
              y: inEditMode ? 4 : 12,
              rotate: inEditMode ? -2 : -4,
            }}
            transition={{ type: "spring" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Card

const CardContentPreview = ({
  setInEditMode,
  businessName,
  businessPhone,
  businessOverview,
}) => {
  return (
    <motion.div
      transition={{
        type: "tween",
        duration: 0.25,
        ease: "easeIn",
      }}
      className="relative"
      initial={{ opacity: 0, height: "auto", overflow: "hidden" }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: "auto" }}
      key="preview"
    >
      {/* Card body - Preview */}
      <div className="min-h-28 flex items-center justify-center flex-col gap-3 px-8 sm:py-5 pb-5">
        <div className="flex sm:gap-4 w-full flex-col sm:flex-row">
          <p className="sm:w-1/3 text-gray-800 sm:text-right">Business Name</p>
          <p className="sm:w-2/3 text-black font-medium">{businessName}</p>
        </div>
        <div className="flex sm:gap-4 w-full flex-col sm:flex-row">
          <p className="sm:w-1/3 text-gray-800 sm:text-right">Business Phone</p>
          <p className="sm:w-2/3 text-black font-medium">{businessPhone}</p>
        </div>
        <div className="flex sm:gap-4 w-full flex-col sm:flex-row">
          <p className="sm:w-1/3 text-gray-800 sm:text-right">
            Business Overview
          </p>
          <p className="sm:w-2/3 text-black font-medium">{businessOverview}</p>
        </div>
      </div>

      {/* Card footer - Preview */}
      <div className="flex justify-center px-8 pb-8">
        <button
          onClick={() => setInEditMode(true)}
          className="bg-white hover:bg-gray-100 border border-gray-200 rounded-full px-5 py-2.5 text-gray-950 font-medium flex items-center gap-2 ani cursor-pointer"
        >
          Make Changes <PencilSquareIcon className="size-6" />
        </button>
      </div>
    </motion.div>
  )
}

const CardContentEdit = ({
  setInEditMode,
  businessName,
  setBusinessName,
  businessPhone,
  setBusinessPhone,
  businessOverview,
  setBusinessOverview,
}) => {
  const [saving, setSaving] = useState(false)
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setInEditMode(false)
    }, 700)
    // Here you can handle saving the data
    console.log({ businessName, businessPhone, businessOverview })
  }

  return (
    <motion.div
      transition={{
        type: "tween",
        duration: 0.25,
        ease: "easeOut",
      }}
      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      key="edit"
    >
      <div className="p-8">
        <div className="flex flex-col gap-5 sm:gap-3">
          <div className="flex gap-2 sm:gap-5 flex-col sm:flex-row">
            <div className="flex items-center gap-1 w-full sm:w-52">
              <p className="text-black text-sm font-medium">Business Name</p>
              <QuestionMarkCircleIcon className="size-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border border-gray-200 rounded-full py-3 px-4 text-sm focus:outline-none"
                placeholder="Enter your business name..."
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-5 flex-col sm:flex-row">
            <div className="flex items-center gap-1 w-full sm:w-52">
              <p className="text-black text-sm font-medium">Business Phone</p>
              <QuestionMarkCircleIcon className="size-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-full py-3 px-4 text-sm focus:outline-none"
                placeholder="(000) 000-0000"
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-5 items-start flex-col sm:flex-row">
            <div className="flex items-center gap-1 w-full sm:w-52 sm:h-12">
              <p className="text-black text-sm font-medium">
                Business Overview
              </p>
              <QuestionMarkCircleIcon className="size-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <textarea
                value={businessOverview}
                onChange={(e) => setBusinessOverview(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl  py-3 px-4 text-sm focus:outline-none h-32 resize-none"
                placeholder="Enter your business overview..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card footer - Edit Mode */}
      <div className="flex justify-between p-6 border-t border-gray-200">
        <button
          onClick={() => setInEditMode(false)}
          className="bg-gray-100 rounded-full px-5 py-2.5 text-gray-950 font-medium flex items-center gap-2 hover:bg-gray-200 ani cursor-pointer"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-b min-w-36 text-center from-[#E66464]/25 bg-purple-600 hover:bg-purple-800 text-white rounded-full px-5 py-2.5 font-medium flex items-center gap-2 ani cursor-pointer"
          disabled={saving}
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
                {/* Outer static circle */}
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Rotating arc */}
                <path
                  className="opacity-50"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  d="M12 2a10 10 0 0 1 0 20"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </div>
    </motion.div>
  )
}

const CardContentPlaceholder = ({ title }) => {
  return (
    <motion.div
      layout
      transition={{
        type: "tween",
        duration: 0.25,
        ease: "easeOut",
      }}
      initial={{ opacity: 0, height: "auto", overflow: "hidden" }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: "auto" }}
      key="placeholder"
      className="min-h-72"
    >
      <div className="mx-10 mb-10 rounded-xl px-10 py-20 text-center border border-dashed border-gray-200 flex flex-col gap-3 justify-center items-center">
        <WrenchScrewdriverIcon className="size-6 text-gray-300" />
        <p className="text-black text-sm font-medium">
          Placeholder for the step... <br />
          {title}
        </p>
      </div>
    </motion.div>
  )
}
