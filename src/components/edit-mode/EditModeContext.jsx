"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import { createLocalStorageAdapter } from "./contentStore"

const EditModeContext = createContext(null)

/**
 * Holds edit-mode state and the map of copy overrides (keyed by EditableText id).
 *
 * Overrides start empty and hydrate from the adapter *after mount* — this avoids
 * an SSR/client markup mismatch (same technique as useWidgetCustomization.js), so
 * the first paint always renders the in-source defaults and then swaps in any
 * saved overrides.
 *
 * `adapter` is injectable so Phase 2 can pass a Firebase adapter; defaults to
 * localStorage.
 */
export function EditModeProvider({ children, adapter }) {
  const store = useMemo(() => adapter ?? createLocalStorageAdapter(), [adapter])
  const [editMode, setEditMode] = useState(false)
  const [overrides, setOverrides] = useState({})

  // Hydrate from storage on mount.
  useEffect(() => {
    setOverrides(store.load())
  }, [store])

  // React to external changes (no-op for localStorage; live for Firebase).
  useEffect(() => store.subscribe(setOverrides), [store])

  const setOverride = useCallback(
    (id, value) => {
      setOverrides((prev) => {
        const next = { ...prev, [id]: value }
        store.persist(next)
        return next
      })
    },
    [store],
  )

  const resetOverride = useCallback(
    (id) => {
      setOverrides((prev) => {
        if (!(id in prev)) return prev
        const next = { ...prev }
        delete next[id]
        store.persist(next)
        return next
      })
    },
    [store],
  )

  const value = useMemo(
    () => ({ editMode, setEditMode, overrides, setOverride, resetOverride }),
    [editMode, overrides, setOverride, resetOverride],
  )

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const ctx = useContext(EditModeContext)
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider")
  }
  return ctx
}
