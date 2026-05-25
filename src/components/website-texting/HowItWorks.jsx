/**
 * Numbered 4-step explainer row. Each step: { n, icon, title, body, muted? }.
 * A muted step renders dashed/greyed — used for the "downside" final step
 * (e.g. chat's "you never know who they were").
 */
export default function HowItWorks({ label = "How it works", steps }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.72px] text-gray-600">
        {label}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.n}
              className={`flex flex-col gap-2 rounded-xl border p-4 ${
                step.muted
                  ? "border-dashed border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                    step.muted
                      ? "bg-gray-200 text-gray-600"
                      : "bg-purple-200 text-purple-700"
                  }`}
                >
                  {step.n}
                </span>
                {Icon && (
                  <Icon
                    className={`size-5 ${step.muted ? "text-gray-400" : "text-purple-600"}`}
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <p
                className={`text-sm font-semibold ${step.muted ? "text-gray-600" : "text-black"}`}
              >
                {step.title}
              </p>
              <p
                className={`text-[13px] leading-[1.4] ${step.muted ? "text-gray-500" : "text-gray-700"}`}
              >
                {step.body}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
