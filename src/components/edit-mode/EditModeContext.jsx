"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react"
import { getDb } from "./firebaseClient"
import { createFirestoreAdapter, createMemoryAdapter } from "./contentStore"

const EditModeContext = createContext(null)

/**
 * Holds edit-mode state and the map of copy overrides (keyed by EditableText id).
 *
 * Persistence is centralized in Firestore (one doc per id). The override map is
 * the live source of truth — it hydrates from, and stays in sync with, the DB via
 * onSnapshot, so every client shows the latest copy. Edits write through
 * immediately and are applied optimistically for snappiness.
 *
 * Overrides start empty so the first paint renders in-source defaults (no SSR
 * mismatch); the snapshot swaps in saved copy after mount.
 *
 * `adapter` is injectable (tests / alternate stores); defaults to Firestore when
 * configured, else an in-memory no-op so the app still runs before credentials.
 */
export function EditModeProvider({ children, adapter }) {
  const store = useMemo(() => {
    if (adapter) return adapter
    const db = getDb()
    return db ? createFirestoreAdapter(db) : createMemoryAdapter()
  }, [adapter])

  const [editMode, setEditMode] = useState(false)
  const [overrides, setOverrides] = useState({})

  // Ids with an in-flight write. A live snapshot merges the server map but keeps
  // the optimistic value for any pending id, so a stale echo can't briefly revert
  // a just-saved string before the write round-trips.
  const pendingRef = useRef(new Set())

  // Live reads: full map on first load and on every remote change.
  useEffect(() => {
    const unsub = store.subscribe((serverMap) => {
      setOverrides((prev) => {
        const next = { ...serverMap }
        for (const id of pendingRef.current) {
          if (id in prev) next[id] = prev[id]
        }
        return next
      })
    })
    return unsub
  }, [store])

  const setOverride = useCallback(
    (id, value) => {
      pendingRef.current.add(id)
      setOverrides((prev) => ({ ...prev, [id]: value })) // optimistic
      Promise.resolve(store.set(id, value))
        .catch((err) => console.warn("[edit-mode] save failed:", err))
        .finally(() => pendingRef.current.delete(id))
    },
    [store],
  )

  const resetOverride = useCallback(
    (id) => {
      pendingRef.current.add(id)
      setOverrides((prev) => {
        if (!(id in prev)) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      Promise.resolve(store.remove(id))
        .catch((err) => console.warn("[edit-mode] reset failed:", err))
        .finally(() => pendingRef.current.delete(id))
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
