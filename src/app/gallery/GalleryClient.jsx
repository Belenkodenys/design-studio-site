'use client'

import { useEffect, useRef, useState } from 'react'
import './Gallery.css'
import { GALLERY_CONTENT } from './galleryContent'

// Photos grouped into project albums. Each album lists its gallery-N image ids.
const g = (n) => `/gallery/gallery-${n}.jpg`
const ALBUMS = [
  { title: 'Living Space 1', ids: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 96, 97, 98, 99] },
  { title: 'Living Space 2', ids: [124, 125, 126, 127, 128, 129, 130, 131, 132] },
  { title: 'Living Space 3', ids: [25, 26, 27, 28, 29, 30, 32] },
  { title: 'Living Space 4', ids: [31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45] },
  { title: 'Living Space 5', ids: [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74] },
  { title: 'Living Space 6', ids: [94, 95, 100, 101, 102, 103, 104, 105, 107, 110] },
  { title: 'Living Space 7', ids: [106, 108, 109, 111, 113, 114, 115, 116, 117, 122, 123] },
  { title: 'Living Space 8', ids: [118, 119, 120, 121] },
  { title: 'Living Space 9', ids: [1, 2, 3, 4, 5, 6, 11, 12] },
  { title: 'Living Space 10', ids: [8, 9, 10, 13, 14] },
  { title: 'Living Space 11', ids: [15, 16, 17, 18, 19, 20] },
  { title: 'Living Space 12', ids: [21, 22, 23, 24] },
  { title: 'Living Space 13', ids: [46, 47, 48, 52] },
  { title: 'Living Space 14', ids: [49, 50, 53, 54] },
  { title: 'Living Space 15', ids: [51, 55, 56, 57] },
].map((a) => ({ title: a.title, photos: a.ids.map(g) }))

// Bold the studio name wherever it appears in a paragraph.
function withBrand(text) {
  const parts = text.split('Belenko Design')
  if (parts.length === 1) return text
  return parts.flatMap((p, i) =>
    i === 0 ? [p] : [<strong key={i}>Belenko Design</strong>, p]
  )
}

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/belenko',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/belenko_studio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/34671825489',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.657 0-3.216-.5-4.51-1.357l-.323-.194-2.871.854.854-2.871-.194-.323A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://es.pinterest.com/belenkodesign/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.805-2.425 1.808-2.425.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
]

// --- Hero background: tiled cross-fading slideshow (как на основном сайте) ---
const HERO_MEDIA = [
  '/gallery/gallery-80.jpg', '/gallery/gallery-67.jpg', '/gallery/gallery-78.jpg',
  '/gallery/gallery-76.jpg', '/gallery/gallery-1.jpg', '/gallery/gallery-16.jpg',
  '/gallery/gallery-25.jpg', '/gallery/gallery-50.jpg', '/gallery/gallery-58.jpg',
  '/gallery/gallery-64.jpg', '/gallery/gallery-82.jpg', '/gallery/gallery-90.jpg',
  '/gallery/gallery-100.jpg', '/gallery/gallery-105.jpg', '/gallery/gallery-118.jpg',
  '/gallery/gallery-120.jpg',
]
const TILE_ASPECT = 9 / 16

function pickDistinctMedia(count) {
  const pool = HERO_MEDIA.map((_, i) => i)
  const result = []
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) pool.push(...HERO_MEDIA.map((_, j) => j))
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

// Each tile changes its own image on its own random timer — fully independent,
// so tiles never swap in sync.
function HeroTile({ initialIdx }) {
  const [stack, setStack] = useState([{ id: 0, mediaIdx: initialIdx }])
  const counterRef = useRef(1)
  const curRef = useRef(initialIdx)

  useEffect(() => {
    let active = true
    const timers = []
    const tick = () => {
      const delay = Math.random() * 5000 + 5000 // 5–10s, unique per cycle
      const t = setTimeout(() => {
        if (!active) return
        const candidates = HERO_MEDIA.map((_, i) => i).filter((i) => i !== curRef.current)
        const next = candidates[Math.floor(Math.random() * candidates.length)]
        curRef.current = next
        const newId = counterRef.current++
        setStack((prev) => {
          const last = prev[prev.length - 1]
          return last ? [last, { id: newId, mediaIdx: next }] : [{ id: newId, mediaIdx: next }]
        })
        const rm = setTimeout(() => setStack((prev) => prev.filter((s) => s.id === newId)), 3700)
        timers.push(rm)
        tick()
      }, delay)
      timers.push(t)
    }
    const start = setTimeout(tick, Math.random() * 7000) // random initial offset
    timers.push(start)
    return () => { active = false; timers.forEach(clearTimeout) }
  }, [])

  return (
    <div className="ghero-tile">
      {stack.map((item) => (
        <div key={item.id} className="ghero-image">
          <img src={HERO_MEDIA[item.mediaIdx]} alt="" draggable="false" />
        </div>
      ))}
    </div>
  )
}

export default function GalleryClient() {
  const [album, setAlbum] = useState(null) // selected album index or null (album grid)
  const [lb, setLb] = useState(null) // fullscreen photo index within album, or null
  const [menuOpen, setMenuOpen] = useState(false)
  const [tiles, setTiles] = useState([])
  const [lang, setLang] = useState('ru')
  const startX = useRef(null)
  const startY = useRef(null)
  const t = GALLERY_CONTENT[lang]

  useEffect(() => {
    document.documentElement.classList.add('gallery-bg')
    return () => document.documentElement.classList.remove('gallery-bg')
  }, [])

  // Remember the visitor's language choice across visits.
  useEffect(() => {
    const saved = localStorage.getItem('gallery-lang')
    if (saved === 'ru' || saved === 'en') setLang(saved)
  }, [])
  const chooseLang = (l) => { setLang(l); try { localStorage.setItem('gallery-lang', l) } catch {} }

  // Hero slideshow: just size the mosaic to the viewport width.
  // Each tile then animates on its own independent random timer.
  useEffect(() => {
    const recalc = () => {
      const tileWidth = window.innerHeight * TILE_ASPECT
      const count = Math.max(1, Math.ceil(window.innerWidth / tileWidth))
      setTiles((prev) => {
        if (prev.length === count) return prev
        if (prev.length < count) return [...prev, ...pickDistinctMedia(count - prev.length)]
        return prev.slice(0, count)
      })
    }
    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [])

  const photos = album === null ? [] : ALBUMS[album].photos
  const prevAlbum = album === null ? null : (album - 1 + ALBUMS.length) % ALBUMS.length
  const nextAlbum = album === null ? null : (album + 1) % ALBUMS.length

  const openAlbum = (i) => { setAlbum(i); setLb(null); window.scrollTo({ top: 0 }) }
  const backToAlbums = () => { setAlbum(null); setLb(null); window.scrollTo({ top: 0 }) }

  // Menu: scroll to a text section. The text sections live on the home (album grid),
  // so leave the album first if needed, then scroll.
  const goToSection = (id) => {
    setMenuOpen(false)
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (album !== null) { setAlbum(null); setLb(null); setTimeout(scroll, 90) }
    else scroll()
  }

  const submitEnquiry = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const v = (n) => (f.elements[n]?.value || '').trim()
    const body =
      `${t.email.name}: ${v('name')}\n` +
      `${t.email.contact}: ${v('contact')}\n` +
      `${t.email.location}: ${v('location')}\n` +
      `${t.email.area}: ${v('area')}\n\n` +
      `${v('message')}`
    window.location.href =
      `mailto:office@belenko.design?subject=${encodeURIComponent(t.email.subject)}&body=${encodeURIComponent(body)}`
  }
  const open = (i) => setLb(i)
  const close = () => setLb(null)
  const step = (d) => setLb((i) => (i === null ? i : (i + d + photos.length) % photos.length))

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

  const socialLinks = SOCIAL.map((s) => (
    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
      {s.icon}
    </a>
  ))

  const contactsFooter = (
    <section className="gallery-footer" id="contacts">
      <h2 className="gallery-footer-title">{t.footerTitle}</h2>
      <div className="gallery-contacts">
        <a href="mailto:office@belenko.design">office@belenko.design</a>
        <a href="tel:+34671825489">+34 67182 54 89</a>
        <span className="gallery-contacts-loc">{t.location}</span>
      </div>
      <div className="gallery-contacts-social">{socialLinks}</div>
    </section>
  )

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
        <div className="gallery-head-brand">
          <button type="button" className="gallery-mark" onClick={() => { setMenuOpen(false); backToAlbums() }} aria-label="Back to gallery home">
            <img src="/belenko-logo-white.png" alt="BELENKO" />
          </button>
        </div>
        <button
          type="button"
          className="gallery-menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
        <nav className={`gallery-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Sections">
          <button type="button" onClick={() => goToSection('ffe')}>{t.menu.ffe}</button>
          <button type="button" onClick={() => goToSection('procurement')}>{t.menu.procurement}</button>
          <button type="button" onClick={() => goToSection('about')}>{t.menu.about}</button>
          <button type="button" onClick={() => goToSection('contact')}>{t.menu.contacts}</button>
          <div className="gallery-lang" role="group" aria-label="Language">
            <button type="button" className={lang === 'ru' ? 'is-active' : ''} onClick={() => chooseLang('ru')} aria-pressed={lang === 'ru'}>RU</button>
            <span className="gallery-lang-sep" aria-hidden="true">/</span>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => chooseLang('en')} aria-pressed={lang === 'en'}>EN</button>
          </div>
        </nav>
      </header>

      {album === null ? (
        <>
          <section className="gallery-hero">
            <div className="ghero-slider" aria-hidden="true">
              {tiles.map((mediaIdx, i) => (
                <HeroTile key={i} initialIdx={mediaIdx} />
              ))}
            </div>
            <img className="gallery-hero-cally" src="/gallery/hero-title.png" alt="Private Interiors" />
            <p className="gallery-hero-sub">{t.hero.sub}</p>
            <p className="gallery-hero-line">{t.hero.line}</p>
            <div className="gallery-hero-actions">
              <button type="button" className="gallery-btn" onClick={() => goToSection('residences')}>{t.hero.ctaProjects}</button>
              <button type="button" className="gallery-btn gallery-btn-ghost" onClick={() => goToSection('contact')}>{t.hero.ctaStart}</button>
            </div>
          </section>

          <div className="gallery-section-head" id="residences">
            <span className="gallery-section-label gallery-section-label--light">{t.projectsLabel}</span>
          </div>
          <div className="gallery-albums">
            {ALBUMS.map((a, i) => (
              <button type="button" className="gallery-album" key={a.title} onClick={() => openAlbum(i)} aria-label={a.title}>
                <img src={a.photos[0]} alt="" loading="lazy" draggable={false} />
                <span className="gallery-album-label">{a.title}</span>
              </button>
            ))}
          </div>

          <section className="gallery-about" id="about">
            <h2 className="gallery-about-heading">{t.about.heading}</h2>
            {t.about.paras.map((p, i) => (
              <p key={i}>{withBrand(p)}</p>
            ))}
          </section>

          <section className="gallery-dark gallery-pad" id="services">
            <span className="gallery-section-label gallery-section-label--light">{t.services.label}</span>
            <h2 className="gallery-dark-heading">{t.services.heading}</h2>
            <div className="gallery-services">
              {t.services.items.map(([title, d]) => (
                <div className="gallery-service" key={title}>
                  <h4>{title}</h4>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="gallery-dark gallery-pad gallery-onestudio">
            <span className="gallery-section-label gallery-section-label--light">{t.onestudio.label}</span>
            <p className="gallery-onestudio-text">{t.onestudio.text}</p>
            <p className="gallery-onestudio-flow">{t.onestudio.flow}</p>
          </section>

          <section className="gallery-light gallery-pad" id="process">
            <span className="gallery-section-label">{t.process.label}</span>
            <div className="gallery-steps">
              {t.process.steps.map(([n, title, d]) => (
                <div className="gallery-step" key={n}>
                  <span className="gallery-step-num">{n}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="gallery-dark gallery-pad">
            <span className="gallery-section-label gallery-section-label--light">{t.international.label}</span>
            <p className="gallery-intl-text">{t.international.text}</p>
          </section>

          <section className="gallery-dark gallery-pad">
            <div className="gallery-stats">
              {t.stats.map(([n, l]) => (
                <div className="gallery-stat" key={l}>
                  <span className="gallery-stat-num">{n}</span>
                  <span className="gallery-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="gallery-about">
            {t.ffeBlocks.map((b, i) => {
              if (b.type === 'h2') return <h2 key={i} id={b.id} className="gallery-about-heading">{b.text}</h2>
              if (b.type === 'h2s') return <h2 key={i} id={b.id} className="gallery-about-heading gallery-about-heading--section">{b.text}</h2>
              if (b.type === 'h3') return <h3 key={i} className="gallery-about-subtitle">{b.text}</h3>
              if (b.type === 'flow') return <p key={i} className="gallery-about-flow">{b.text}</p>
              return <p key={i}>{b.text}</p>
            })}
          </section>

          <section className="gallery-dark gallery-pad gallery-contact" id="contact">
            <h2 className="gallery-contact-title">{t.contact.title}</h2>
            <p className="gallery-contact-lead">{t.contact.lead}</p>
            <form className="gallery-form" onSubmit={submitEnquiry}>
              <div className="gallery-form-row">
                <input name="name" placeholder={t.contact.name} required />
                <input name="contact" placeholder={t.contact.contact} required />
              </div>
              <div className="gallery-form-row">
                <input name="location" placeholder={t.contact.location} />
                <input name="area" placeholder={t.contact.area} />
              </div>
              <textarea name="message" placeholder={t.contact.message} rows={4} />
              <button type="submit" className="gallery-btn">{t.contact.submit}</button>
            </form>
            <div className="gallery-contact-direct">
              <a href="mailto:office@belenko.design">office@belenko.design</a>
              <a href="tel:+34671825489">+34 67182 54 89</a>
              <span>{t.location}</span>
            </div>
            <div className="gallery-contacts-social gallery-contacts-social--dark">{socialLinks}</div>
          </section>
        </>
      ) : (
        <>
          <div className="gallery-feed">
            {photos.map((src, i) => (
              <button type="button" className="gallery-cell" key={src + i} onClick={() => open(i)} aria-label={`Open photo ${i + 1}`}>
                <img src={src} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>

          <nav className="gallery-projectnav" aria-label="Project navigation">
            <button type="button" className="gallery-projectnav-btn gallery-projectnav-prev" onClick={() => openAlbum(prevAlbum)}>
              <span className="gallery-projectnav-arrow" aria-hidden="true">←</span>
              <span className="gallery-projectnav-title">{ALBUMS[prevAlbum].title}</span>
            </button>
            <button type="button" className="gallery-projectnav-btn gallery-projectnav-next" onClick={() => openAlbum(nextAlbum)}>
              <span className="gallery-projectnav-title">{ALBUMS[nextAlbum].title}</span>
              <span className="gallery-projectnav-arrow" aria-hidden="true">→</span>
            </button>
          </nav>

          {contactsFooter}
        </>
      )}

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
          <img className="gallery-lb-img" src={photos[lb]} alt="" onClick={(e) => e.stopPropagation()} draggable={false} />
          <button type="button" className="gallery-lb-nav gallery-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
          <button type="button" className="gallery-lb-nav gallery-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next">›</button>
          <span className="gallery-lb-count">{lb + 1} / {photos.length}</span>
        </div>
      )}
    </main>
  )
}
