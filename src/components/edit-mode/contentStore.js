/**
 * Centralized, swappable persistence for editable UI copy.
 *
 * An "adapter" is the single seam between the edit-mode UI and wherever the
 * copy overrides actually live. Phase 1 stores them in localStorage; Phase 2
 * can drop in a Firebase adapter implementing the same three methods, and no
 * component (nor the provider) has to change.
 *
 * Adapter interface:
 *   load(): Record<string, string>     - snapshot of overrides for hydration
 *   persist(overrides): void           - write the whole map
 *   subscribe(listener): () => void    - notify on external changes; returns an
 *                                        unsubscribe fn. (no-op for localStorage)
 */

export const STORAGE_KEY = "ww:content-overrides"

/**
 * localStorage-backed adapter. Survives full page reloads / browser restarts on
 * the same machine. Mirrors the try/catch storage handling in
 * useWidgetCustomization.js — storage can be unavailable (SSR, privacy mode).
 */
export function createLocalStorageAdapter(key = STORAGE_KEY) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : {}
      } catch {
        return {}
      }
    },
    persist(overrides) {
      try {
        localStorage.setItem(key, JSON.stringify(overrides))
      } catch {
        // Storage unavailable — overrides still live in React state this session.
      }
    },
    // No external change source for localStorage in this tab. A future Firebase
    // adapter returns its onSnapshot unsubscribe here.
    subscribe() {
      return () => {}
    },
  }
}

/**
 * Phase 2 sketch — implement the same three methods against Firestore:
 *
 *   export function createFirebaseAdapter(db, docPath) {
 *     let cache = {}
 *     return {
 *       load: () => cache,
 *       persist: (overrides) => setDoc(doc(db, docPath), overrides, { merge: true }),
 *       subscribe: (listener) =>
 *         onSnapshot(doc(db, docPath), (snap) => {
 *           cache = snap.data() ?? {}
 *           listener(cache)
 *         }),
 *     }
 *   }
 *
 * Swap it in at <EditModeProvider adapter={createFirebaseAdapter(db, path)} />.
 */
