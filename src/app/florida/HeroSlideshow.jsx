'use client'

import { useEffect, useRef, useState } from 'react'

// Crossfading, swipeable hero background — same feel as the main Belenko hero.
export default function HeroSlideshow({ slides, interval = 5000 }) {
  const [i, setI] = useState(0)
  const touchX = useRef(null)
  const go = (n) => setI((c) => ((n % slides.length) + slides.length) % slides.length)

  useEffect(() => {
    if (!slides || slides.length < 2) return
    const id = setInterval(() => setI((c) => (c + 1) % slides.length), interval)
    return () => clearInterval(id)
  }, [slides, interval])

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <div
      className="miami-hero-bg"
      aria-hidden="true"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((src, idx) => (
        <div
          key={src}
          className={`miami-hero-slide${idx === i ? ' is-current' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  )
}
