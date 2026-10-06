'use client'

import { useEffect, useRef, useState } from 'react'
import './Gallery.css'

// Replace this list with the gallery photos (put files in /public and list
// their paths here). Seeded with studio photos so the page works immediately.
const PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => `/belenko-studio-hero-${n}.jpg`)

export default function GalleryClient() {
  const [lb, setLb] = useState(null) // fullscreen index or null
  const startX = useRef(null)
  const startY = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('gallery-bg')
    return () => document.documentElement.classList.remove('gallery-bg')
  }, [])

  const open = (i) => setLb(i)
  const close = () => setLb(null)
  const step = (d) => setLb((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length))

  useEffect(() => {
    if (lb === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lb])

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY }
  const onTouchEnd = (e) => {
    if (startX.current == null) return
    const dx = e.changedTouches[0].clientX - startX.current
    const dy = e.changedTouches[0].clientY - startY.current
    if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) { close() }
    else if (Math.abs(dx) > 45) { step(dx < 0 ? 1 : -1) }
    startX.current = null; startY.current = null
  }

  return (
    <main className="gallery">
      <header className="gallery-head">
        <span className="gallery-mark">BELENKO</span>
        <span className="gallery-sub">Gallery</span>
      </header>

      <div className="gallery-feed">
        {PHOTOS.map((src, i) => (
          <button type="button" className="gallery-cell" key={src + i} onClick={() => open(i)} aria-label={`Open photo ${i + 1}`}>
            <img src={src} alt="" loading="lazy" draggable={false} />
          </button>
        ))}
      </div>

      {lb !== null && (
        <div
          className="gallery-lightbox"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" className="gallery-lb-close" onClick={close} aria-label="Close">×</button>
          <img className="gallery-lb-img" src={PHOTOS[lb]} alt="" onClick={(e) => e.stopPropagation()} draggable={false} />
          <button type="button" className="gallery-lb-nav gallery-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
          <button type="button" className="gallery-lb-nav gallery-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next">›</button>
          <span className="gallery-lb-count">{lb + 1} / {PHOTOS.length}</span>
        </div>
      )}
    </main>
  )
}
