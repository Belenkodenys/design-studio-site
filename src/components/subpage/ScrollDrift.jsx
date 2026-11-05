'use client'

import { useEffect, useRef } from 'react'

// Scroll-driven motion: the element's position follows the scroll in both
// directions. `axis` sets the dominant drift (left | right | top | bottom),
// `depth` scales the amount. Centre of the viewport = resting position.
export default function ScrollDrift({ axis = 'left', depth = 1, className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let ticking = false
    const dirX = axis === 'left' ? -1 : axis === 'right' ? 1 : 0
    const dirY = axis === 'top' ? -1 : axis === 'bottom' ? 1 : 0

    const update = () => {
      ticking = false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // -1 … 0 … +1 : below the fold → centred → above the fold
      const p = Math.max(-1.3, Math.min(1.3, ((r.top + r.height / 2) - vh / 2) / (vh / 2)))
      const vw = window.innerWidth
      const phone = vw <= 600
      // Phones: a dead zone around the centre (|p| < 0.3) where the picture
      // sits exactly at screen width, untransformed; outside it the picture
      // slides sideways and grows. Desktop: continuous drift.
      let q = p
      if (phone) {
        const dz = 0.3
        q = Math.abs(p) < dz ? 0 : Math.sign(p) * (Math.abs(p) - dz) / (1 - dz)
      }
      const a = Math.abs(q)
      const tx = dirX ? dirX * q * vw * 0.16 * depth : q * vw * 0.03 * depth
      const ty = dirY ? dirY * q * vh * 0.22 * depth : q * vh * 0.06 * depth
      const rot = (dirX ? dirX * q * 6 : q * 2) * depth
      const sc = phone ? 1 + Math.min(0.6, a * 0.6) : 1 - Math.min(0.14, a * 0.12)
      const op = Math.max(0, Math.min(1, phone ? 1.4 - a * 0.9 : 1.25 - a * 0.9))
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`
      el.style.opacity = op.toFixed(3)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [axis, depth])

  return (
    <div ref={ref} className={`drift ${className}`.trim()}>
      {children}
    </div>
  )
}
