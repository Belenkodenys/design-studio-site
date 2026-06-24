'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import ProposalFooter from '../clients/proposal/ProposalFooter'
import './PresentationPage.css'

const navItems = [
  { id: 'concept', label: 'Concept' },
  { id: 'interior', label: 'Interior' },
  { id: 'layout', label: 'Layout' },
  { id: 'details', label: 'Details' },
  { id: 'branding', label: 'Branding' },
  { id: 'references', label: 'References' },
  { id: 'audience', label: 'Audience' }
]

const sections = [
  {
    id: 'concept',
    label: '01',
    title: 'Concept',
    body: ''
  },
  {
    id: 'interior',
    label: '02',
    title: 'Interior',
    body: ''
  },
  {
    id: 'layout',
    label: '03',
    title: 'Layout',
    body: ''
  },
  {
    id: 'details',
    label: '04',
    title: 'Details',
    body: ''
  },
  {
    id: 'branding',
    label: '05',
    title: 'Branding',
    body: ''
  },
  {
    id: 'references',
    label: '06',
    title: 'References',
    body: ''
  },
  {
    id: 'audience',
    label: '07',
    title: 'Target Audience',
    body: ''
  }
]

const interiorImages = [1, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(
  (n) => `/tesla-interior-${n}.jpg`
)

const moodReel = [1, 2, 3, 4].map((n) => ({
  src: `/tesla-video-${n}.mp4`,
  poster: `/tesla-video-${n}-poster.jpg`
}))

function MoodReel({ items }) {
  const videoRefs = useRef([])
  const [activeIdx, setActiveIdx] = useState(null)

  const play = (i) => {
    items.forEach((_, j) => {
      const v = videoRefs.current[j]
      if (!v) return
      if (j !== i) {
        v.pause()
        v.currentTime = 0
      }
    })
    setActiveIdx(i)
    const v = videoRefs.current[i]
    if (v) {
      v.currentTime = 0
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
  }

  const handleEnded = (i) => {
    const next = (i + 1) % items.length
    play(next)
  }

  return (
    <section className="presentation-moodreel">
      <div className="presentation-moodreel-grid">
        {items.map((item, i) => (
          <figure
            key={item.src}
            className={`presentation-moodreel-tile${
              activeIdx === i ? ' is-active' : ''
            }`}
            onClick={() => (activeIdx === i ? null : play(i))}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={item.src}
              poster={item.poster}
              preload="metadata"
              playsInline
              controls={activeIdx === i}
              onEnded={() => handleEnded(i)}
              className="presentation-moodreel-video"
            />
            {activeIdx !== i && (
              <button
                type="button"
                className="presentation-moodreel-play"
                aria-label="Play video"
                onClick={(e) => {
                  e.stopPropagation()
                  play(i)
                }}
              >
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r="31" />
                  <path d="M26 20 L46 32 L26 44 Z" />
                </svg>
              </button>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}

function InteriorLightbox({ images, index, onClose, onPrev, onNext }) {
  const touchStartX = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onPrev, onNext])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 40) {
      if (dx < 0) onNext()
      else onPrev()
    }
  }

  return (
    <div
      className="presentation-lightbox"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="presentation-lightbox-close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close"
      >
        ×
      </button>
      <button
        type="button"
        className="presentation-lightbox-nav presentation-lightbox-prev"
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        className="presentation-lightbox-nav presentation-lightbox-next"
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next"
      >
        ›
      </button>
      <img
        src={images[index]}
        alt={`Interior render ${index + 1}`}
        className="presentation-lightbox-image"
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        draggable="false"
      />
      <div className="presentation-lightbox-counter">
        {index + 1} / {images.length}
      </div>
    </div>
  )
}

export default function PresentationPage() {
  const ticketsRef = useRef(null)
  const logoRef = useRef(null)
  const formulaRef = useRef(null)
  const [overlaysLoaded, setOverlaysLoaded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [specOpen, setSpecOpen] = useState(false)
  const ctaRef = useRef(null)
  const [ctaInView, setCtaInView] = useState(false)

  useEffect(() => {
    if (!ctaRef.current) return
    // Multiple thresholds so the callback fires both when the section becomes
    // ~15% visible (palms slide in) AND when it fully exits the viewport in
    // either direction (palms slide back out on scroll up/down).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.15) setCtaInView(true)
        else if (!entry.isIntersecting) setCtaInView(false)
      },
      { threshold: [0, 0.15] }
    )
    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('presentation-bg')
    return () => document.documentElement.classList.remove('presentation-bg')
  }, [])

  // Content protection: deter copy / save / print / inspect.
  // Note: OS-level screenshots cannot be blocked from a web page.
  useEffect(() => {
    const blockContext = (e) => e.preventDefault()
    const blockDrag = (e) => e.preventDefault()
    const blockCopy = (e) => e.preventDefault()
    const blockKey = (e) => {
      const k = e.key
      const lower = k.length === 1 ? k.toLowerCase() : k
      const mod = e.metaKey || e.ctrlKey
      // DevTools / view-source / save / print / copy / cut / select-all
      if (k === 'F12') return e.preventDefault()
      if (mod && e.shiftKey && ['i', 'j', 'c'].includes(lower)) return e.preventDefault()
      if (mod && e.altKey && ['i', 'j', 'c'].includes(lower)) return e.preventDefault()
      if (mod && ['s', 'p', 'u', 'c', 'a', 'x'].includes(lower)) return e.preventDefault()
      // macOS screenshot shortcuts (cannot be blocked at OS level, but try the cmd+shift cases)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(k)) return e.preventDefault()
    }
    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('copy', blockCopy)
    document.addEventListener('cut', blockCopy)
    document.addEventListener('keydown', blockKey)
    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('copy', blockCopy)
      document.removeEventListener('cut', blockCopy)
      document.removeEventListener('keydown', blockKey)
    }
  }, [])

  // Entry animation: tickets slide in from the left, logo from the right.
  useEffect(() => {
    const id = requestAnimationFrame(() => setOverlaysLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Scroll parallax: tickets slide out to the left, logo to the right.
  useEffect(() => {
    let rafId = null

    const update = () => {
      rafId = null
      const heroHeight = window.innerHeight
      const t = Math.min(1, window.scrollY / (heroHeight * 0.7))
      const shiftPx = t * window.innerWidth * 1.4
      if (ticketsRef.current) {
        ticketsRef.current.style.setProperty(
          '--tickets-scroll-shift',
          `${-shiftPx}px`
        )
      }
      if (logoRef.current) {
        logoRef.current.style.setProperty(
          '--logo-scroll-shift',
          `${shiftPx}px`
        )
      }
      if (formulaRef.current) {
        // Fly upward faster than the screen scrolls (~1.3x)
        formulaRef.current.style.setProperty(
          '--formula-scroll-shift',
          `${-window.scrollY * 1.3}px`
        )
      }
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <main className="presentation">
      <nav className="presentation-nav" aria-label="Presentation sections">
        <div className="presentation-nav-inner">
          <a href="#top" className="presentation-nav-brand">
            <span className="presentation-nav-brand-belenko">BELENKO</span>
            <span className="presentation-nav-brand-studio">STUDIO</span>
          </a>
          <ul className="presentation-nav-list">
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="presentation-nav-link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <header id="top" className="presentation-hero" aria-hidden="true">
        <div ref={ticketsRef} className="presentation-hero-tickets-wrap">
          <img
            src="/tesla-logo.png"
            alt=""
            className={`presentation-hero-tickets${overlaysLoaded ? ' is-in' : ''}`}
            draggable="false"
          />
        </div>
        <div ref={logoRef} className="presentation-hero-logo-wrap">
          <img
            src="/tesla-tickets.png"
            alt=""
            className={`presentation-hero-logo${overlaysLoaded ? ' is-in' : ''}`}
            draggable="false"
          />
        </div>
        <div ref={formulaRef} className="presentation-hero-formula-wrap">
          <img
            src="/tesla-formula-heading.png"
            alt="One formula for the entire experience"
            className={`presentation-hero-formula presentation-hero-formula-heading${overlaysLoaded ? ' is-in' : ''}`}
            draggable="false"
          />
          <img
            src="/tesla-formula-slogan.png"
            alt="By day, by evening, after midnight"
            className={`presentation-hero-formula presentation-hero-formula-slogan${overlaysLoaded ? ' is-in' : ''}`}
            draggable="false"
          />
        </div>
      </header>

      <section className="presentation-blocks">
        {sections.map((s) => (
          <Fragment key={s.id}>
            <article id={s.id} className="presentation-block">
              {s.id === 'interior' && (
                <video
                  className="presentation-block-bg-video"
                  src="/tesla-bg-interior.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/tesla-bg-interior.jpg"
                  aria-hidden="true"
                />
              )}
              <div className="presentation-block-label">{s.label}</div>
              <div className="presentation-block-content">
                <h2 className="presentation-block-title">
                  <img
                    src={`/section-h-${s.id}.png`}
                    alt={s.title}
                    className="presentation-block-title-image"
                  />
                </h2>
                {s.id === 'concept' && (
                  <div className="presentation-concept-body">
                    <p>
                      A former cinema in the heart of Split. Second floor.
                      Views of Dalmatian facades. A large open terrace.
                    </p>
                    <p>
                      A place that lives three lives in a single day — and
                      each one is the best in the city.
                    </p>

                    <h3 className="presentation-concept-h">
                      <img
                        src="/concept-h-three-states.png"
                        alt="Three States"
                      />
                    </h3>
                    <p>
                      <strong>Lunch</strong> — terrace in the shade of olive
                      trees, Dalmatian cuisine, easy wine. The best lunch in
                      the city centre.
                    </p>
                    <p>
                      <strong>Dinner</strong> — the atmosphere thickens, the
                      light shifts, the menu deepens. A serious bar, considered
                      cuisine, service without ceremony.
                    </p>
                    <p>
                      <strong>Night</strong> — the room transforms. On the
                      screen of the former cinema — films, visual sets, themed
                      screenings. Music. Dancing. The best night of the entire
                      trip.
                    </p>

                    <h3 className="presentation-concept-h">
                      <img
                        src="/concept-h-kitchen-bar.png"
                        alt="Kitchen and Bar"
                      />
                    </h3>
                    <p>
                      Dalmatian cuisine with a contemporary edge. Local
                      produce, Croatian wine, a cocktail programme on par with
                      the best bars in Europe.
                    </p>

                    <h3 className="presentation-concept-h">
                      <img src="/concept-h-audience.png" alt="Audience" />
                    </h3>
                    <p>
                      Travellers 30+. Americans and Europeans who choose Split
                      deliberately — for a living city, not a postcard.
                    </p>

                    <h3 className="presentation-concept-h">
                      <img src="/concept-h-position.png" alt="Position" />
                    </h3>
                    <p>
                      The finest venue in the centre of Split. Not a restaurant
                      with a club. Not a club with food.
                    </p>
                    <p>A place that stays with you after the trip is over.</p>

                    <h3 className="presentation-concept-h">
                      <img src="/concept-h-the-name.png" alt="The Name" />
                    </h3>
                    <p>
                      Nikola Tesla was born in Croatia. He thought of energy
                      as an invisible force that moves through everything.
                    </p>
                    <p>
                      Tesla is about the energy of a space. About the
                      resonance between a place and a person. About the fact
                      that the best evenings are never planned — they simply
                      happen.
                    </p>
                  </div>
                )}
                {s.body && s.id !== 'concept' && (
                  <p className="presentation-block-body">{s.body}</p>
                )}
              </div>
            </article>
            {s.id === 'interior' && (
              <>
                <div className="presentation-interior-gallery">
                  {interiorImages.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className="presentation-interior-tile"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Open interior render ${i + 1} fullscreen`}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
                <div className="presentation-interior-walkthrough">
                  <video
                    src="/tesla-interior-walkthrough.mp4"
                    controls
                    playsInline
                    preload="metadata"
                    poster="/tesla-interior-1.jpg"
                  />
                </div>
              </>
            )}
            {s.id === 'layout' && (
              <div className="presentation-layout-plans">
                <img
                  src="/tesla-layout-0.jpg"
                  alt="Restaurant — furniture plan with room schedule"
                  loading="lazy"
                />
                <img
                  src="/tesla-layout-1.jpg"
                  alt="Restaurant — main level"
                  loading="lazy"
                />
                <img
                  src="/tesla-layout-2.jpg"
                  alt="Restaurant — upper level"
                  loading="lazy"
                />
              </div>
            )}
            {s.id === 'references' && (
              <div className="presentation-references-gallery">
                {[1, 2, 3, 4, 5, 17].map((n) => (
                  <figure
                    key={n}
                    className="presentation-references-tile"
                  >
                    <img
                      src={`/tesla-reference-${n}.jpg`}
                      alt={`Reference moodboard ${n}`}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            )}
            {s.id === 'audience' && (
              <div className="presentation-audience-body">
                <h3 className="presentation-audience-h">
                  <img
                    src="/audience-h-who.png"
                    alt="Who Are These People?"
                  />
                </h3>
                <p>Not the ultra-wealthy. Not backpackers.</p>
                <p>
                  They are the middle ground — travelers who have outgrown
                  all-inclusive buffets but are not looking for a white-glove
                  sommelier experience.
                </p>
                <p>
                  Typically aged between 35 and 55, they have the financial
                  means to enjoy comfort, yet they still remember why they
                  travel: not for status, but for experiences.
                </p>

                <div className="presentation-audience-rule" />

                <h3 className="presentation-audience-h">
                  <img
                    src="/audience-h-segments.png"
                    alt="Two Guest Segments — Two Different Mindsets"
                  />
                </h3>

                <div className="presentation-audience-segments">
                  <article className="presentation-audience-segment">
                    <h4 className="presentation-audience-segment-title">
                      <span aria-hidden="true">🚢</span> Cruise Passengers
                    </h4>
                    <p className="presentation-audience-segment-lede">
                      Primarily Americans and Northern Europeans (Germans,
                      Scandinavians, Dutch)
                    </p>
                    <p>They have only 4–6 hours in Split.</p>
                    <p>
                      Their ship departs at 6:00 PM. They came ashore around
                      10:00 AM and have already explored Diocletian’s Palace.
                      Now they want to sit down, relax, and enjoy something
                      authentic — not another tourist trap with photos of
                      dishes on the menu.
                    </p>
                    <p>They make decisions spontaneously.</p>
                    <p>They walk into places that:</p>
                    <ul>
                      <li>Look attractive from the outside</li>
                      <li>Have available seating</li>
                      <li>Offer Wi-Fi</li>
                      <li>Allow them to charge their phones</li>
                    </ul>
                    <p>
                      Price is rarely an obstacle. Their shore-excursion budget
                      has already been allocated.
                    </p>
                    <p className="presentation-audience-pain">
                      <strong>Their Pain Point</strong>
                      <em>
                        “Everywhere serves the same thing — pasta and fish with
                        lemon. Where can we find something with personality?”
                      </em>
                    </p>
                  </article>

                  <article className="presentation-audience-segment">
                    <h4 className="presentation-audience-segment-title">
                      <span aria-hidden="true">⛵</span> Yacht Travelers
                    </h4>
                    <p className="presentation-audience-segment-lede">
                      A mixed European audience aged 35–60
                    </p>
                    <p>Often traveling in groups of 4–8 people.</p>
                    <p>They already know Croatia. This is not their first visit.</p>
                    <p>
                      They arrive in Split as a port of call rather than as a
                      tourist destination.
                    </p>
                    <p>
                      Their pace is slower, more deliberate, and more
                      evening-oriented.
                    </p>
                    <p>
                      They want a memorable dinner, a good bottle of wine, and a
                      place where they can spend the evening.
                    </p>
                    <p>
                      They typically research restaurants in advance through
                      Google, Google Maps, online reviews, and recommendations
                      from marina staff.
                    </p>
                    <p>
                      For them, the word <em>“atmosphere”</em> matters more
                      than <em>“large portions.”</em>
                    </p>
                    <p className="presentation-audience-pain">
                      <strong>Their Pain Point</strong>
                      <em>
                        “There are plenty of tourist restaurants. We’re looking
                        for a place we would actually want to come back to.”
                      </em>
                    </p>
                  </article>
                </div>

                <div className="presentation-audience-rule" />

                <h3 className="presentation-audience-h">
                  <img
                    src="/audience-h-psychographic.png"
                    alt="Psychographic Profile"
                  />
                </h3>
                <dl className="presentation-audience-profile">
                  <div>
                    <dt>Travel Motivation</dt>
                    <dd>
                      Discovery, exploration, and memorable experiences.
                    </dd>
                  </div>
                  <div>
                    <dt>Relationship with Food</dt>
                    <dd>Food is part of the journey, not just fuel.</dd>
                  </div>
                  <div>
                    <dt>Decision-Making Process</dt>
                    <dd>Visual appeal, reviews, and recommendations.</dd>
                  </div>
                  <div>
                    <dt>Trigger to Visit</dt>
                    <dd>
                      A strong visual impression or Instagram-worthy imagery.
                    </dd>
                  </div>
                  <div>
                    <dt>What They Value Most</dt>
                    <dd>
                      Atmosphere first, followed by food, service, and only
                      then price.
                    </dd>
                  </div>
                  <div>
                    <dt>Payment Behavior</dt>
                    <dd>
                      Card payments without hesitation; cash is rarely used.
                    </dd>
                  </div>
                  <div>
                    <dt>Typical Visit Time</dt>
                    <dd>
                      Cruise guests: 12:00 – 16:00.
                      <br />
                      Yacht guests: 19:00 – 23:00.
                    </dd>
                  </div>
                  <div>
                    <dt>Social Media Usage</dt>
                    <dd>Active users of Instagram and TripAdvisor.</dd>
                  </div>
                </dl>

                <div className="presentation-audience-rule" />

                <h3 className="presentation-audience-h">
                  <img
                    src="/audience-h-no-want.png"
                    alt="What They Do Not Want to See"
                  />
                </h3>
                <ul className="presentation-audience-no-list">
                  <li>Laminated menus with photos of dishes</li>
                  <li>Staff aggressively pulling guests into the restaurant</li>
                  <li>Loud music blasting during lunch hours</li>
                  <li>Unexpected charges on the final bill</li>
                  <li>A gap between expectations and reality</li>
                </ul>

                <div className="presentation-audience-rule" />

                <h3 className="presentation-audience-h">
                  <img
                    src="/audience-h-key.png"
                    alt="The Key Insight"
                  />
                </h3>
                <p>
                  These guests did not come to Croatia simply to eat. They came
                  to experience Croatia.
                </p>
                <p>
                  For them, a restaurant is not merely a place to have a meal.
                  It is the culmination of the day.
                </p>
                <p>
                  If Tesla delivers that feeling, guests return. They take
                  photos. They post on Instagram. They leave TripAdvisor
                  reviews while still sitting at the table.
                </p>
                <p className="presentation-audience-closing">
                  The goal is not to sell the menu.
                  <br />
                  The goal is to sell the moment.
                </p>
                <div className="presentation-audience-finale">
                  <p className="presentation-audience-closing">
                    A beautiful Mediterranean evening.
                    <br />
                    A memory worth sharing.
                    <br />
                    A place worth recommending.
                    <br />
                    A place worth returning to.
                  </p>
                  <img
                    src="/audience-eatertaintment.png"
                    alt="Eatertaintment"
                    className="presentation-audience-eatertaintment"
                  />
                </div>

                <div className="presentation-audience-photos">
                  <figure>
                    <img
                      src="/tesla-audience-1.jpg"
                      alt="Two couples sharing dinner at Tesla"
                      loading="lazy"
                    />
                  </figure>
                  <figure>
                    <img
                      src="/tesla-audience-2.jpg"
                      alt="A group dining with marina views"
                      loading="lazy"
                    />
                  </figure>
                  <figure>
                    <img
                      src="/tesla-audience-3.jpg"
                      alt="Six scenes of Tesla guests across the evening"
                      loading="lazy"
                    />
                  </figure>
                  <figure>
                    <img
                      src="/tesla-audience-4.jpg"
                      alt="Two couples sharing wine and dinner at Tesla"
                      loading="lazy"
                    />
                  </figure>
                </div>
              </div>
            )}
            {s.id === 'details' && (
              <div className="presentation-details-spec">
                <div className="presentation-details-spec-link-wrap">
                  <button
                    type="button"
                    className={`presentation-details-spec-link${specOpen ? ' is-open' : ''}`}
                    onClick={() => setSpecOpen((v) => !v)}
                    aria-expanded={specOpen}
                    aria-controls="presentation-details-spec-panel"
                  >
                    <span>Furniture specification — 41 positions</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="presentation-details-spec-chevron"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  id="presentation-details-spec-panel"
                  className={`presentation-details-spec-panel${specOpen ? ' is-open' : ''}`}
                  aria-hidden={!specOpen}
                >
                  <img
                    src="/tesla-furniture-spec.jpg"
                    alt="Furniture specification — Split project, 41 positions"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            {s.id === 'details' && (
              <div className="presentation-details-gallery">
                {[
                  '/tesla-details.webp',
                  '/tesla-details-2.webp',
                  '/tesla-details-3.jpg',
                  '/tesla-details-4.jpg',
                  '/tesla-details-5.webp',
                  '/tesla-details-6.webp',
                  '/tesla-details-7.webp',
                  '/tesla-details-8.webp',
                  '/tesla-details-9.webp',
                  '/tesla-details-10.webp',
                  '/tesla-details-11.webp',
                  '/tesla-details-12.webp',
                  '/tesla-details-13.webp',
                  '/tesla-details-14.webp',
                  '/tesla-details-15.webp',
                  '/tesla-details-16.webp',
                  '/tesla-details-17.webp',
                  '/tesla-details-18.webp',
                  '/tesla-details-19.webp',
                  '/tesla-details-20.webp',
                  '/tesla-details-21.webp',
                  '/tesla-details-22.webp',
                  '/tesla-details-23.webp',
                  '/tesla-details-24.webp',
                  '/tesla-details-25.webp',
                  '/tesla-details-26.webp',
                  '/tesla-details-27.webp',
                  '/tesla-details-28.webp',
                  '/tesla-details-29.webp',
                  '/tesla-details-30.webp',
                  '/tesla-details-31.webp',
                  '/tesla-details-32.webp',
                  '/tesla-details-33.webp',
                  '/tesla-details-34.webp',
                  '/tesla-details-35.webp',
                  '/tesla-details-36.webp',
                  '/tesla-details-37.jpg',
                  '/tesla-details-38.webp',
                  '/tesla-details-39.webp'
                ].map((src) => (
                  <figure key={src} className="presentation-details-tile">
                    <img src={src} alt="" loading="lazy" />
                  </figure>
                ))}
              </div>
            )}
            {s.id === 'branding' && (
              <>
                <div className="presentation-branding-mark">
                  <img
                    src="/tesla-logo.png"
                    alt="Tesla — restaurant brand mark"
                    loading="lazy"
                  />
                </div>
                <div className="presentation-branding-gallery">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
                    <figure key={n} className="presentation-branding-tile">
                      <img
                        src={`/tesla-brand-${n}.jpg`}
                        alt={`Brand application ${n}`}
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </>
            )}
          </Fragment>
        ))}
      </section>

      <MoodReel items={moodReel} />

      <section
        ref={ctaRef}
        className={`presentation-cta${ctaInView ? ' is-in-view' : ''}`}
      >
        <img
          src="/tesla-cameraman.webp"
          alt=""
          className="presentation-cta-image"
          draggable="false"
        />
        <img
          src="/tesla-logo-big.png"
          alt="Tesla — restaurant"
          className="presentation-cta-logo-mark"
          draggable="false"
        />
      </section>

      <ProposalFooter />

      {lightboxIndex !== null && (
        <InteriorLightbox
          images={interiorImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (i) => (i - 1 + interiorImages.length) % interiorImages.length
            )
          }
          onNext={() =>
            setLightboxIndex((i) => (i + 1) % interiorImages.length)
          }
        />
      )}
    </main>
  )
}
