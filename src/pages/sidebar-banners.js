import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export default function SidebarBannersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium mb-8"
        >
          <ArrowLeftIcon className="size-4" /> Back to prototypes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sidebar banners
        </h1>
        <p className="text-gray-600 mb-8">
          Placeholder for sidebar banner prototypes. Add components and layouts
          here to pass to backend.
        </p>
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
          <p className="font-medium">Prototype content goes here</p>
          <p className="text-sm mt-1">
            Build banner variants, copy, and interactions in this page.
          </p>
        </div>
      </div>
    </div>
  )
}
