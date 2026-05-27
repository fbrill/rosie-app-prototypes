const VARIANTS = {
  // Full-width strip that sits under a card header.
  band: "border-b border-gray-200 px-6 py-3.5",
  // Standalone rounded note.
  card: "rounded-[10px] border border-gray-200 p-4",
}

/**
 * Grey info callout: the info-circle glyph beside a short message. Comes in two
 * shapes — `band` (default) for a card header strip, and `card` for a
 * standalone rounded note. An optional bold `title` sits above the body, and
 * `children` carries the message (plain text, inline links, etc.).
 *
 * @param {"band"|"card"} [variant]
 * @param {string} [title]           - optional bold heading
 * @param {React.ReactNode} children - body content
 * @param {string} [className]       - extra container classes (e.g. margins)
 */
export default function InfoBanner({
  variant = "band",
  title,
  children,
  className = "",
}) {
  return (
    <div
      className={`flex items-start gap-2 bg-gray-25 ${VARIANTS[variant]} ${className}`}
    >
      <img
        src="/images/info-icon-circle.svg"
        alt=""
        className="size-5 shrink-0"
      />
      <div className="min-w-0 text-sm text-gray-700">
        {title && <p className="font-semibold text-black">{title}</p>}
        {children}
      </div>
    </div>
  )
}
