"use client"

import { useEffect, useRef, useState } from "react"
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "./Badge"

const PUBLISH_DELAY_MS = 1000

const PURPLE_GRADIENT =
  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg, #ad5def 0%, #822ac6 100%)"
const GREEN_GRADIENT =
  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg, #5cc8aa 0%, #3d9e85 100%)"

const BTN_BASE =
  "flex min-w-[140px] items-center justify-center gap-1.5 rounded-full border px-[18px] py-2.5 text-base font-medium"

/**
 * Top header card for the settings page: title + Beta tag, a one-line
 * description, and the Publish action. When `ready` (a change is pending
 * publish), the button goes purple and pulses; clicking it runs a brief
 * loading state and settles into a green "Published" state (prototype only).
 * When not ready it's a disabled stub. `changeKey` bumps on each new pending
 * change so the flow re-arms even if `ready` was already true.
 */
export default function PageHeader({ ready = false, changeKey = 0 }) {
  const [publishState, setPublishState] = useState("idle") // idle | loading | done
  const timerRef = useRef(null)

  // Re-arm (back to idle/pulsing) whenever readiness flips or a new pending
  // change arrives. When not ready the button renders as a disabled stub.
  useEffect(() => {
    clearTimeout(timerRef.current)
    setPublishState("idle")
  }, [ready, changeKey])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handlePublish = () => {
    if (publishState !== "idle") return
    setPublishState("loading")
    timerRef.current = setTimeout(
      () => setPublishState("done"),
      PUBLISH_DELAY_MS,
    )
  }

  const renderButton = () => {
    if (!ready) {
      return (
        <button
          type="button"
          disabled
          className={`${BTN_BASE} cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500`}
        >
          Publish
          <PaperAirplaneIcon className="size-6 shrink-0" strokeWidth={1.5} />
        </button>
      )
    }

    if (publishState === "loading") {
      return (
        <button
          type="button"
          disabled
          className={`${BTN_BASE} cursor-wait border-purple-300 text-white`}
          style={{ backgroundImage: PURPLE_GRADIENT }}
        >
          Publishing…
          <ArrowPathIcon
            className="size-6 shrink-0 animate-spin"
            strokeWidth={1.5}
          />
        </button>
      )
    }

    if (publishState === "done") {
      return (
        <button
          type="button"
          disabled
          className={`${BTN_BASE} cursor-default border-emerald-300 text-white`}
          style={{ backgroundImage: GREEN_GRADIENT }}
        >
          Published
          <CheckCircleIcon
            className="size-6 shrink-0 text-emerald-100"
            strokeWidth={1.5}
          />
        </button>
      )
    }

    // idle + ready → purple, pulsing, clickable
    return (
      <button
        type="button"
        onClick={handlePublish}
        className={`${BTN_BASE} phone-glow cursor-pointer border-purple-300 text-white`}
        style={{ backgroundImage: PURPLE_GRADIENT }}
      >
        Publish
        <PaperAirplaneIcon className="size-6 shrink-0" strokeWidth={1.5} />
      </button>
    )
  }

  return (
    <div className="sticky top-0 z-10 bg-gray-200 mt-[-10px] pt-[10px] rounded-b-[10px]">
      <header className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-6 shadow-[0px_10px_20px_-12px_rgba(0,0,0,0.02),0px_58px_50px_-20px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Website Widgets
            </h1>
            <Badge label="Beta" variant="betaBlue" />
          </div>
          <p className="mt-0.5 text-sm text-gray-600">
            Add a widget to your website so visitors can reach you instantly.
          </p>
        </div>

        {renderButton()}
      </header>
    </div>
  )
}
