import { useEffect, useState } from "react"

const STORAGE_KEY = "ww:customization"

// Teal default matches the live widget's #2DD4BF primary.
export const DEFAULT_SETTINGS = {
  primaryColor: "#2DD4BF",
  avatarUrl: "/images/avatar-placeholder.png",
  // Mini greeting widget copy (both types). Empty → per-type default greeting.
  welcomeMessage: "",
  // Chat conversation's opening bubble. Empty → per-type default first message.
  firstMessage: "",
  // Chat composer placeholder. Empty → default ("Type Something…").
  inputPlaceholder: "",
  position: "bottom-right",
  openMode: "immediately",
}

/**
 * Website-widget appearance settings (primary color, avatar, welcome message,
 * position, open mode). Persisted to sessionStorage so edits survive navigation
 * within the session — this is a prototype, so no backend round-trip.
 *
 * Hydrates from storage on mount (after the first render) to avoid an SSR/client
 * markup mismatch.
 */
export function useWidgetCustomization() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
    } catch {
      // Storage unavailable / malformed — keep defaults.
    }
  }, [])

  const save = (next) => {
    setSettings(next)
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable — settings still live for this render at least.
    }
  }

  return { settings, save }
}
