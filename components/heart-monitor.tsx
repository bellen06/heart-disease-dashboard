"use client"

import { useEffect, useRef } from "react"

interface HeartMonitorProps {
  heartRate?: number
  className?: string
}

export default function HeartMonitor({ heartRate = 72, className = "w-full h-32" }: HeartMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set up canvas
      ctx.strokeStyle = "#f9c74f"
      ctx.lineWidth = 2
      ctx.beginPath()

      // Draw ECG-like waveform
      const centerY = canvas.height / 2
      const amplitude = 40
      const frequency = 0.02
      const heartbeatFreq = (heartRate / 60) * 0.1

      for (let x = 0; x < canvas.width; x++) {
        let y = centerY

        // Create heartbeat pattern
        const heartPhase = (x + time * 2) * heartbeatFreq
        const heartbeat = Math.sin(heartPhase) * amplitude * 0.3

        // Add ECG spikes
        const spikePhase = (x + time * 2) * frequency
        if (Math.sin(spikePhase * 10) > 0.9) {
          y += Math.sin(spikePhase * 50) * amplitude
        } else {
          y += heartbeat + Math.sin(spikePhase) * 10
        }

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Draw heart rate text
      ctx.fillStyle = "#4b5563"
      ctx.font = "bold 16px sans-serif"
      ctx.fillText(`${heartRate} BPM`, 10, 25)

      time += 1
      animationId = requestAnimationFrame(draw)
    }

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [heartRate])

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full h-full bg-card rounded-lg border border-border" />
    </div>
  )
}
