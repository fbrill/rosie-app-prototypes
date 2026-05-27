import { CheckCircleIcon } from "@heroicons/react/24/outline"

const VARIANTS = {
  betaBlue: "bg-blue-100 text-blue-700",
  betaPurple: "bg-purple-100 text-purple-600 border border-purple-300",
  premium: "bg-purple-200 text-purple-600",
  included: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700",
}

/**
 * Small uppercase pill — used for the Beta / Premium tags throughout the page.
 */
export function Badge({ label, variant = "betaBlue", className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none ${VARIANTS[variant]} ${className}`}
    >
      {label}
    </span>
  )
}

/**
 * Green "Active" status pill with a check icon — used on the Rosie number.
 */
export function ActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200 py-[3px] pl-1.5 pr-3 text-xs text-emerald-700">
      <CheckCircleIcon className="size-4 shrink-0" strokeWidth={1.5} />
      Active
    </span>
  )
}

/**
 * "Live on your site" pill with a pulsing green dot — marks whichever widget
 * container is currently the live one.
 */
export function LiveBadge({ label = "Live on your site" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 py-[5px] pl-2.5 pr-3 text-xs font-medium text-purple-700">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-purple-500" />
      </span>
      {label}
    </span>
  )
}

/**
 * Amber circular badge marking premium-gated items in the settings sub-nav.
 */
export function PremiumBadge() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100">
      <img src="/images/premium-icon.svg" alt="" className="size-3" />
    </span>
  )
}
