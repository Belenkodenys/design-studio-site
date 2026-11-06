'use client'

import { useEffect, useRef } from 'react'

// Scroll-driven "steam" effect for the hero photo: as the first screen is
// scrolled, the picture blurs, lifts and thins out like vapour, while the
// logo stays where it is. Progress (0…1) is written to a CSS variable on the
// hero; the CSS does the rest.
export default function HeroFade({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ticking = false
    const update = () => {
      ticking = false
      const h = el.offsetHeight || window.innerHeight
      const p = reduce ? 0 : Math.min(1, Math.max(0, window.scrollY / (h * 0.9)))
      el.style.setProperty('--steam', p.toFixed(3))
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
  }, [])
  return (
    <section ref={ref} className="mol-hero">
      {children}
    </section>
  )
}
