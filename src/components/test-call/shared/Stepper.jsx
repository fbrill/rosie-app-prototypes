import { CheckIcon } from "@heroicons/react/24/solid"

const STEPS = [
  { id: "01", name: "Train", status: "complete" },
  { id: "02", name: "Customize", status: "complete" },
  { id: "03", name: "Test", status: "current" },
  { id: "04", name: "Go Live", status: "upcoming" },
]

export const Stepper = () => {
  return (
    <nav aria-label="Progress" className="mt-5 sm:mt-7">
      {/* Mobile: compact horizontal pill — keeps the CTA above the fold */}
      <ol
        role="list"
        className="md:hidden flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-1.5 mx-auto w-fit"
      >
        {STEPS.map((step, idx) => (
          <li key={step.name} className="flex items-center gap-1.5">
            {step.status === "complete" ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ccfbee]">
                <CheckIcon className="size-3 text-[#0e7768]" />
              </span>
            ) : step.status === "current" ? (
              <span className="flex items-center gap-1.5 rounded-full bg-purple-700 pl-1 pr-2.5 py-0.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-purple-700">
                  {step.id}
                </span>
                <span className="text-[12px] font-semibold text-white">
                  {step.name}
                </span>
              </span>
            ) : (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-gray-200">
                <span className="text-[10px] font-semibold text-gray-700">
                  {step.id}
                </span>
              </span>
            )}
            {idx !== STEPS.length - 1 && (
              <span className="size-1 rounded-full bg-gray-200" />
            )}
          </li>
        ))}
      </ol>

      {/* Desktop: full labeled steps */}
      <ol
        role="list"
        className="hidden md:flex divide-y-0 rounded-xl border border-gray-200 bg-white"
      >
        {STEPS.map((step, stepIdx) => (
          <li key={step.name} className="relative flex flex-1">
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

            {stepIdx !== STEPS.length - 1 ? (
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
