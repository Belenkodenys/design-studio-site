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
      const a = Math.abs(p)
      const vw = window.innerWidth
      const tx = dirX ? dirX * p * vw * 0.16 * depth : p * vw * 0.03 * depth
      const ty = dirY ? dirY * p * vh * 0.22 * depth : p * vh * 0.06 * depth
      const rot = (dirX ? dirX * p * 6 : p * 2) * depth
      // Phones: the picture is fully in view at the centre (scale 1) and
      // grows as it moves away. Desktop: slight shrink away from the centre.
      const phone = vw <= 600
      const sc = phone ? 1 + Math.min(0.6, a * 0.55) : 1 - Math.min(0.14, a * 0.12)
      const op = Math.max(0, Math.min(1, phone ? 1.4 - a * 0.8 : 1.25 - a * 0.9))
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
