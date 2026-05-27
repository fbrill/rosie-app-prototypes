/**
 * Shared white card with a subtle gradient header row. Both the Widget Type
 * and Texting Settings cards are built on this.
 *
 * @param {React.ComponentType} icon  - heroicon shown in the purple circle
 * @param {string} title              - header title
 * @param {React.ReactNode} headerRight - optional content on the header's right
 * @param {React.ReactNode} children  - card body
 */
export default function SectionCard({
  icon: Icon,
  title,
  headerRight,
  children,
  className = "",
}) {
  return (
    <section
      className={`overflow-hidden rounded-[12px] border border-gray-200 bg-white ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-t from-gray-25 to-white px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-200">
            {Icon && (
              <Icon className="size-5 text-purple-700" strokeWidth={1.5} />
            )}
          </span>
          <h2 className="text-lg font-semibold text-black">{title}</h2>
        </div>
        {headerRight}
      </div>
      {children}
    </section>
  )
}
