'use client'

import { useEffect, useRef, useState } from 'react'

// Wraps a block (usually an image) that flies in from `from` (left | right |
// top | bottom) when it scrolls into view. Plays once, then stays.
export default function FlyIn({ from = 'left', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`fly fly--${from}${on ? ' is-in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
