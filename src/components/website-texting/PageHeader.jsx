import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { Badge } from "./Badge"

/**
 * Top header card for the settings page: title + Beta tag, a one-line
 * description, and the (disabled) Publish action. Visual-only for now.
 */
export default function PageHeader() {
  return (
    <header className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-6 shadow-[0px_10px_20px_-12px_rgba(0,0,0,0.02),0px_58px_50px_-20px_rgba(0,0,0,0.03)]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Website Widgets
          </h1>
          <Badge label="Beta" variant="betaBlue" />
        </div>
        <p className="mt-0.5 text-sm text-gray-600">
          Add a widget to your website so visitors can reach you instantly.
        </p>
      </div>

      <button
        type="button"
        disabled
        className="flex min-w-[140px] cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-gray-300 px-[18px] py-2.5 text-base font-medium text-gray-500"
      >
        Publish
        <PaperAirplaneIcon className="size-6 shrink-0" strokeWidth={1.5} />
      </button>
    </header>
  )
}
