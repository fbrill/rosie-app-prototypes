/**
 * Centralized persistence for editable UI copy — backed by Firestore.
 *
 * An "adapter" is the single seam between the edit-mode UI and the store. Each
 * edited string is one document in a collection (doc id = the EditableText id),
 * so saving a string creates/updates exactly that entry, and all clients see the
 * latest copy live.
 *
 * Adapter interface:
 *   subscribe(onChange): () => void
 *       Live source of truth. Calls onChange(fullMap) with the complete
 *       { id: value } map on first load and on every remote change. Returns an
 *       unsubscribe fn.
 *   set(id, value): Promise<void>      Create/update one entry.
 *   remove(id): Promise<void>          Delete one entry.
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"

/**
 * Firestore adapter — one document per edit id inside `collectionName`.
 *
 * The document id IS the EditableText id, e.g. "compare.chat.title". Dots are
 * valid in Firestore document ids (only "/", a bare "." or "..", and the
 * "__*__" reserved pattern are disallowed — none of our ids hit those), and
 * dots in a *document id* are unrelated to the dotted-*field-path* gotcha, so no
 * encoding is needed.
 *
 * Each doc: { value: string, updatedAt: <server timestamp> }.
 */
export function createFirestoreAdapter(db, collectionName = "copyOverrides") {
  const col = collection(db, collectionName)

  return {
    subscribe(onChange) {
      return onSnapshot(
        col,
        (snap) => {
          const map = {}
          snap.forEach((d) => {
            const value = d.data()?.value
            if (typeof value === "string") map[d.id] = value
          })
          onChange(map)
        },
        (err) => {
          console.warn("[edit-mode] Firestore subscribe error:", err)
        },
      )
    },
    set(id, value) {
      return setDoc(
        doc(col, id),
        { value, updatedAt: serverTimestamp() },
        { merge: true },
      )
    },
    remove(id) {
      return deleteDoc(doc(col, id))
    },
  }
}

/**
 * No-op fallback used when Firestore is unavailable (env not configured yet, SSR,
 * or init failed). Edits live only in React state for the session — nothing is
 * persisted or shared — so the UI still "works" while credentials are pending.
 */
export function createMemoryAdapter() {
  return {
    subscribe() {
      return () => {}
    },
    set() {
      return Promise.resolve()
    },
    remove() {
      return Promise.resolve()
    },
  }
}
