'use client'

import { useEffect } from 'react'
import './MiamiLanding.css'

const CONTACT_EMAIL = 'studiobelenko@gmail.com'
const CONTACT_PHONE = '+34 671 825 489'
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Miami project — Belenko Design')}`

const services = [
  { title: 'Concept + Positioning', text: 'The scenario the kitchen, service, and atmosphere will follow.' },
  { title: 'Architecture', text: 'The mathematics of hospitality: layouts, engineering, permits.' },
  { title: 'Interior Design', text: 'Atmosphere and details built around the legend of the place.' },
  { title: 'Decor + Furniture', text: 'Custom furniture and decor tailored to each project.' },
  { title: 'Branding + Graphic Design', text: 'Identity tied to the interior and positioning.' },
  { title: 'Author Supervision', text: 'On-site supervision — so what was designed actually happens.' }
]

const stats = [
  { num: '25', label: 'Years of experience' },
  { num: '200+', label: 'Projects delivered' },
  { num: '11', label: 'Countries' },
  { num: '50,000 m²', label: 'Of designed atmosphere' }
]

export default function MiamiLanding() {
  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    return () => document.documentElement.classList.remove('miami-bg')
  }, [])

  return (
    <main className="miami">
      {/* Hero */}
      <header className="miami-hero">
        <div className="miami-hero-bg" aria-hidden="true" />
        <div className="miami-hero-scrim" aria-hidden="true" />
        <div className="miami-hero-inner">
          <p className="miami-eyebrow">Belenko — Barcelona · Worldwide</p>
          <h1 className="miami-hero-title">
            Hospitality interiors<br />Miami won&rsquo;t forget
          </h1>
          <p className="miami-hero-sub">
            An award-winning, Barcelona-based design studio bringing world-class
            restaurant, bar, and hotel concepts to Miami — where interior, brand,
            and guest experience make people fall in love and come back.
          </p>
          <div className="miami-hero-cta">
            <a className="miami-btn miami-btn-primary" href={MAILTO}>Start a project</a>
            <a className="miami-btn miami-btn-ghost" href="#work">See the approach</a>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="miami-intro" id="work">
        <h2 className="miami-section-title">From Barcelona to Biscayne Bay</h2>
        <p className="miami-lead">
          We don&rsquo;t design interiors — we design how the guest feels. Through
          guest-journey design we craft venues that stand out from the standard,
          balancing an authorial voice with commercial results. Now bringing that
          practice to Miami&rsquo;s hospitality market.
        </p>
      </section>

      {/* Services */}
      <section className="miami-services">
        <div className="miami-services-grid">
          {services.map((s) => (
            <article className="miami-service" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="miami-stats">
        {stats.map((s) => (
          <div className="miami-stat" key={s.label}>
            <span className="miami-stat-num">{s.num}</span>
            <span className="miami-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Contact */}
      <section className="miami-contact" id="contact">
        <h2 className="miami-section-title light">Let&rsquo;s build something Miami remembers</h2>
        <p className="miami-contact-sub">Tell us about your space, your concept, or your opening date.</p>
        <a className="miami-btn miami-btn-primary" href={MAILTO}>Start a project</a>
        <div className="miami-contact-lines">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span className="miami-dot">·</span>
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a>
        </div>
        <p className="miami-copyright">© {new Date().getFullYear()} Belenko Design Studio</p>
      </section>
    </main>
  )
}
