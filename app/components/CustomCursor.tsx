'use client'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [followerPosition, setFollowerPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile/touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    let mouseX = -100
    let mouseY = -100
    let followerX = -100
    let followerY = -100

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setPosition({ x: mouseX, y: mouseY })

      // Check if hovering over clickable element
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [onclick]')
      setIsPointer(!!isClickable)
    }

    const onMouseEnter = () => setIsHidden(false)
    const onMouseLeave = () => setIsHidden(true)

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      setFollowerPosition({ x: followerX, y: followerY })
      requestAnimationFrame(animateFollower)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    const animId = requestAnimationFrame(animateFollower)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', checkMobile)
      cancelAnimationFrame(animId)
    }
  }, [])

  // Don't render on mobile/touch devices
  if (isMobile) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: isPointer ? 8 : 6,
          height: isPointer ? 8 : 6,
          background: 'var(--accent-orange)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s ease',
          opacity: isHidden ? 0 : 1,
          boxShadow: '0 0 10px rgba(255,107,0,0.5)',
        }}
      />
      {/* Follower ring */}
      <div
        style={{
          position: 'fixed',
          left: followerPosition.x,
          top: followerPosition.y,
          width: isPointer ? 48 : 36,
          height: isPointer ? 48 : 36,
          border: `1.5px solid ${isPointer ? 'var(--accent-orange)' : 'rgba(255,107,0,0.4)'}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.3s ease',
          opacity: isHidden ? 0 : 0.8,
          background: isPointer ? 'rgba(255,107,0,0.08)' : 'transparent',
        }}
      />
    </>
  )
}
