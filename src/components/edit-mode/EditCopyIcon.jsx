/**
 * "Edit copy" glyph — a pencil over text lines. Distinct from the heroicons used
 * throughout the normal UI, so edit-mode affordances read as their own thing.
 *
 * Strokes use currentColor, so it inherits the button's text color (white on the
 * black FAB, dark on the green FAB, green on the dark inline pencil).
 */
export default function EditCopyIcon({ className = "size-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4H20" />
      <path d="M4 8H10.5" />
      <path d="M4 12H7.0022" />
      <path d="M8 21.0001H11.8649L19.0676 13.7974C20.1348 12.7301 20.1348 10.9998 19.0676 9.93252C18.0003 8.86527 16.27 8.86527 15.2027 9.93252L8 17.1352V21.0001Z" />
    </svg>
  )
}
