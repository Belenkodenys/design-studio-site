'use client'

import { useEffect, useState } from 'react'
import './MiamiLanding.css'

const CONTACT_EMAIL = 'studiobelenko@gmail.com'
const CONTACT_PHONE = '+34 671 825 489'

const advantages = [
  {
    title: 'Guest-journey design',
    text: 'We don’t just decorate rooms. We design how a guest feels from the door to the last drink — the reason people come back.'
  },
  {
    title: 'End-to-end, concept to opening',
    text: 'One team from positioning and architecture to interior, brand, and on-site supervision. Fewer vendors, fewer surprises.'
  },
  {
    title: 'Florida Architect of Record',
    text: 'We coordinate with a Florida-licensed Architect of Record for permitting and code compliance — design ambition, local legality.'
  },
  {
    title: 'International standard',
    text: 'Barcelona-based studio, 25 years, 200+ venues across 11 countries. Now bringing that bar to Miami hospitality.'
  }
]

const projects = [
  { name: 'Pixi', place: 'Restaurant & Bar — Istanbul', scope: 'Architecture · Interior · Lighting', img: '/projects/pixi-restaurant-istanbul-1.webp' },
  { name: 'Cent Aura', place: 'Restaurant — Lviv', scope: 'Concept · Architecture · Interior', img: '/projects/cent-aura-restaurant-lviv-1.webp' },
  { name: 'Chou Chou', place: 'French Brasserie — Chișinău', scope: 'Concept · Interior · Lighting', img: '/projects/chou-chou-restaurant-chisinau-1.webp' },
  { name: 'Coco', place: 'Japanese Restaurant — Kyiv', scope: 'Concept · Interior · Decor', img: '/projects/coco-japanese-restaurant-kyiv-7.webp' }
]

const directions = [
  { title: 'Concept & Strategy', text: 'Positioning, guest-journey scenario, naming — the idea the whole venue runs on.' },
  { title: 'Architecture & Documentation', text: 'Layouts, engineering and permit sets, coordinated with a Florida-licensed Architect of Record.' },
  { title: 'Interior & Decor', text: 'Interior design, custom furniture, lighting and decor tailored to the concept.' },
  { title: 'Brand & Content', text: 'Identity, graphic design and visual content in one language with the space.' }
]

const stats = [
  { num: '25', label: 'Years of experience' },
  { num: '200+', label: 'Venues delivered' },
  { num: '11', label: 'Countries' },
  { num: '50,000 m²', label: 'Of designed atmosphere' }
]

export default function MiamiLanding() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', venue: 'Restaurant', message: '' })

  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'en-US'
    return () => {
      document.documentElement.classList.remove('miami-bg')
      document.documentElement.lang = prevLang || 'en'
    }
  }, [])

  const scrollToContact = (e) => {
    if (e) e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Miami project — ${form.venue}`
    const body =
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Venue type: ${form.venue}\n\n` +
      `${form.message}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main className="miami">
      {/* Sticky header with a prominent CTA */}
      <header className="miami-header">
        <a href="#top" className="miami-header-logo" aria-label="Belenko">
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </a>
        <div className="miami-header-right">
          <a className="miami-header-phone" href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a>
          <a className="miami-btn miami-btn-primary miami-btn-sm" href="#contact" onClick={scrollToContact}>Book a call</a>
        </div>
      </header>

      {/* Hero */}
      <section className="miami-hero" id="top">
        <div className="miami-hero-bg" aria-hidden="true" />
        <div className="miami-hero-scrim" aria-hidden="true" />
        <div className="miami-hero-inner">
          <p className="miami-eyebrow">Barcelona-based · Now in Miami</p>
          <h1 className="miami-hero-title">Miami Hospitality Interior Design</h1>
          <p className="miami-hero-sub">
            Restaurants, bars, hotels and clubs designed to make guests fall in love —
            and come back. Full-service, from concept to opening, coordinated with a
            Florida-licensed Architect of Record.
          </p>
          <div className="miami-hero-cta">
            <a className="miami-btn miami-btn-primary" href="#contact" onClick={scrollToContact}>Start a project</a>
            <a className="miami-btn miami-btn-ghost" href="#projects">See projects</a>
          </div>
          <p className="miami-hero-trust">25 years · 200+ venues · 11 countries</p>
        </div>
      </section>

      {/* Advantages — right after the fold */}
      <section className="miami-advantages" id="why">
        <div className="miami-advantages-grid">
          {advantages.map((a) => (
            <article className="miami-advantage" key={a.title}>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Selected projects */}
      <section className="miami-projects" id="projects">
        <h2 className="miami-section-title">Selected work</h2>
        <div className="miami-projects-grid">
          {projects.map((p) => (
            <article className="miami-project" key={p.name}>
              <div className="miami-project-media">
                <img src={p.img} alt={`${p.name} — ${p.place}`} loading="lazy" />
              </div>
              <div className="miami-project-info">
                <h3>{p.name}</h3>
                <span className="miami-project-place">{p.place}</span>
                <span className="miami-project-scope">{p.scope}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Four clear directions */}
      <section className="miami-directions" id="services">
        <h2 className="miami-section-title">What we do</h2>
        <div className="miami-directions-grid">
          {directions.map((d, i) => (
            <article className="miami-direction" key={d.title}>
              <span className="miami-direction-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
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

      {/* Contact form */}
      <section className="miami-contact" id="contact">
        <div className="miami-contact-inner">
          <div className="miami-contact-copy">
            <h2 className="miami-section-title light">Let&rsquo;s build something Miami remembers</h2>
            <p className="miami-contact-sub">
              Tell us about your space, concept, or opening date. We reply within one business day.
            </p>
            <div className="miami-contact-lines">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <span className="miami-dot">·</span>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a>
            </div>
          </div>

          <form className="miami-form" onSubmit={onSubmit}>
            <label>
              <span>Name</span>
              <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" />
            </label>
            <label>
              <span>Venue type</span>
              <select value={form.venue} onChange={update('venue')}>
                <option>Restaurant</option>
                <option>Bar / Lounge</option>
                <option>Hotel</option>
                <option>Café</option>
                <option>Club</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              <span>Project details</span>
              <textarea rows={4} value={form.message} onChange={update('message')} placeholder="Location, size, timeline, budget range…" />
            </label>
            <button type="submit" className="miami-btn miami-btn-primary miami-form-submit">
              {sent ? 'Opening your email…' : 'Send request'}
            </button>
          </form>
        </div>
        <p className="miami-copyright">© 2026 Belenko Design Studio · Barcelona · Miami</p>
      </section>
    </main>
  )
}
