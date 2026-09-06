'use client'

import { useEffect, useRef, useState } from 'react'
import HeroSlideshow from '../miami-hospitality-design/HeroSlideshow'
import '../miami-hospitality-design/MiamiLanding.css'

const CONTACT_EMAIL = 'studio@belenko.design'
const CONTACT_PHONE = '+34 671 825 489'
const BASE = '/california-hospitality-design'
const HERO_SLIDES = [7, 8, 9, 10, 11, 12].map((n) => `/belenko-studio-hero-${n}.jpg`)

const proof = [
  { num: '25+', label: 'Years in hospitality' },
  { num: '200+', label: 'Completed projects' },
  { num: '11', label: 'Countries' }
]

const bigCases = [
  { id: 41, tag: 'U.S. project', name: 'Baker & Wife', place: 'Restaurant · Sarasota, FL', img: '/projects/baker-and-wife-sarasota-04.webp' },
  { id: 37, tag: 'Restaurant', name: 'Chou Chou', place: 'Luxury dining · Chișinău', img: '/projects/chou-chou-restaurant-chisinau-1.webp' },
  { id: 2, tag: 'Resort / Coastal', name: 'Sereia', place: 'Restaurant & Beach Club · Alaçatı', img: '/projects/sereia-restaurant-alachati-1.webp' },
  { id: 6, tag: 'Bar / Nightlife', name: 'Saint Bar', place: 'Bar & lounge · Kyiv', img: '/projects/saint-bar-kyiv-1.webp' }
]
const moreProjects = [
  { id: 1, name: 'Bella', place: 'Restaurant · Dnipro', img: '/projects/bella-restaurant-dnipro-1.webp' },
  { id: 32, name: 'Coco', place: 'Restaurant · Kyiv', img: '/projects/coco-japanese-restaurant-kyiv-7.webp' },
  { id: 3, name: 'Mamaliga', place: 'Restaurant · Odesa', img: '/projects/mamaliga-restaurant-odesa-1.webp' }
]

const services = [
  { h: 'Restaurant Interior Design in California', t: 'Concept-led interiors for restaurants — layouts, seating, materials and lighting that earn from every square foot.' },
  { h: 'Bar & Nightlife Design', t: 'Bars, lounges and nightlife venues built around energy, flow and a memorable signature moment.' },
  { h: 'Boutique Hotel & Resort Design', t: 'Lobbies, F&B and lifestyle hospitality spaces that give a property its character.' },
  { h: 'Hospitality Concept & Branding', t: 'Positioning, guest-journey scenario, naming and identity — the idea the venue runs on.' },
  { h: 'FF&E & Custom Furniture', t: 'Furniture, fixtures, equipment and decor specified and custom-made for the concept.' }
]

const whoWeWork = [
  { h: 'Restaurant Groups', t: 'New concepts, flagships and rollouts.' },
  { h: 'Independent Restaurateurs', t: 'Chef-driven and destination restaurants.' },
  { h: 'Hotel & Resort Developers', t: 'Boutique hotels, F&B and lifestyle hospitality.' },
  { h: 'Investors & Developers', t: 'Hospitality concepts built around commercial performance.' }
]

export default function CaliforniaLanding() {
  const [sent, setSent] = useState(false)
  const formStartedRef = useRef(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', venue: 'Restaurant', size: '', message: '' })

  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'en-US'
    return () => {
      document.documentElement.classList.remove('miami-bg')
      document.documentElement.lang = prevLang || 'en'
    }
  }, [])

  const track = (event, params = {}) => {
    try {
      if (typeof window !== 'undefined' && window.fbq) window.fbq('track', event, params)
      if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, params)
    } catch (_) {}
  }
  const scrollTo = (id) => (e) => {
    if (e) e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (!formStartedRef.current) { formStartedRef.current = true; track('InitiateCheckout', { content_name: 'California inquiry form' }) }
  }
  const onSubmit = (e) => {
    e.preventDefault()
    track('Lead', { content_name: 'California project inquiry', venue: form.venue })
    const subject = `California project — ${form.venue}`
    const body =
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
      `Project location: ${form.location}\nVenue type: ${form.venue}\nApprox. size: ${form.size}\n\n${form.message}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main className="miami">
      {/* Sticky header */}
      <header className="miami-header">
        <a href="#top" className="miami-header-logo" aria-label="Belenko" onClick={scrollTo('top')}>
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </a>
        <a className="miami-btn miami-btn-light miami-btn-sm" href="#contact" onClick={scrollTo('contact')}>Discuss Your Project</a>
      </header>

      {/* 1 — Hero */}
      <section className="miami-hero" id="top">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div className="miami-hero-scrim" aria-hidden="true" />
        <div className="miami-hero-inner">
          <p className="miami-eyebrow">California · West Coast</p>
          <h1 className="miami-hero-title">Hospitality design for restaurants, bars and boutique hotels in California</h1>
          <p className="miami-hero-sub">We create distinctive concepts people remember — and places they come back to.</p>
          <p className="miami-hero-trust">25+ years · 200+ projects · Europe + USA</p>
          <div className="miami-hero-cta">
            <a className="miami-btn miami-btn-light" href="#contact" onClick={scrollTo('contact')}>Discuss Your Project</a>
            <a className="miami-btn miami-btn-ghost" href="#work" onClick={scrollTo('work')}>View Selected Work</a>
          </div>
          <p className="miami-hero-note">European design perspective. Local California execution.</p>
        </div>
      </section>

      {/* 2 — U.S. experience: Baker & Wife */}
      <section className="miami-florida-case">
        <div className="miami-florida-case-media">
          <img src="/projects/baker-and-wife-sarasota-04.webp" alt="Baker & Wife — Sarasota, Florida" loading="lazy" />
        </div>
        <div className="miami-florida-case-copy">
          <p className="miami-kicker">Experience in the U.S.</p>
          <h2>Baker &amp; Wife — Sarasota, Florida</h2>
          <ul className="miami-facts">
            <li><span>Type</span><strong>Restaurant Interior Design</strong></li>
            <li><span>Location</span><strong>Sarasota, FL</strong></li>
            <li><span>Completed</span><strong>2015</strong></li>
            <li><span>Scope</span><strong>Concept · Interior Design · Décor</strong></li>
            <li><span>Status</span><strong>Built &amp; operating</strong></li>
          </ul>
          <a className="miami-btn miami-btn-dark" href={`${BASE}/work/41`}>View Case Study →</a>
        </div>
      </section>

      {/* 3 — Proof + press */}
      <section className="miami-proof">
        <div className="miami-proof-grid">
          {proof.map((p) => (
            <div className="miami-proof-item" key={p.label}>
              <span className="miami-proof-num">{p.num}</span>
              <span className="miami-proof-label">{p.label}</span>
            </div>
          ))}
        </div>
        <p className="miami-press-label">As seen in</p>
        <p className="miami-press">ArchDaily · Hospitality Snapshots</p>
      </section>

      {/* 4 — Why Belenko */}
      <section className="miami-why">
        <div className="miami-why-inner">
          <p className="miami-kicker light">Why Belenko</p>
          <h2 className="miami-why-head">We don&rsquo;t start with the interior.</h2>
          <p className="miami-why-text">
            We start with the reason the place should exist — who comes, why they choose it,
            what they feel, what they remember, and why they return. We don&rsquo;t design
            interiors; we design how the guest feels. Then we turn that idea into space,
            brand, furniture, lighting and every physical touchpoint.
          </p>
        </div>
      </section>

      {/* 5 — Major case studies */}
      <section className="miami-projects" id="work">
        <h2 className="miami-section-title">Selected work</h2>
        <div className="miami-cases-grid">
          {bigCases.map((p) => (
            <a className="miami-case" key={p.id} href={`${BASE}/work/${p.id}`}>
              <div className="miami-case-media"><img src={p.img} alt={`${p.name} — ${p.place}`} loading="lazy" /></div>
              <div className="miami-case-info">
                <span className="miami-case-tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <span className="miami-case-place">{p.place}</span>
              </div>
            </a>
          ))}
        </div>
        <div className="miami-more-grid">
          {moreProjects.map((p) => (
            <a className="miami-more" key={p.id} href={`${BASE}/work/${p.id}`}>
              <div className="miami-more-media"><img src={p.img} alt={`${p.name} — ${p.place}`} loading="lazy" /></div>
              <span className="miami-more-name">{p.name}</span>
              <span className="miami-more-place">{p.place}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 6 — Business performance */}
      <section className="miami-biz">
        <div className="miami-biz-inner">
          <p className="miami-kicker light">Design that works as a business</p>
          <h2 className="miami-biz-head">Beautiful isn&rsquo;t enough.</h2>
          <p className="miami-biz-text">
            We design around guest flow, seat count, dwell time, operational efficiency and
            long-term durability — so the space performs as well as it looks.
          </p>
          <div className="miami-biz-metrics">
            <div><span className="n">203 seats / 3,830 sq ft</span><span className="l">Planned for efficient guest &amp; staff circulation — Mamaliga</span></div>
            <div><span className="n">Guest flow first</span><span className="l">Layouts that earn from every square foot</span></div>
            <div><span className="n">Built to last</span><span className="l">Materials and detailing that age well in daily service</span></div>
          </div>
        </div>
      </section>

      {/* 7 — Services (SEO H2s) */}
      <section className="miami-services" id="services">
        <h2 className="miami-section-title">What we do</h2>
        <div className="miami-services-list">
          {services.map((s) => (
            <article className="miami-service" key={s.h}>
              <h3>{s.h}</h3>
              <p>{s.t}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8 — California delivery */}
      <section className="miami-delivery">
        <div className="miami-delivery-inner">
          <p className="miami-kicker light">How California delivery works</p>
          <h2 className="miami-delivery-head">Designed internationally. Delivered locally.</h2>
          <div className="miami-flow">
            <div className="miami-flow-step">
              <span className="miami-flow-role">Belenko</span>
              <p>Concept → brand → interior → FF&amp;E → creative direction</p>
            </div>
            <div className="miami-flow-arrow" aria-hidden="true">↓</div>
            <div className="miami-flow-step">
              <span className="miami-flow-role">California Architect of Record</span>
              <p>Permit drawings → California Building Code → Title 24 → ADA → coordination</p>
            </div>
            <div className="miami-flow-arrow" aria-hidden="true">↓</div>
            <div className="miami-flow-step">
              <span className="miami-flow-role">Local GC + Engineers</span>
              <p>MEP → construction → inspections → opening</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 — Founder */}
      <section className="miami-founder">
        <div className="miami-founder-media"><img src="/denis-belenko.jpg" alt="Denys Belenko — Founder & Creative Director" loading="lazy" /></div>
        <div className="miami-founder-copy">
          <p className="miami-kicker">Denys Belenko</p>
          <h2>Founder &amp; Creative Director</h2>
          <p>
            25+ years creating restaurants, bars and hospitality destinations across Europe
            and internationally, with 200+ completed projects. Denys personally leads the
            creative direction of every Belenko hospitality project.
          </p>
          <a className="miami-btn miami-btn-dark" href="#contact" onClick={scrollTo('contact')}>Talk to Denys Belenko</a>
        </div>
      </section>

      {/* 10 — Who we work with */}
      <section className="miami-who">
        <h2 className="miami-section-title">Who we work with</h2>
        <div className="miami-who-grid">
          {whoWeWork.map((w) => (
            <article className="miami-who-item" key={w.h}>
              <h3>{w.h}</h3>
              <p>{w.t}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 11 — Contact */}
      <section className="miami-contact" id="contact">
        <div className="miami-contact-inner">
          <div className="miami-contact-copy">
            <h2 className="miami-section-title light">Talk to Denys Belenko</h2>
            <p className="miami-contact-sub">Tell us about your project. We review every inquiry personally and respond within one business day.</p>
            <div className="miami-contact-lines">
              <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => track('Contact', { method: 'email' })}>{CONTACT_EMAIL}</a>
            </div>
          </div>

          <form className="miami-form" onSubmit={onSubmit}>
            <label><span>Name</span><input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" /></label>
            <div className="miami-form-row">
              <label><span>Email</span><input type="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" /></label>
              <label><span>Phone</span><input type="tel" value={form.phone} onChange={update('phone')} placeholder="+1 …" /></label>
            </div>
            <div className="miami-form-row">
              <label><span>Project location</span><input type="text" value={form.location} onChange={update('location')} placeholder="Los Angeles, CA" /></label>
              <label><span>Venue type</span>
                <select value={form.venue} onChange={update('venue')}>
                  <option>Restaurant</option><option>Bar / Lounge</option><option>Hotel</option><option>Other</option>
                </select>
              </label>
            </div>
            <label><span>Approx. project size</span><input type="text" value={form.size} onChange={update('size')} placeholder="e.g. 4,000 sq ft / 120 seats" /></label>
            <label><span>Tell us about your project</span><textarea rows={4} value={form.message} onChange={update('message')} placeholder="Concept, timeline, location…" /></label>
            <button type="submit" className="miami-btn miami-btn-light miami-form-submit">{sent ? 'Opening your email…' : 'Discuss Your Project'}</button>
          </form>
        </div>
        <p className="miami-copyright">© 2026 Belenko Design Studio · Barcelona · Serving California &amp; the West Coast · <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a></p>
      </section>
    </main>
  )
}
