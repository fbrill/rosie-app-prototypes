"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"

export default function AppDownloadBanner({ onDismiss, isExiting }) {
  return (
    <div className="relative rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-100 to-purple-50 p-3">
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          disabled={isExiting}
          className="absolute right-0 top-0 flex size-9 items-center justify-center rounded-full text-gray-600 hover:bg-white/60 hover:text-gray-900 disabled:pointer-events-none"
          aria-label="Dismiss"
        >
          <XMarkIcon className="size-4" />
        </button>
      )}
      <img
        src="/images/promo-phones.png"
        className="-mb-5 mx-auto w-24"
        alt=""
      />
      <h3 className="text-[13px] font-semibold leading-tight text-black capitalize">
        Get instant notifications &amp; manage calls from your phone
      </h3>
      <div className="mt-3 flex items-center gap-2">
        <a href="https://apps.apple.com/us/app/rosie-ai-business-receptionist/id6757593086" className="w-full" target="_blank" rel="noopener noreferrer">
          <img
            src="/images/appstore.png"
            alt="App Store"
            className="w-full"
          />
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.rosie.mobile&hl=en_US" className="w-full" target="_blank" rel="noopener noreferrer">
          <img
            src="/images/googleplay.png"
            alt="Google Play"
            className="w-full"
          />
        </a>
      </div>
    </div>
  )
}
