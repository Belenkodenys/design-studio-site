'use client'

import { useEffect } from 'react'
import './WorkDetail.css'

const CONTACT_EMAIL = 'studiobelenko@gmail.com'

export default function WorkDetail({ project }) {
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
  const cover = project.image || images[0]
  const rest = images.filter((src) => src !== cover)

  return (
    <main className="work">
      {/* Header */}
      <header className="work-header">
        <a href="/miami-hospitality-design" className="work-back" aria-label="Back to Belenko Miami">
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </a>
        <a className="work-back-link" href="/miami-hospitality-design#work">← Back to work</a>
      </header>

      {/* Cover */}
      <section className="work-cover">
        <img src={cover} alt={`${project.title} — ${project.category}, ${project.location}`} />
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
        <p className="work-description">{project.description}</p>
      </section>

      {/* Gallery */}
      <section className="work-gallery">
        {rest.map((src, i) => (
          <div className="work-shot" key={src + i}>
            <img src={src} alt={`${project.title} ${i + 2}`} loading="lazy" />
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="work-cta">
        <h2>Planning something similar in Miami?</h2>
        <p>Tell us about your space and concept — we reply within one business day.</p>
        <div className="work-cta-buttons">
          <a className="work-btn work-btn-light" href="/miami-hospitality-design#contact">Discuss Your Miami Project</a>
          <a className="work-btn work-btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </section>
    </main>
  )
}
