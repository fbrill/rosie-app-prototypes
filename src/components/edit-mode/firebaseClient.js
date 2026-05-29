/**
 * Client-only Firebase init for the edit-mode copy store.
 *
 * Singleton: one app + Firestore handle reused across renders, Fast Refresh, and
 * React StrictMode double-invokes. Never throws — if the env isn't configured yet
 * (credentials pending) or we're on the server, getDb() returns null and the
 * edit-mode provider falls back to an in-memory (session-only) adapter.
 */

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// apiKey + projectId are the minimum needed to talk to Firestore.
const isConfigured = Boolean(config.apiKey && config.projectId)

let cachedDb
let warned = false

/**
 * Returns the Firestore handle, or null when running server-side or when the
 * NEXT_PUBLIC_FIREBASE_* env isn't configured. Caches the handle after first use.
 */
export function getDb() {
  if (typeof window === "undefined") return null // SSR / build — no client db
  if (cachedDb !== undefined) return cachedDb

  if (!isConfigured) {
    if (!warned) {
      console.warn(
        "[edit-mode] Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env). " +
          "Copy edits will work for this session only — they won't be saved or shared. " +
          "Add credentials to .env.local to enable the central store.",
      )
      warned = true
    }
    cachedDb = null
    return null
  }

  try {
    const app = getApps().length ? getApp() : initializeApp(config)
    cachedDb = getFirestore(app)
  } catch (err) {
    console.warn(
      "[edit-mode] Firebase init failed; falling back to in-memory copy store.",
      err,
    )
    cachedDb = null
  }
  return cachedDb
}
