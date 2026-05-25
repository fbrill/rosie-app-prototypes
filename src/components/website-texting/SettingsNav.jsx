"use client"

import {
  IdentificationIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  LinkIcon,
  PhoneArrowUpRightIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline"
import { Badge, PremiumBadge } from "./Badge"

const items = [
  { label: "Business Information", icon: IdentificationIcon },
  { label: "Agent Profile", icon: UserIcon },
  { label: "Greeting", icon: ChatBubbleBottomCenterTextIcon },
  { label: "FAQs", icon: QuestionMarkCircleIcon },
  { label: "Take a Message", icon: PencilSquareIcon },
  { label: "Spam Filters", icon: ShieldCheckIcon },
  { label: "Appointments", icon: CalendarDaysIcon, premium: true },
  { label: "Text a Link", icon: LinkIcon, premium: true },
  { label: "Transfer Calls", icon: PhoneArrowUpRightIcon, premium: true },
  { label: "Training Files", icon: DocumentTextIcon, premium: true },
  { label: "Launch Instructions", icon: RocketLaunchIcon },
  {
    label: "Website Widgets",
    icon: ChatBubbleOvalLeftEllipsisIcon,
    active: true,
    beta: true,
  },
]

/**
 * Settings sub-navigation column. Premium-gated items show an amber badge;
 * the active item (Website Widgets) is highlighted and carries a Beta tag.
 */
export default function SettingsNav() {
  return (
    <nav
      className="sticky top-2.5 h-[calc(100vh-1.25rem)] w-[250px] shrink-0 overflow-y-auto rounded-[10px] bg-white p-5"
      aria-label="Settings"
    >
      <ul className="flex flex-col gap-2.5">
        {items.map(({ label, icon: Icon, premium, active, beta }) => (
          <li key={label}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-medium ${
                active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="size-6 shrink-0" strokeWidth={1.5} />
              <span className="flex-1 truncate">{label}</span>
              {premium && <PremiumBadge />}
              {beta && <Badge label="Beta" variant="betaPurple" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
