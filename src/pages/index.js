import Link from "next/link"

const prototypes = [
  {
    slug: "onboarding-animations",
    name: "Onboarding animations",
    description:
      "Guided setup flow with step cards, edit mode, and animated transitions.",
  },
  {
    slug: "sidebar-banners",
    name: "Sidebar banners",
    description: "Banner components and patterns for the app sidebar.",
  },
]

export default function PrototypesIndex() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          UI prototypes
        </h1>
        <p className="text-gray-600 mb-10">
          Click a prototype to view or share with backend. Each route is
          self-contained for handoff.
        </p>
        <ul className="space-y-4">
          {prototypes.map(({ slug, name, description }) => (
            <li key={slug}>
              <Link
                href={`/${slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-shadow"
              >
                <h2 className="font-semibold text-gray-900">{name}</h2>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
                <span className="text-sm text-purple-600 font-medium mt-2 inline-block">
                  View prototype →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
