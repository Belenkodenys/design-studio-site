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

  // Mouse drag on desktop (touch already swipes natively via scroll-snap).
  const drag = useRef(null)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = ref.current
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false }
    el.style.scrollSnapType = 'none'
    el.style.cursor = 'grabbing'
    el.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    ref.current.scrollLeft = d.left - dx
  }
  const onPointerUp = (e) => {
    const d = drag.current
    if (!d) return
    drag.current = null
    const el = ref.current
    el.style.cursor = ''
    const w = el.clientWidth
    const dx = e.clientX - d.x
    let k = Math.round(d.left / w)
    if (dx < -w * 0.12) k += 1
    else if (dx > w * 0.12) k -= 1
    k = Math.max(0, Math.min(images.length - 1, k))
    el.scrollTo({ left: k * w, behavior: 'smooth' })
    setTimeout(() => { el.style.scrollSnapType = '' }, 450)
  }

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
      <div
        className="mol-swipe-track"
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
      >
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
