import { PhoneArrowUpRightIcon } from "@heroicons/react/24/solid"
import { ROSIE_NUMBER } from "./constants"

// size: "compact" | "default" | "hero" (waiting-state focal point)
export const CallPill = ({ size = "default" }) => {
  const config = {
    compact: {
      width: "max-w-[260px]",
      pad: "pl-2 pr-5 py-2",
      pill: "h-[34px] px-3 text-sm",
      icon: "size-4",
      number: "text-lg leading-[30px]",
      shadow: "",
    },
    default: {
      width: "max-w-[300px]",
      pad: "pl-2 pr-5 py-2",
      pill: "h-[34px] px-3 text-sm",
      icon: "size-4",
      number: "text-lg leading-[30px]",
      shadow: "",
    },
    hero: {
      width: "max-w-[400px]",
      pad: "pl-2 pr-4 sm:pl-2.5 sm:pr-6 py-2 sm:py-2.5",
      pill: "h-[38px] px-3 sm:h-[44px] sm:px-4 text-[13px] sm:text-[15px]",
      icon: "size-4 sm:size-[18px]",
      number: "text-[22px] sm:text-[30px] leading-[34px] sm:leading-[40px]",
      shadow: "shadow-[0_8px_28px_-6px_rgba(42,20,60,0.22)]",
    },
  }[size]

  return (
    <div
      className={`bg-white border border-[rgba(42,20,60,0.1)] rounded-full flex items-center justify-between gap-2 w-full ${config.width} ${config.pad} ${config.shadow}`}
    >
      <div
        className={`bg-purple-200 border border-purple-200 rounded-full flex items-center gap-1.5 ${config.pill}`}
      >
        <PhoneArrowUpRightIcon className={`${config.icon} text-purple-700`} />
        <span className="text-purple-700 font-medium">Call</span>
      </div>
      <p
        className={`w-full text-center text-black font-bold tabular-nums tracking-[-0.02em] ${config.number}`}
      >
        {ROSIE_NUMBER}
      </p>
    </div>
  )
}
