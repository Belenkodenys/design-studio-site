'use client'
import { useEffect, useRef, useState } from 'react'

// Horizontal gallery: native touch swipe (scroll-snap), arrows + keys on desktop.
export default function SwipeGallery({ images, className = '' }) {
  const ref = useRef(null)
  const [i, setI] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => setI(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const go = (n) => {
    const el = ref.current
    if (!el) return
    const k = (n + images.length) % images.length
    el.scrollTo({ left: k * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div
      className={`mol-swipe ${className}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <div className="mol-swipe-track" ref={ref}>
        {images.map((im, k) => (
          <figure className="mol-swipe-slide" key={im.src}>
            <img
              src={im.src}
              srcSet={im.srcSet}
              sizes="100vw"
              alt={im.alt || ''}
              loading={k === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </figure>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button type="button" className="mol-swipe-btn prev" aria-label="Предыдущее" onClick={() => go(i - 1)}>←</button>
          <button type="button" className="mol-swipe-btn next" aria-label="Следующее" onClick={() => go(i + 1)}>→</button>
          <div className="mol-swipe-dots">
            {images.map((_, k) => (
              <button type="button" key={k} className={k === i ? 'on' : ''} aria-label={`Слайд ${k + 1}`} onClick={() => go(k)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
