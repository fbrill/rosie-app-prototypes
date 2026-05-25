"use client"

import Link from "next/link"
import {
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"

const navItems = [
  { label: "Quick Start Guide", icon: DocumentCheckIcon },
  { label: "Conversations", icon: ChatBubbleLeftRightIcon },
  { label: "Agent Settings", icon: Cog6ToothIcon, active: true },
  { label: "Integrations", icon: SquaresPlusIcon },
  { label: "Account", icon: UserCircleIcon },
]

/**
 * Left app chrome: logo, business name, primary navigation, and the
 * "Refer and Earn" + Rosie number footer. Tailored to the Website Widgets
 * frame (Agent Settings is the active nav item). Static for this prototype.
 */
export default function GlobalSidebar() {
  return (
    <aside className="sticky top-2.5 flex h-[calc(100vh-1.25rem)] w-[250px] shrink-0 flex-col justify-between overflow-y-auto rounded-[10px] bg-white">
      {/* Top: logo + business + divider */}
      <div className="flex flex-col items-center pt-10">
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
        <div className="h-px w-full bg-gray-200" aria-hidden />

        {/* Main navigation */}
        <nav className="w-full px-5 pt-5" aria-label="Main">
          <ul className="flex flex-col gap-2">
            {navItems.map(({ label, icon: Icon, active }) => (
              <li key={label}>
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-base font-medium ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="size-6 shrink-0" strokeWidth={1.5} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom: refer + Rosie number */}
      <div className="flex flex-col gap-3 px-5 pb-5">
        <a
          href="#"
          className="flex items-center justify-center gap-1 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          <CurrencyDollarIcon className="size-5 text-purple-600" />
          Refer and Earn
        </a>

        <div className="rounded-[10px] bg-white px-4 py-3 text-center">
          <p className="text-base font-medium leading-snug text-black">
            (954) 333-3343
          </p>
          <div className="my-2 h-px w-full bg-gray-300" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">
            Your Rosie Number
          </p>
        </div>
      </div>
    </aside>
  )
}
