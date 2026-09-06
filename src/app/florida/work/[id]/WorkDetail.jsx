'use client'

import { useEffect, useState } from 'react'
import './WorkDetail.css'

const CONTACT_EMAIL = 'office@belenko.design'

export default function WorkDetail({ project, basePath = '/florida', marketLabel = 'Miami' }) {
  const [lb, setLb] = useState(null) // lightbox index, or null when closed

  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'en-US'
    return () => {
      document.documentElement.classList.remove('miami-bg')
      document.documentElement.lang = prevLang || 'en'
    }
  }, [])

  const images = Array.isArray(project.images) && project.images.length ? project.images : [project.image]
  // Big hero = first gallery shot that isn't the portfolio thumbnail (so the
  // page opens on an interior, not the same facade used on the card).
  const cover = images.find((src) => src !== project.image) || images[0]
  const rest = images.filter((src) => src !== cover)
  // Full ordered set for the fullscreen viewer: hero first, then the grid.
  const gallery = [cover, ...rest]

  const open = (i) => setLb(i)
  const close = () => setLb(null)
  const step = (d) => setLb((i) => (i === null ? i : (i + d + gallery.length) % gallery.length))

  useEffect(() => {
    if (lb === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lb])

  return (
    <main className="work">
      {/* Header */}
      <header className="work-header">
        <a href={basePath} className="work-back" aria-label={`Back to Belenko ${marketLabel}`}>
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </a>
        <a className="work-back-link" href={`${basePath}#work`}>← Back to work</a>
      </header>

      {/* Cover */}
      <section className="work-cover">
        <img
          src={cover}
          alt={`${project.title} — ${project.category}, ${project.location}`}
          className="work-cover-img"
          onClick={() => open(0)}
        />
        <div className="work-cover-scrim" aria-hidden="true" />
        <div className="work-cover-inner">
          <p className="work-eyebrow">{project.category} · {project.location}</p>
          <h1 className="work-title">{project.title}</h1>
        </div>
      </section>

      {/* Meta + description */}
      <section className="work-intro">
        <div className="work-meta">
          <div className="work-meta-item"><span>Type</span><strong>{project.category}</strong></div>
          <div className="work-meta-item"><span>Location</span><strong>{project.location}</strong></div>
          {project.year && <div className="work-meta-item"><span>Year</span><strong>{project.year}</strong></div>}
          {project.services?.length ? (
            <div className="work-meta-item"><span>Services</span><strong>{project.services.join(' · ')}</strong></div>
          ) : null}
        </div>
        <div className="work-description">
          {String(project.description || '').split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="work-gallery">
        {rest.map((src, i) => (
          <button type="button" className="work-shot" key={src + i} onClick={() => open(i + 1)} aria-label="Open image fullscreen">
            <img src={src} alt={`${project.title} ${i + 2}`} loading="lazy" />
          </button>
        ))}
      </section>

      {/* CTA */}
      <section className="work-cta">
        <h2>Planning something similar in {marketLabel}?</h2>
        <p>Tell us about your space and concept — we reply within one business day.</p>
        <div className="work-cta-buttons">
          <a className="work-btn work-btn-light" href={`${basePath}#contact`}>Discuss Your {marketLabel} Project</a>
          <a className="work-btn work-btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </section>

      {/* Fullscreen lightbox */}
      {lb !== null && (
        <div className="work-lightbox" onClick={close} role="dialog" aria-modal="true">
          <button type="button" className="work-lb-close" onClick={close} aria-label="Close">×</button>
          {gallery.length > 1 && (
            <button type="button" className="work-lb-nav work-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
          )}
          <img
            className="work-lb-img"
            src={gallery[lb]}
            alt={`${project.title} ${lb + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {gallery.length > 1 && (
            <button type="button" className="work-lb-nav work-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next">›</button>
          )}
          <span className="work-lb-count">{lb + 1} / {gallery.length}</span>
        </div>
      )}
    </main>
  )
}
