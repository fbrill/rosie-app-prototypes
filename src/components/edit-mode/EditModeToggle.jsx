"use client"

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { useEditMode } from "./EditModeContext"

/**
 * Floating action button (bottom-right) that flips copy edit mode on/off.
 * Black with a white icon at rest; green with a dark icon while editing.
 */
export default function EditModeToggle() {
  const { editMode, setEditMode } = useEditMode()
  return (
    <button
      type="button"
      onClick={() => setEditMode((v) => !v)}
      aria-pressed={editMode}
      aria-label={editMode ? "Finish editing copy" : "Edit copy"}
      title={editMode ? "Editing copy — click to finish" : "Edit copy"}
      className={`fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-colors ${
        editMode
          ? "bg-[#A3E635] text-[#010539] hover:bg-[#9bdb2e]"
          : "bg-black text-white hover:bg-black/90"
      }`}
    >
      <PencilSquareIcon className="size-6" strokeWidth={2} />
    </button>
  )
}
