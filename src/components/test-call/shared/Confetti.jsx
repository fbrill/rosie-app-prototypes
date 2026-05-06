import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"
import { CONFETTI_COLORS } from "./constants"

export const Confetti = ({ intensity = "full", delay = 450 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const fire = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    })

    const presets = {
      burst: {
        origin: { x: 0.5, y: 1 },
        angle: 90,
        spread: 80,
        startVelocity: 20,
        gravity: 0.6,
        decay: 0.93,
        ticks: 220,
        particleCount: 140,
        scalar: 0.85,
        colors: CONFETTI_COLORS,
      },
      // Sized for a header-shaped container (wide + short). Two side cannons
      // arc toward the middle so particles stay within the panel.
      celebrate: {
        origin: { x: 0.5, y: 1 },
        angle: 90,
        spread: 100,
        startVelocity: 22,
        gravity: 0.7,
        decay: 0.92,
        ticks: 200,
        particleCount: 110,
        scalar: 0.8,
        colors: CONFETTI_COLORS,
      },
      full: {
        origin: { x: 0.5, y: 1 },
        angle: 90,
        spread: 110,
        startVelocity: 25,
        gravity: 0.55,
        decay: 0.94,
        ticks: 400,
        particleCount: 380,
        scalar: 0.95,
        colors: CONFETTI_COLORS,
      },
    }
    const params = presets[intensity] || presets.full

    const timeout = setTimeout(() => fire(params), delay)

    return () => {
      clearTimeout(timeout)
      fire.reset()
    }
  }, [intensity, delay])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
