/** Purple-circle icon + title (+ optional description) used for in-card sections. */
export default function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-200">
        <Icon className="size-5 text-purple-700" strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-black">{title}</h3>
        {description && <p className="text-sm text-gray-700">{description}</p>}
      </div>
    </div>
  )
}
