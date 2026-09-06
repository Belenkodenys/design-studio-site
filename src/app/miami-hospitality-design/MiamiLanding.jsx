'use client'

import { useEffect, useRef, useState } from 'react'
import './MiamiLanding.css'

const CONTACT_EMAIL = 'studiobelenko@gmail.com'
const CONTACT_PHONE = '+34 671 825 489'

const proof = [
  { num: '25+', label: 'Years in hospitality' },
  { num: '200+', label: 'Completed projects' },
  { num: '28', label: 'Multidisciplinary team' },
  { num: '11', label: 'Countries' }
]

// Ordered for a restaurant/hospitality Miami audience.
const projects = [
  { id: 41, name: 'Baker & Wife', place: 'Restaurant · Sarasota, FL', note: 'Eclectic neighborhood dining', img: '/projects/baker-and-wife-sarasota-07.webp' },
  { id: 2, name: 'Sereia', place: 'Restaurant & Beach Club · Alaçatı', note: 'Open-air, coastal', img: '/projects/sereia-restaurant-alachati-1.webp' },
  { id: 37, name: 'Chou Chou', place: 'Restaurant · Chișinău', note: 'Luxury French dining', img: '/projects/chou-chou-restaurant-chisinau-1.webp' },
  { id: 1, name: 'Bella', place: 'Restaurant · Dnipro', note: 'Rich European character', img: '/projects/bella-restaurant-dnipro-1.webp' },
  { id: 32, name: 'Coco', place: 'Restaurant · Kyiv', note: 'Immersive Japanese concept', img: '/projects/coco-japanese-restaurant-kyiv-7.webp' },
  { id: 6, name: 'Saint Bar', place: 'Bar · Kyiv', note: 'Nightlife & lounge', img: '/projects/saint-bar-kyiv-1.webp' },
  { id: 3, name: 'Mamaliga', place: 'Restaurant · Odesa · 3,830 sq ft · 203 seats', note: 'Bessarabian craftsmanship', img: '/projects/mamaliga-restaurant-odesa-1.webp' }
]

const coreServices = [
  { title: 'Hospitality Concept & Brand', text: 'Positioning, guest-journey scenario, naming and identity — the idea the venue runs on.' },
  { title: 'Interior Design & Space Planning', text: 'Layouts, seating, materials and lighting that earn from every square foot.' },
  { title: 'FF&E, Custom Furniture & Styling', text: 'Furniture, fixtures, equipment and decor specified and custom-made for the concept.' },
  { title: 'Construction Administration with Local Partners', text: 'Design intent protected on site, coordinated with your local contractors and consultants.' }
]

const addServices = ['Menu & F&B design', 'Event & launch concepts', 'Staff uniforms', 'Visual content & advertising']

const serviceOptions = ['Concept & Brand', 'Interior Design', 'FF&E & Furniture', 'Construction Admin']

export default function MiamiLanding() {
  const [sent, setSent] = useState(false)
  const formStartedRef = useRef(false)
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', location: '',
    venue: 'Restaurant', stage: 'New venue', area: '', opening: '', budget: '',
    brief: '', message: '', services: {}
  })

  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'en-US'
    return () => {
      document.documentElement.classList.remove('miami-bg')
      document.documentElement.lang = prevLang || 'en'
    }
  }, [])

  // Fire conversion events to Meta Pixel / GA4 when available (no-op otherwise).
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
    if (!formStartedRef.current) {
      formStartedRef.current = true
      track('InitiateCheckout', { content_name: 'Miami inquiry form' })
    }
  }
  const toggleService = (s) => (e) =>
    setForm((f) => ({ ...f, services: { ...f.services, [s]: e.target.checked } }))

  const onSubmit = (e) => {
    e.preventDefault()
    track('Lead', { content_name: 'Miami project inquiry', venue: form.venue })
    const picked = Object.keys(form.services).filter((k) => form.services[k])
    const subject = `Miami project — ${form.venue}${form.company ? ' · ' + form.company : ''}`
    const body =
      `Name: ${form.name}\nCompany: ${form.company}\n` +
      `Email: ${form.email}\nPhone: ${form.phone}\n` +
      `Project location: ${form.location}\n` +
      `Venue type: ${form.venue}\nStage: ${form.stage}\n` +
      `Approx. area (sq ft): ${form.area}\nTarget opening: ${form.opening}\n` +
      `Estimated budget (USD): ${form.budget}\n` +
      `Required services: ${picked.join(', ')}\n` +
      `Brief / floor plan link: ${form.brief}\n\n${form.message}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main className="miami">
      {/* Sticky header with a prominent CTA */}
      <header className="miami-header">
        <a href="#top" className="miami-header-logo" aria-label="Belenko" onClick={scrollTo('top')}>
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </a>
        <div className="miami-header-right">
          <a className="miami-header-phone" href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} onClick={() => track('Contact', { method: 'phone' })}>{CONTACT_PHONE}</a>
          <a className="miami-btn miami-btn-light miami-btn-sm" href="#contact" onClick={scrollTo('contact')}>Discuss Your Miami Project</a>
        </div>
      </header>

      {/* Hero */}
      <section className="miami-hero" id="top">
        <div className="miami-hero-bg" aria-hidden="true" />
        <div className="miami-hero-scrim" aria-hidden="true" />
        <div className="miami-hero-inner">
          <p className="miami-eyebrow">Miami · South Florida · International</p>
          <h1 className="miami-hero-title">Hospitality interiors people come back for</h1>
          <p className="miami-hero-sub">
            Award-winning European studio designing distinctive restaurants, bars and
            boutique hotels through concept, interior design, branding and FF&amp;E.
          </p>
          <p className="miami-hero-trust">25+ years · 200+ projects · 11 countries</p>
          <div className="miami-hero-cta">
            <a className="miami-btn miami-btn-light" href="#contact" onClick={scrollTo('contact')}>Discuss Your Miami Project</a>
            <a className="miami-btn miami-btn-ghost" href="#work" onClick={scrollTo('work')}>View Selected Work</a>
          </div>
          <p className="miami-hero-note">Barcelona-based, working internationally and in Miami &amp; South Florida.</p>
        </div>
      </section>

      {/* Proof bar */}
      <section className="miami-proof">
        <div className="miami-proof-grid">
          {proof.map((p) => (
            <div className="miami-proof-item" key={p.label}>
              <span className="miami-proof-num">{p.num}</span>
              <span className="miami-proof-label">{p.label}</span>
            </div>
          ))}
        </div>
        <p className="miami-press">Independently covered by ArchDaily &amp; Hospitality Snapshots</p>
      </section>

      {/* Selected work */}
      <section className="miami-projects" id="work">
        <h2 className="miami-section-title">Selected work</h2>
        <div className="miami-projects-grid">
          {projects.map((p) => (
            <a className="miami-project" key={p.name} href={`/miami-hospitality-design/work/${p.id}`}>
              <div className="miami-project-media">
                <img src={p.img} alt={`${p.name} — ${p.place}`} loading="lazy" />
              </div>
              <div className="miami-project-info">
                <h3>{p.name}</h3>
                <span className="miami-project-place">{p.place}</span>
                <span className="miami-project-note">{p.note}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Core services (4) */}
      <section className="miami-directions" id="services">
        <h2 className="miami-section-title">What we do</h2>
        <div className="miami-directions-grid">
          {coreServices.map((d, i) => (
            <article className="miami-direction" key={d.title}>
              <span className="miami-direction-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </article>
          ))}
        </div>
        <p className="miami-add-services">
          <span>Also available:</span> {addServices.join(' · ')}
        </p>
      </section>

      {/* How we work in Florida */}
      <section className="miami-florida">
        <div className="miami-florida-inner">
          <h2 className="miami-section-title light">How we work in Florida</h2>
          <p className="miami-florida-text">
            We lead the concept, interior design, brand experience and FF&amp;E, while
            coordinating permit documentation with a Florida-licensed Architect of Record
            and local engineering consultants — design ambition, local legality.
          </p>
        </div>
      </section>

      {/* Contact form */}
      <section className="miami-contact" id="contact">
        <div className="miami-contact-inner">
          <div className="miami-contact-copy">
            <h2 className="miami-section-title light">Schedule a 30-minute project call</h2>
            <p className="miami-contact-sub">
              We review every inquiry personally and respond within one business day.
            </p>
            <div className="miami-contact-lines">
              <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => track('Contact', { method: 'email' })}>{CONTACT_EMAIL}</a>
              <span className="miami-dot">·</span>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} onClick={() => track('Contact', { method: 'phone' })}>{CONTACT_PHONE}</a>
            </div>
          </div>

          <form className="miami-form" onSubmit={onSubmit}>
            <div className="miami-form-row">
              <label><span>Name</span><input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" /></label>
              <label><span>Company</span><input type="text" value={form.company} onChange={update('company')} placeholder="Company" /></label>
            </div>
            <div className="miami-form-row">
              <label><span>Email</span><input type="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" /></label>
              <label><span>Phone</span><input type="tel" value={form.phone} onChange={update('phone')} placeholder="+1 …" /></label>
            </div>
            <label><span>Project location</span><input type="text" value={form.location} onChange={update('location')} placeholder="Miami, FL" /></label>
            <div className="miami-form-row">
              <label><span>Venue type</span>
                <select value={form.venue} onChange={update('venue')}>
                  <option>Restaurant</option><option>Bar / Lounge</option><option>Hotel</option><option>Other</option>
                </select>
              </label>
              <label><span>Project stage</span>
                <select value={form.stage} onChange={update('stage')}>
                  <option>New venue</option><option>Renovation</option><option>Site not selected</option>
                </select>
              </label>
            </div>
            <div className="miami-form-row">
              <label><span>Approx. area (sq ft)</span><input type="text" value={form.area} onChange={update('area')} placeholder="e.g. 4,000" /></label>
              <label><span>Target opening date</span><input type="text" value={form.opening} onChange={update('opening')} placeholder="e.g. Q2 2027" /></label>
            </div>
            <label><span>Estimated project budget (USD)</span>
              <select value={form.budget} onChange={update('budget')}>
                <option value="">Select a range</option>
                <option>Under $250K</option><option>$250K – $500K</option><option>$500K – $1M</option><option>$1M – $3M</option><option>$3M+</option>
              </select>
            </label>
            <fieldset className="miami-form-services">
              <span className="miami-form-legend">Required services</span>
              <div className="miami-checks">
                {serviceOptions.map((s) => (
                  <label className="miami-check" key={s}>
                    <input type="checkbox" checked={!!form.services[s]} onChange={toggleService(s)} />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label><span>Link to brief or floor plan</span><input type="url" value={form.brief} onChange={update('brief')} placeholder="Google Drive / Dropbox link" /></label>
            <label><span>Anything else</span><textarea rows={3} value={form.message} onChange={update('message')} placeholder="Tell us about the project…" /></label>
            <button type="submit" className="miami-btn miami-btn-light miami-form-submit">
              {sent ? 'Opening your email…' : 'Schedule a 30-minute project call'}
            </button>
          </form>
        </div>
        <p className="miami-copyright">© 2026 Belenko Design Studio · Barcelona · Serving Miami &amp; South Florida</p>
      </section>
    </main>
  )
}
