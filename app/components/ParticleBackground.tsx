'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  pulse: number
  pulseSpeed: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []
    let mouseX = -9999
    let mouseY = -9999

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000)

      particles = Array.from(
        { length: Math.min(count, 160) },
        (): Particle => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          color:
            Math.random() > 0.65
              ? Math.random() > 0.5
                ? '#FF6B00'
                : '#ff9500'
              : '#ffffff',
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        })
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i]
          const q = particles[j]

          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          const maxDist = 130

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25
            const isOrange =
              p.color !== '#ffffff' || q.color !== '#ffffff'

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)

            ctx.strokeStyle = isOrange
              ? `rgba(255,107,0,${alpha * 0.9})`
              : `rgba(255,255,255,${alpha * 0.35})`

            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Particles
      particles.forEach((p) => {
        p.pulse += p.pulseSpeed

        // FIXED BUG: radius can never become negative
        const pulsedSize = Math.max(
          0.1,
          p.size + Math.sin(p.pulse) * 0.6
        )

        const pulsedOpacity =
          p.opacity + Math.sin(p.pulse) * 0.15

        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        const repelRadius = 140

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius

          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        const speed = Math.sqrt(
          p.vx * p.vx + p.vy * p.vy
        )

        if (speed > 2.5) {
          p.vx = (p.vx / speed) * 2.5
          p.vy = (p.vy / speed) * 2.5
        }

        p.vx *= 0.98
        p.vy *= 0.98

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        if (p.color !== '#ffffff') {
          ctx.shadowBlur = 12
          ctx.shadowColor = p.color
        } else {
          ctx.shadowBlur = 4
          ctx.shadowColor = 'rgba(255,255,255,0.4)'
        }

        ctx.beginPath()
        ctx.arc(
          p.x,
          p.y,
          pulsedSize,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.min(
          Math.max(pulsedOpacity, 0),
          1
        )

        ctx.fill()
        ctx.shadowBlur = 0
      })

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)

      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}