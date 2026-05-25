import {
  CheckCircleIcon,
  ClockIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline"

const CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircleIcon,
    className: "bg-emerald-200 text-emerald-700",
  },
  inProgress: {
    label: "In Progress",
    icon: ClockIcon,
    className: "bg-blue-100 text-blue-700",
  },
  inactive: {
    label: "Inactive",
    icon: NoSymbolIcon,
    className: "bg-amber-100 text-amber-700",
  },
}

/**
 * Status pill for the SMS number: Active (green), In Progress (blue clock) or
 * Inactive (amber no-symbol). Mirrors the ActiveBadge shape.
 */
export default function NumberStatusBadge({ status = "inactive" }) {
  const { label, icon: Icon, className } = CONFIG[status] ?? CONFIG.inactive
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-[3px] pl-1.5 pr-3 text-xs ${className}`}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.5} />
      {label}
    </span>
  )
}
