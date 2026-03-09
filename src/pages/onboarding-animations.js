import Card from "@/components/onboarding-animations/Card"
import { useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { ArrowLeftIcon as ArrowLeftOutline } from "@heroicons/react/24/outline"

const GuidedSetUp = () => {
  const [inEditMode, setInEditMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState("next")

  const handleNextStep = () => {
    setDirection("next")
    if (currentStep < cards.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    setDirection("prev")
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="bg-gray-200 p-2.5 min-h-screen">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-[10px] p-7 min-h-[calc(100vh-20px)]">
        <div className="max-w-[720px] mx-auto">
          <div className="flex justify-center items-center">
            <img src="/images/logo.svg" alt="logo" />
            <div className="w-20" />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 text-left items-center mt-7 border border-gray-200 rounded-[10px]">
            <p className="text-gray-500 text-sm font-medium border-r border-gray-200 p-3">
              Train & Test
            </p>
            <p className="text-purple-700 bg-purple-50 text-sm font-medium border-r border-gray-200 p-3">
              Customize
            </p>
            <p className="text-gray-500 text-sm font-medium p-3">Launch</p>
          </div>

          {/* Step Title */}
          <div className="max-w-[560px] mx-auto my-10 flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold">Customize your agent</h1>
            <p className="text-md text-gray-700">
              Make Rosie even more accurate for your callers by fine-tuning
              these details about your business. Don&apos;t worry, you can make
              changes to these settings later.
            </p>
          </div>

          {/* Cards */}
          <Card
            inEditMode={inEditMode}
            setInEditMode={setInEditMode}
            activeCard={cards[currentStep]}
            currentStep={currentStep}
            direction={direction}
          />

          {/* Step Footer */}
          <div className="flex justify-between my-7 h-11 z-20 relative">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:hover:bg-gray-100 rounded-full p-3 ani cursor-pointer sm:mr-2 disabled:cursor-not-allowed disabled:text-gray-400"
                disabled={currentStep === 0 || inEditMode}
              >
                <ArrowLeftIcon className="size-5" />
              </button>

              <p className="text-gray-600 text-sm font-medium w-6 text-right">
                {currentStep + 1}/{cards.length}
              </p>
              <div className="bg-gray-200 rounded-full p-0.5 w-16 sm:w-28">
                <div
                  className="bg-purple-600 h-2 rounded-full ani"
                  style={{
                    width: `${((currentStep + 1) / cards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {!inEditMode && currentStep < cards.length - 1 && (
              <button
                onClick={handleNextStep}
                className="bg-gradient-to-b from-[#E66464]/25 bg-purple-600 hover:bg-purple-800 text-white rounded-full px-5 py-2.5 font-medium flex items-center gap-2 ani cursor-pointer"
              >
                Continue <ArrowRightIcon className="size-5 text-purple-200" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidedSetUp

const cards = [
  {
    title:
      "Let's make sure we've got your business name and overview right before moving on.",
  },
  {
    title:
      "Here are the core services we've got for your business. Does this look right?",
  },
  {
    title:
      "Enable call notifications to get alerted when someone contacts your business.",
  },
  {
    title: "Give your agent a name so they feel like part of your team.",
  },
  {
    title:
      "Make a great first impression. Personalize your agent's call greeting.",
  },
  {
    title:
      "When taking a message, would you like to add custom questions to gather more details?",
  },
  {
    title:
      "Add FAQs about your business so your agent can handle common questions automatically.",
  },
]
