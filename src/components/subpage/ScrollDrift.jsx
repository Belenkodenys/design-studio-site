'use client'

import { useEffect, useRef } from 'react'

// Scroll-driven motion: the element crosses the screen horizontally as the
// page scrolls — in from one side, centred mid-screen, out the other side —
// and back again when scrolling up. `axis`: 'ltr' | 'rtl'. `depth` scales it.
export default function ScrollDrift({ axis = 'left', depth = 1, className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let ticking = false
    // 'ltr': travels left → right while scrolling down; 'rtl': right → left.
    const dir = axis === 'rtl' || axis === 'right' ? -1 : 1

    const update = () => {
      ticking = false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      // -1 … 0 … +1 : below the fold → centred → above the fold
      const p = Math.max(-1.4, Math.min(1.4, ((r.top + r.height / 2) - vh / 2) / (vh / 2)))
      const a = Math.abs(p)
      const phone = vw <= 600
      // Full crossing: off-screen on one side at the bottom of the viewport,
      // centred in the middle, off-screen on the other side at the top.
      const travel = (vw + r.width) / 2 / 1.1
      const tx = dir * p * travel * depth
      const ty = p * vh * 0.04
      const rot = dir * p * 4
      const sc = phone ? 1 + Math.min(0.5, a * 0.45) : 1 - Math.min(0.1, a * 0.08)
      const op = Math.max(0, Math.min(1, 1.5 - a * 0.7))
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
