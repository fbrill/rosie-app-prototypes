import Link from "next/link"
import { ArrowLeftCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import GlobalSidebar from "@/components/sidebar-banners/GlobalSidebar"

export default function SidebarBannersPage() {
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex">
        <div className="m-2.5 shrink-0">
          <GlobalSidebar />
        </div>
        <main className="flex-1 min-h-screen flex flex-col items-center justify-center" aria-label="Page content">
          <div className="p-6 pt-14">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <ArrowLeftCircleIcon
                className="size-4 text-gray-600"
              />
              Prototype for the "promo banners" in the global sidebar.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
