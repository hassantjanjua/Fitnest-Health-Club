'use client'

import { useEffect } from 'react'

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const follower = document.getElementById('cursor-follower')

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor) {
        cursor.style.left = mouseX + 'px'
        cursor.style.top = mouseY + 'px'
      }
    }

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      if (follower) {
        follower.style.left = followerX + 'px'
        follower.style.top = followerY + 'px'
      }
      requestAnimationFrame(animateFollower)
    }

    document.addEventListener('mousemove', onMouseMove)
    animateFollower()

    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-follower" />
    </>
  )
}