'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { sections } from '../sections'
import ProposalFooter from '../ProposalFooter'
import { projects } from '../../../../data/projects'
import './SectionDetail.css'

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function TypewriterText({ text, className }) {
  const ref = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const tickRafRef = useRef(null)
  const [revealed, setRevealed] = useState(0)
  const chars = Array.from(text || '')

  useEffect(() => {
    targetRef.current = 0
    currentRef.current = 0
    setRevealed(0)
  }, [text])

  useEffect(() => {
    if (!ref.current) return
    const total = chars.length

    const updateTarget = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 2.0
      const end = vh * 0.15
      const denom = Math.max(1, start - end)
      let progress = (start - rect.top) / denom
      progress = Math.max(0, Math.min(1, progress))
      const newTarget = progress * total
      if (newTarget > targetRef.current) targetRef.current = newTarget
    }

    // Constant-speed reveal: ~70 characters per second, no matter how fast
    // the user scrolls. The scroll only updates the *target*; the actual
    // revealed count chases the target at a steady pace so each letter is
    // visible to the eye.
    const SPEED = 110
    let lastTime = null
    const tick = (t) => {
      if (lastTime === null) lastTime = t
      const dt = (t - lastTime) / 1000
      lastTime = t
      const diff = targetRef.current - currentRef.current
      if (diff > 0) {
        currentRef.current = Math.min(
          targetRef.current,
          currentRef.current + SPEED * dt
        )
        const next = Math.floor(currentRef.current)
        setRevealed((prev) => (next !== prev ? next : prev))
      }
      tickRafRef.current = requestAnimationFrame(tick)
    }

    const onScroll = () => updateTarget()

    updateTarget()
    tickRafRef.current = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (tickRafRef.current) cancelAnimationFrame(tickRafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars.length])

  return (
    <span ref={ref} className={className}>
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden={i >= revealed}
          style={{ opacity: i < revealed ? 1 : 0 }}
        >
          {c}
        </span>
      ))}
    </span>
  )
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 17V12.5C20 10.567 18.433 9 16.5 9H5M5 9L10 4M5 9L10 14"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SectionDetail({ section }) {
  const currentIdx = sections.findIndex((s) => s.slug === section.slug)
  const prev = sections[currentIdx - 1]
  const next = sections[currentIdx + 1]

  const mainRef = useRef(null)
  const brandRef = useRef(null)
  const bottomImgRef = useRef(null)
  const galleryTrackRef = useRef(null)
  const [bottomImgVisible, setBottomImgVisible] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useIsoLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [section.slug])

  useEffect(() => {
    // iOS Safari sometimes restores scroll AFTER the layout effect; reassert
    const id = requestAnimationFrame(() => window.scrollTo(0, 0))
    const t = setTimeout(() => window.scrollTo(0, 0), 60)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(t)
    }
  }, [section.slug])

  useEffect(() => {
    document.documentElement.classList.add('section-detail-snap')
    document.documentElement.classList.add('client-proposal-bg')
    return () => {
      document.documentElement.classList.remove('section-detail-snap')
      document.documentElement.classList.remove('client-proposal-bg')
    }
  }, [])

  useEffect(() => {
    const track = galleryTrackRef.current
    if (!track || !section.gallery || section.gallery.length === 0) return

    const findCurrentIdx = () => {
      const items = Array.from(track.children)
      const center = track.scrollLeft + track.clientWidth / 2
      let idx = 0
      let minDist = Infinity
      items.forEach((item, i) => {
        const c = item.offsetLeft + item.offsetWidth / 2
        const d = Math.abs(c - center)
        if (d < minDist) { minDist = d; idx = i }
      })
      return idx
    }

    const scrollToItem = (item, smooth = true) => {
      if (!item) return
      item.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'center'
      })
    }

    // Initial position: middle copy
    const setInitial = () => {
      const items = Array.from(track.children)
      if (items.length === 0) return
      const middleIdx = Math.floor(items.length / 3)
      scrollToItem(items[middleIdx], false)
    }
    setInitial()

    // Infinite loop: when scroll crosses 1st/3rd cycle boundary, jump silently
    let resetting = false
    const onScroll = () => {
      if (resetting) return
      const total = track.scrollWidth
      const cycle = total / 3
      const sl = track.scrollLeft
      if (sl < cycle * 0.5 || sl > cycle * 2.5) {
        resetting = true
        track.style.scrollBehavior = 'auto'
        track.scrollLeft = sl < cycle * 0.5 ? sl + cycle : sl - cycle
        requestAnimationFrame(() => {
          track.style.scrollBehavior = ''
          resetting = false
        })
      }
    }

    // Drag-to-swipe (mouse only — touch is handled by native scroll for smoothness)
    let isDown = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onHover = (e) => {
      const rect = track.getBoundingClientRect()
      const x = e.clientX - rect.left
      track.dataset.side = x < rect.width / 2 ? 'left' : 'right'
    }
    const onLeave = () => {
      delete track.dataset.side
    }

    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return
      isDown = true
      moved = false
      startX = e.pageX
      startScroll = track.scrollLeft
      track.classList.add('is-grabbing')
    }
    const onMove = (e) => {
      if (!isDown || e.pointerType !== 'mouse') return
      const dx = e.pageX - startX
      if (Math.abs(dx) > 4) moved = true
      track.scrollLeft = startScroll - dx
    }
    const onUp = () => {
      if (!isDown) return
      isDown = false
      track.classList.remove('is-grabbing')
      if (moved) {
        const items = Array.from(track.children)
        scrollToItem(items[findCurrentIdx()])
      }
    }

    // Click / tap (mouse click or touch tap) — left half = prev, right half = next
    const onClick = (e) => {
      const items = Array.from(track.children)
      const currentIdx = findCurrentIdx()
      const mid = window.innerWidth / 2
      if (e.clientX >= mid) {
        const next = items[Math.min(items.length - 1, currentIdx + 1)]
        scrollToItem(next)
      } else {
        const prev = items[Math.max(0, currentIdx - 1)]
        scrollToItem(prev)
      }
    }

    track.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    track.addEventListener('click', onClick)
    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('mousemove', onHover)
    track.addEventListener('mouseleave', onLeave)

    return () => {
      track.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      track.removeEventListener('click', onClick)
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('mousemove', onHover)
      track.removeEventListener('mouseleave', onLeave)
    }
  }, [section.slug, section.gallery])

  useEffect(() => {
    if (!bottomImgRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setBottomImgVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(bottomImgRef.current)
    return () => observer.disconnect()
  }, [section.slug])

  useEffect(() => {
    if (!mainRef.current || !brandRef.current) return
    const update = () => {
      if (!brandRef.current || !mainRef.current) return
      mainRef.current.style.setProperty(
        '--brand-h',
        `${brandRef.current.offsetHeight}px`
      )
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(brandRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <main ref={mainRef} className="section-detail">
      <Link
        ref={brandRef}
        href="/clients/proposal"
        className="section-detail-brand"
        aria-label="Back to sections"
      >
        <div className="section-detail-brand-belenko">BELENKO</div>
        <div className="section-detail-brand-studio">STUDIO</div>
      </Link>

      <header className="section-detail-topbar">
        <Link href="/clients/proposal" className="section-detail-back">
          <BackIcon />
          <span>Sections</span>
        </Link>
        <div className="section-detail-counter">
          {String(currentIdx + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
        </div>
      </header>

      <section className="section-detail-hero">
        <div className="section-detail-num">
          {String(currentIdx + 1).padStart(2, '0')}
        </div>
        <h1 className="section-detail-title">{section.title}</h1>
        <p className="section-detail-lead">{section.body}</p>
      </section>

      <section className="section-detail-body">
        <p className="section-detail-long">
          <TypewriterText text={section.longDescription} />
        </p>

        {section.bullets && section.bullets.length > 0 && (
          <ul className="section-detail-bullets">
            {section.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </section>

      {section.slug === 'cases' ? (
        <section className="section-detail-cases">
          <div className="section-detail-cases-grid">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="section-detail-cases-card"
              >
                {project.image && (
                  <div className="section-detail-cases-card-img">
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>
                )}
                <div className="section-detail-cases-card-info">
                  <h3>{project.title}</h3>
                  <span>
                    {project.category}
                    {project.location ? ` · ${project.location}` : ''}
                    {project.year ? ` · ${project.year}` : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : section.gallery && section.gallery.length > 0 ? (
        <section className="section-detail-gallery">
          <div
            ref={galleryTrackRef}
            className="section-detail-gallery-track"
          >
            {/* Tripled for infinite-loop carousel */}
            {[
              ...section.gallery,
              ...section.gallery,
              ...section.gallery
            ].map((img, i) => (
              <figure key={i} className="section-detail-gallery-item">
                <img src={img.src} alt={img.alt || ''} />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-detail-gallery-placeholder">
          <div className="section-detail-gallery-empty">
            <span>Gallery</span>
            <small>Images and projects for this section</small>
          </div>
        </section>
      )}

      <nav className="section-detail-pagination">
        {prev ? (
          <Link
            href={`/clients/proposal/${prev.slug}`}
            className="section-detail-prev"
          >
            <span className="section-detail-paginate-label">← Previous</span>
            <span className="section-detail-paginate-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/clients/proposal/${next.slug}`}
            className="section-detail-next"
          >
            <span className="section-detail-paginate-label">Next →</span>
            <span className="section-detail-paginate-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <div className="section-detail-back-wrap">
        <Link href="/clients/proposal" className="section-detail-back-bottom">
          ← Back to sections
        </Link>
      </div>

      {section.bottomImage && (
        <div
          ref={bottomImgRef}
          className={`section-detail-bottom-image ${
            bottomImgVisible ? 'is-visible' : ''
          }`}
          aria-hidden="true"
        >
          <img src={section.bottomImage} alt="" />
        </div>
      )}

      <ProposalFooter />
    </main>
  )
}
