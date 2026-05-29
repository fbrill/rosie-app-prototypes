"use client"

import { useEffect, useRef, useState } from "react"
import { CheckIcon } from "@heroicons/react/24/outline"
import { useEditMode } from "./EditModeContext"
import EditCopyIcon from "./EditCopyIcon"

// Dev-only guard against two EditableText instances sharing an id (they would
// read/write the same override). Module-level so it spans the whole app.
const seenIds = process.env.NODE_ENV !== "production" ? new Set() : null

/**
 * A single editable string.
 *
 * Outside edit mode it renders exactly `<Tag className>{text}</Tag>` with no
 * extra DOM or handlers. In edit mode, hovering reveals a pencil to the right;
 * clicking it turns the text into an in-place controlled field (input, or
 * textarea when `multiline`). Enter saves (Cmd+Enter for multiline), Escape
 * cancels, blur saves, and an inline checkmark saves.
 *
 * The displayed value is `overrides[id]` if set, else the `children` default
 * (which stays the source of truth in the JSX). Only overrides are persisted.
 *
 * Props:
 *   id         stable override key — encode structural position, never content
 *   children   default copy (must be a plain string; non-strings are skipped)
 *   as / Tag   element to render (default "span")
 *   multiline  use a textarea (default false)
 *   className  passed through to the rendered element / field
 */
export default function EditableText({
  id,
  children,
  as: Tag = "span",
  multiline = false,
  className = "",
}) {
  const { editMode, overrides, setOverride } = useEditMode()
  const fallback = typeof children === "string" ? children : ""
  const current = overrides[id] ?? fallback

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(current)
  const fieldRef = useRef(null)

  useEffect(() => {
    if (seenIds) {
      if (seenIds.has(id)) {
        console.warn(
          `[EditableText] duplicate id "${id}" — overrides will collide.`,
        )
      } else {
        seenIds.add(id)
      }
      return () => seenIds.delete(id)
    }
  }, [id])

  useEffect(() => {
    if (editing && fieldRef.current) {
      fieldRef.current.focus()
      fieldRef.current.select()
    }
  }, [editing])

  // Non-string children (e.g. JSX-composite prices) aren't editable — render as-is.
  if (typeof children !== "string") {
    return <Tag className={className}>{children}</Tag>
  }

  // Plain display path — zero overhead when not editing the page.
  if (!editMode) {
    return <Tag className={className}>{current}</Tag>
  }

  const begin = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setDraft(current)
    setEditing(true)
  }

  const commit = () => {
    if (draft !== current) setOverride(id, draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(current)
    setEditing(false)
  }

  if (editing) {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        cancel()
      } else if (e.key === "Enter" && (!multiline || e.metaKey)) {
        e.preventDefault()
        commit()
      }
    }
    const Field = multiline ? "textarea" : "input"
    return (
      <Tag className={`relative inline-flex items-center gap-1.5 ${className}`}>
        <Field
          ref={fieldRef}
          value={draft}
          aria-label={`Edit: ${fallback}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          onClick={(e) => e.stopPropagation()}
          rows={multiline ? Math.max(2, draft.split("\n").length) : undefined}
          className="m-0 w-full min-w-[4ch] resize-none rounded-md border border-[#010539]/30 bg-white px-2.5 py-1.5 font-[inherit] text-[length:inherit] leading-[inherit] text-[color:inherit] shadow-sm outline-none transition-[color,box-shadow] placeholder:text-gray-400 focus-visible:border-[#010539] focus-visible:ring-2 focus-visible:ring-[#010539]/20"
        />
        {/* role=button (not <button>) so it can safely nest inside a host button label. */}
        <span
          role="button"
          tabIndex={0}
          aria-label="Save"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              commit()
            }
          }}
          className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-black/10 bg-[#010539] text-[#A3E635] shadow-sm transition-colors hover:bg-[#010539]/90"
        >
          <CheckIcon className="size-[18px]" strokeWidth={2} />
        </span>
      </Tag>
    )
  }

  return (
    // pr-8 reserves room on the right so the pencil sits just past the text without
    // overlapping it or getting clipped by an overflow-hidden ancestor.
    <Tag
      className={`group relative inline-block align-middle pr-8 ${className}`}
    >
      {current}
      {/* role=button (not <button>) so it can safely nest inside a host button label.
          Absolutely pinned to the right of the text — a dark pill with a green
          pencil, matching the Figma "edit" button. */}
      <span
        role="button"
        tabIndex={0}
        aria-label="Edit text"
        onClick={begin}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") begin(e)
        }}
        className="absolute right-0 top-1/2 z-10 flex size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[8px] border border-black/10 bg-[#010539] text-[#A3E635] opacity-0 shadow-sm transition-opacity hover:bg-[#010539]/90 group-hover:opacity-100 focus-visible:opacity-100 ring-1 ring-white/30"
      >
        <EditCopyIcon className="size-[18px]" />
      </span>
    </Tag>
  )
}
