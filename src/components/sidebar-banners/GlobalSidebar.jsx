"use client"

import Link from "next/link"
import {
  DocumentCheckIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  InboxArrowDownIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline"
import BannerStack from "./BannerStack"
import AppDownloadBanner from "./AppDownloadBanner"
import HowDidYouHearBanner from "./HowDidYouHearBanner"

const navItems = [
  { label: "Quick Start Guide", icon: DocumentCheckIcon },
  { label: "Calls", icon: InboxArrowDownIcon },
  { label: "Settings", icon: Cog6ToothIcon },
  { label: "Integrations", icon: SquaresPlusIcon },
  { label: "Account", icon: UserCircleIcon },
]

const sidebarBanners = [
  {
    id: "app-download",
    dismissible: true,
    renderContent: ({ onDismiss, isExiting }) => (
      <AppDownloadBanner onDismiss={onDismiss} isExiting={isExiting} />
    ),
  },
  {
    id: "how-did-you-hear",
    dismissible: false,
    renderContent: () => <HowDidYouHearBanner />,
  },
]

export default function GlobalSidebar() {
  return (
    <aside className="flex min-h-full w-[250px] shrink-0 justify-between flex-col overflow-hidden rounded-lg bg-white">
      {/* Top: logo + account */}
      <div className="flex flex-col items-center gap-0 pt-10">
        <Link href="/" className="flex items-center justify-center">
          <img
            src="/images/logo.svg"
            alt="Rosie"
            className="h-[30px] w-auto"
            width={101}
            height={30}
          />
        </Link>
        <p className="py-5 text-center text-sm font-medium text-gray-700">
          North Shore Painting
        </p>
        <div className="my-0 h-px w-full bg-gray-200" aria-hidden />
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-2">
          <nav
            className="flex flex-1 flex-col gap-0 px-5 pt-5"
            aria-label="Main"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Icon className="size-6 shrink-0" strokeWidth={1.5} />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Stacked banners */}
          <div className="px-4 py-2">
            <BannerStack banners={sidebarBanners} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-5">
        <a
          href="#"
          className="flex items-center justify-center gap-1 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          <CurrencyDollarIcon className="size-5 text-purple-600" />
          Refer and Earn
        </a>

        <div className="rounded-[10px] bg-gray-100 px-4 py-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">
            Your Rosie number
          </p>
          <p className="mt-1 text-base font-medium leading-snug text-black">
            (954) 333-3343
          </p>
        </div>
      </div>
    </aside>
  )
}
