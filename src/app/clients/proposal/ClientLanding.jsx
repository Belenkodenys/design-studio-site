'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { sections } from './sections'
import ProposalFooter from './ProposalFooter'
import Portfolio from '../../../components/Portfolio'
import './ClientLanding.css'
import './layout-left.css'

const rotatingWords = ['restaurants', 'hotels', 'cafés', 'shops', 'bars']
const longestRotatingWord = rotatingWords.reduce(
  (a, b) => (b.length > a.length ? b : a),
  ''
)

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const idxRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const current = idxRef.current
      const next = (current + 1) % rotatingWords.length
      idxRef.current = next
      setPrevIdx(current)
      setIdx(next)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (prevIdx === null) return
    const t = setTimeout(() => setPrevIdx(null), 700)
    return () => clearTimeout(t)
  }, [prevIdx, idx])

  return (
    <span className="proposal-rotator">
      <span className="proposal-rotator-spacer">{longestRotatingWord}</span>
      {prevIdx !== null && (
        <span
          key={`out-${prevIdx}`}
          className="proposal-rotator-word proposal-rotator-out"
        >
          {rotatingWords[prevIdx]}
        </span>
      )}
      <span
        key={`in-${idx}`}
        className="proposal-rotator-word proposal-rotator-in"
      >
        {rotatingWords[idx]}
      </span>
    </span>
  )
}

function GlitchButton() {
  const [isGlitching, setIsGlitching] = useState(false)
  const timeoutRef = useRef(null)
  const audioRef = useRef(null)

  // Pre-load the audio file the moment the component mounts so playback is
  // instant on the first click (no network fetch / decode latency on tap).
  useEffect(() => {
    const audio = new Audio('/fun-music.mp3')
    audio.preload = 'auto'
    audio.volume = 0.85
    audio.load()
    audioRef.current = audio
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (audioRef.current) {
        try { audioRef.current.pause() } catch (_) {}
        audioRef.current = null
      }
    }
  }, [])

  const startGlitchAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    try { audio.currentTime = 0 } catch (_) {}
    audio.play().catch(() => {})
  }

  const trigger = () => {
    if (isGlitching) return
    setIsGlitching(true)
    document.documentElement.classList.add('is-glitching')
    // Inject disco-ball lights overlay
    let disco = document.getElementById('proposal-disco-overlay')
    if (!disco) {
      disco = document.createElement('div')
      disco.id = 'proposal-disco-overlay'
      disco.className = 'proposal-disco-overlay'
      disco.innerHTML = `
        <div class="proposal-disco-lights"></div>
        <div class="proposal-disco-lights proposal-disco-lights--alt"></div>
        <div class="proposal-disco-ball">
          <div class="proposal-disco-ball-inner"></div>
        </div>
      `
      document.body.appendChild(disco)
    }
    startGlitchAudio()
    timeoutRef.current = setTimeout(() => {
      document.documentElement.classList.remove('is-glitching')
      const overlay = document.getElementById('proposal-disco-overlay')
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
      setIsGlitching(false)
      if (audioRef.current) {
        try {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        } catch (_) {}
      }
      timeoutRef.current = null
    }, 5500)
  }

  return (
    <button
      type="button"
      onClick={trigger}
      className={`proposal-glitch-btn${isGlitching ? ' is-pressed' : ''}`}
      aria-label="Fun"
    >
      <img src="/fun-button.png" alt="FUN" draggable="false" />
    </button>
  )
}

function StudioGallery({ slides, bare = false, className = '' }) {
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState(null)
  const [direction, setDirection] = useState(null)
  const [cursor, setCursor] = useState(null)
  const touchStartXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const horizontalLockRef = useRef(null)
  const galleryRef = useRef(null)
  const currentRef = useRef(0)
  const leaveTimerRef = useRef(null)

  const advance = useCallback((dir) => {
    const N = slides.length
    if (N <= 1) return
    const cur = currentRef.current
    const next = dir === 'next' ? (cur + 1) % N : (cur - 1 + N) % N
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    setLeaving(cur)
    setDirection(dir)
    setCurrent(next)
    currentRef.current = next
    leaveTimerRef.current = setTimeout(() => {
      setLeaving(null)
      setDirection(null)
      leaveTimerRef.current = null
    }, 700)
  }, [slides.length])

  // Preload only the current slide and its immediate neighbours. Eagerly
  // decoding every slide blows up memory on mobile (dozens of ~2000px images
  // at ~10MB decoded each), which crashes the tab. The window keeps a handful
  // of images alive — enough for smooth next/prev transitions.
  useEffect(() => {
    const N = slides.length
    if (!N) return
    const idxs = [current, (current + 1) % N, (current - 1 + N) % N]
    idxs.forEach((i) => {
      const img = new window.Image()
      img.src = slides[i]
    })
  }, [current, slides])


  // Non-passive touch listeners so we can preventDefault during horizontal drag
  useEffect(() => {
    const el = galleryRef.current
    if (!el) return

    const onTouchStart = (e) => {
      const t = e.touches?.[0]
      if (!t) return
      touchStartXRef.current = t.clientX
      touchStartYRef.current = t.clientY
      horizontalLockRef.current = null
    }
    const onTouchMove = (e) => {
      const sx = touchStartXRef.current
      const sy = touchStartYRef.current
      if (sx == null || sy == null) return
      const t = e.touches?.[0]
      if (!t) return
      const dx = t.clientX - sx
      const dy = t.clientY - sy
      if (horizontalLockRef.current == null) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          horizontalLockRef.current = Math.abs(dx) > Math.abs(dy)
        }
      }
      if (horizontalLockRef.current) {
        e.preventDefault()
      }
    }
    const onTouchEnd = (e) => {
      const sx = touchStartXRef.current
      const sy = touchStartYRef.current
      if (sx != null && sy != null) {
        const t = e.changedTouches?.[0]
        if (t) {
          const dx = t.clientX - sx
          const dy = t.clientY - sy
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            advance(dx < 0 ? 'next' : 'prev')
          }
        }
      }
      touchStartXRef.current = null
      touchStartYRef.current = null
      horizontalLockRef.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [advance])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    advance(x > rect.width / 2 ? 'next' : 'prev')
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      dir: e.clientX - rect.left > rect.width / 2 ? 'next' : 'prev',
    })
  }
  const handleMouseLeave = () => setCursor(null)

  const gallery = (
    <div
      ref={galleryRef}
      className={`studio-gallery${className ? ' ' + className : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {slides.map((src, i) => {
        const N = slides.length
        let cls = 'studio-gallery-slide'
        if (src.includes('studio-gallery-00')) cls += ' studio-gallery-slide-cover'
        if (i === current) {
          if (direction === 'next') cls += ' studio-gallery-slide-enter-next'
          else if (direction === 'prev') cls += ' studio-gallery-slide-enter-prev'
          else cls += ' is-current'
        } else if (i === leaving) {
          cls += direction === 'next' ? ' studio-gallery-slide-leave-next' : ' studio-gallery-slide-leave-prev'
        } else {
          cls += ' is-hidden'
        }
        // Only paint the current slide, the one leaving, and the immediate
        // neighbours. Slides outside this window carry no background-image so
        // the browser never decodes them — keeps mobile memory bounded.
        const inWindow =
          i === current ||
          i === leaving ||
          i === (current + 1) % N ||
          i === (current - 1 + N) % N
        const inlineStyle = inWindow ? { backgroundImage: `url(${src})` } : undefined
        return (
          <div
            key={i}
            className={cls}
            style={inlineStyle}
          />
        )
      })}
      {cursor && (
        <div
          className="studio-gallery-cursor"
          style={{ left: cursor.x, top: cursor.y }}
          aria-hidden="true"
        >
          {cursor.dir === 'next' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="13 6 19 12 13 18"></polyline>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="11 6 5 12 11 18"></polyline>
            </svg>
          )}
        </div>
      )}
    </div>
  )

  return bare ? gallery : <div className="studio-gallery-pin">{gallery}</div>
}

const BELLA_SLIDES = [
  '/projects/belenko-interior-design-bella-cover2.jpg',
  '/projects/belenko-interior-design-bella-4.jpg',
  '/projects/belenko-interior-design-bella-8.jpg',
  '/projects/belenko-interior-design-bella-1.jpg',
  '/projects/belenko-interior-design-bella-3.jpg',
  '/projects/belenko-interior-design-bella-5.jpg',
  '/projects/belenko-interior-design-bella-2.jpg',
  '/projects/belenko-interior-design-bella-6.jpg',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-1.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-2.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-3.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-4.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-5.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-6.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-7.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-8.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-9.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-10.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-11.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-12.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-13.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-14.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-15.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-17.webp',
  '/projects/belenko-interior-design-bella-restaurant-dnipro-24.webp',
]

function MissionScrollReveal({ text }) {
  const ref = useRef(null)
  const orderRef = useRef([])

  useEffect(() => {
    if (!ref.current) return

    const letters = ref.current.querySelectorAll('.mission-letter')
    // Assign each letter a stable random reveal threshold in [0, 1]
    orderRef.current = Array.from(letters).map(() => Math.random())

    let rafId = null
    let lastProgress = -1
    const els = letters
    const update = () => {
      rafId = null
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight || 800
      // Nothing to do while the paragraph is far below or already fully revealed above.
      if (rect.top > vh * 1.5 && lastProgress === 0) return
      const start = vh
      const end = vh * 0.2
      const raw = (start - rect.top) / Math.max(1, start - end)
      const progress = Math.round(Math.max(0, Math.min(1, raw)) * 200) / 200
      if (progress === lastProgress) return
      lastProgress = progress
      // Per-letter reveal: each letter fades in over a short window centered
      // on its random threshold so the order looks scattered, not sequential.
      const window_ = 0.18
      els.forEach((el, i) => {
        const threshold = orderRef.current[i] ?? Math.random()
        const startAt = threshold * (1 - window_)
        const endAt = startAt + window_
        const p = Math.max(0, Math.min(1, (progress - startAt) / Math.max(0.0001, endAt - startAt)))
        el.style.opacity = String(p)
      })
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <p ref={ref} className="proposal-mission">
      {text.split(/(\s+)/).map((part, i) => {
        if (/^\s+$/.test(part)) return ' '
        return (
          <span key={i} className="mission-word">
            {part.split('').map((char, ci) => (
              <span key={ci} className="mission-letter">{char}</span>
            ))}
          </span>
        )
      })}
    </p>
  )
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Studio mission statement followed by the full About content (studio story,
// principles and stats from the earlier site) — always expanded, no toggle.
export function StudioMission({ more = false, setMore = () => {} }) {
  return (
    <div className="proposal-mission-block is-open">
      <h2 className="proposal-accordion-title proposal-about-title">About</h2>
      <p className="proposal-mission" lang="en">
        Barcelona-based, award-winning international hospitality studio. Through guest journey design, we create venues worldwide where interior, brand, and customer experience come together to make people fall in love — and come back
      </p>

      <div
        id="proposal-mission-details"
        className="proposal-mission-details is-open"
      >
        <div className="proposal-mission-details-inner">
          <figure className="proposal-mission-photo">
            <img
              src="/belenko-design-barcelona-interior-design-studio-team-office.webp"
              srcSet="/belenko-design-barcelona-interior-design-studio-team-office-m.webp 800w, /belenko-design-barcelona-interior-design-studio-team-office.webp 1122w"
              sizes="(max-width: 720px) 100vw, 1100px"
              width="1122"
              height="1402"
              alt="Belenko Design Studio team in the Barcelona office"
              loading="lazy"
            />
          </figure>
          <button
            type="button"
            className={`proposal-mission-more-btn${more ? ' is-open' : ''}`}
            aria-expanded={more}
            aria-controls="proposal-mission-more"
            onClick={() => setMore(!more)}
          >
            {more ? 'Show less' : 'Read more'}
            <span aria-hidden="true">{more ? '↑' : '↓'}</span>
          </button>
          <div id="proposal-mission-more" className={`proposal-mission-more${more ? ' is-open' : ''}`}>
          <div className="proposal-mission-more-inner">
          <p>
            Belenko Design Studio is a hospitality interior design studio founded in Barcelona by architect Denys Belenko in 2000. In 27 years the studio has designed 250 restaurants, bars, cafés, hotels and beach clubs in 11 countries across Europe, the Caucasus and the United States — over 538,000 sq ft of venues, from concept and interior to brand, FF&amp;E and opening.
          </p>
          <p>
            Instead of simply decorating spaces, the team focuses on creating a unique atmosphere and emotional experience for every visitor.
          </p>
          <p>
            At the heart of every concept is the guest and their impressions, allowing the space to become a living story. Founder Denys Belenko emphasizes that their work is aimed at designing feelings, not just external aesthetics.
          </p>
          <p>
            At the same time, creative exploration is always balanced with commercial efficiency, ensuring that design serves specific business goals. This approach allows the team to create expressive and distinctive spaces that stand out from standard solutions.
          </p>

          <h3 className="proposal-mission-subhead">Studio Principles</h3>

          <div className="proposal-mission-principle">
            <h4>Scenario as Foundation</h4>
            <p>We don&rsquo;t start with blueprints — we start with a legend. For us, every interior is a material embodiment of a scenario. We design not just walls, but feelings and states of being within them.</p>
          </div>
          <div className="proposal-mission-principle">
            <h4>Guest at the Center</h4>
            <p>The core value of any business is the visitor&rsquo;s experience. We create spaces where people feel like the main character. We work to ensure guests immerse themselves in the atmosphere, find interest in details, and want to return again.</p>
          </div>
          <div className="proposal-mission-principle">
            <h4>Living History and Craftsmanship</h4>
            <p>A good place shouldn&rsquo;t look &ldquo;sterile&rdquo; or new. We value things crafted by hand — they have life and uniqueness that mass production can&rsquo;t replicate. This creates the feeling of a lived-in space with its own history and character.</p>
          </div>
          <div className="proposal-mission-principle">
            <h4>Natural Textures and Warm Light</h4>
            <p>We favor wood, stone, brick, and metal — materials that age beautifully over time. We avoid imitations and primarily use warm-spectrum lighting. This combination creates tangible comfort and a sense of stability.</p>
          </div>

          <div className="proposal-mission-stats">
            <div className="proposal-mission-stat">
              <span className="num">27</span>
              <span className="lbl">Years of experience</span>
              <span className="desc">In launching successful hospitality and food &amp; beverage venues</span>
            </div>
            <div className="proposal-mission-stat">
              <span className="num">28</span>
              <span className="lbl">Team members</span>
              <span className="desc">Architects, designers, brand strategists, creators, and producers</span>
            </div>
            <div className="proposal-mission-stat">
              <span className="num">250</span>
              <span className="lbl">Projects</span>
              <span className="desc">Completed in 11 countries, covering more than 538,000 sq ft of designed atmosphere</span>
            </div>
          </div>

          <blockquote className="proposal-mission-founder">
            <p>&ldquo;The most expensive thing in a restaurant is an empty table.&rdquo;</p>
            <cite>— Denys Belenko</cite>
          </blockquote>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Positioning statement: letters fly in from random directions when the slide
// scrolls into view (replays each time it re-enters).
function FlyInStatement({ lines, className = 'proposal-statement-text proposal-statement-text--bold' }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting && e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  let k = 0
  return (
    <h2 ref={ref} className={`${className} proposal-flyin${on ? ' is-on' : ''}`} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} className="proposal-flyin-line" aria-hidden="true">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="proposal-flyin-word">
              {word.split('').map((ch, ci) => {
                const i = k++
                // deterministic pseudo-random offsets per letter
                const a = (i * 137.508) % 360
                const d = 70 + ((i * 53) % 90)
                const x = Math.round(Math.cos((a * Math.PI) / 180) * d)
                const y = Math.round(Math.sin((a * Math.PI) / 180) * d)
                const r = ((i * 29) % 41) - 20
                return (
                  <span key={ci} className="proposal-flyin-ch" style={{ '--dx': `${x}px`, '--dy': `${y}px`, '--dr': `${r}deg`, '--dl': `${i * 28}ms` }}>{ch}</span>
                )
              })}
            </span>
          ))}
        </span>
      ))}
    </h2>
  )
}

// Fixed top menu bar: logo pinned left, section links right. Transparent over
// the hero, gains a translucent dark backdrop once the page is scrolled.
function TopBar({ setServicesOpen, setPortfolioOpen }) {
  // Same behaviour as the Residential page header: full height at the top of
  // the page, hides while scrolling down, comes back compact (dark bar) when
  // scrolling up; the mobile menu is a dropdown panel under the bar.
  const [mode, setMode] = useState('top') // 'top' | 'compact' | 'hidden'
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY || 0
    let cur = 'top'
    const onScroll = () => {
      const y = window.scrollY || 0
      const d = y - lastY
      if (Math.abs(d) < 2 && y > 10) return
      lastY = y
      const next = y <= 10 ? 'top' : d > 0 ? 'hidden' : 'compact'
      if (next !== cur) {
        cur = next
        if (next === 'hidden') setMenuOpen(false)
        setMode(next)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Expand the target accordion so it opens already unfolded.
    if (id === 'services') setServicesOpen(true)
    if (id === 'portfolio') setPortfolioOpen(true)

    const el = document.getElementById(id)
    if (!el) return
    // Prefer the accordion header so the section's TITLE lands just under the
    // bar (its true beginning), not the empty top padding above it.
    const target =
      el.querySelector('.proposal-services-head, .proposal-portfolio-head') || el
    // The homepage panels are a sticky "stack": once scrolled, a stuck panel's
    // offsetTop / getBoundingClientRect report its *stuck* position, not its
    // place in the document. So compute the natural document position of the
    // stack child by summing the heights of the siblings above it (layout is
    // unaffected by sticky), then add the target's offset inside that child.
    // Defer a frame so any expand has been committed to the DOM before measuring.
    requestAnimationFrame(() => {
      const gap = 24
      const barH = 84
      const stack = el.closest('.proposal-stack')
      let y
      if (stack) {
        let child = el
        while (child.parentElement && child.parentElement !== stack) child = child.parentElement
        y = stack.getBoundingClientRect().top + window.scrollY
        for (let s = stack.firstElementChild; s && s !== child; s = s.nextElementSibling) {
          const cs = getComputedStyle(s)
          y += s.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0)
        }
        y += (parseFloat(getComputedStyle(child).marginTop) || 0)
        y += target.getBoundingClientRect().top - child.getBoundingClientRect().top
      } else {
        y = target.getBoundingClientRect().top + window.scrollY
      }
      window.scrollTo({ top: Math.max(0, y - barH - gap), behavior: 'smooth' })
    })
  }

  const cls = `proposal-topbar${menuOpen ? ' is-compact is-menu-open' : mode === 'hidden' ? ' is-hidden' : mode === 'compact' ? ' is-compact' : ''}`
  const links = [
    ['/projects', 'portfolio', 'Our Works'],
    ['/services', 'services', 'Services'],
    ['/about', 'about', 'About Us'],
    ['/awards', null, 'Awards'],
    ['/blog', null, 'Journal'],
    ['/career', null, 'Career'],
    ['/contact', 'contact', 'Contacts']
  ]
  const waIcon = (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" /></svg>
  )

  return (
    <header className={cls}>
      <div className="proposal-topbar-bar">
        <nav className="proposal-topbar-row" aria-label="Main">
          <a
            href="#top"
            className="proposal-topbar-logo"
            onClick={(e) => go(e, 'top')}
            aria-label="Belenko Studio — back to top"
          >
            <img src="/belenko-logo-footer.png" alt="Belenko" />
          </a>
          <div className="proposal-topbar-right">
            {links.map(([href, id, label]) => (
              <a key={label} className="proposal-topbar-link" href={href} onClick={id ? (e) => go(e, id) : undefined}>{label}</a>
            ))}
            <div className="proposal-topbar-icons">
              <button
                type="button"
                className="proposal-topbar-tip proposal-topbar-burger"
                data-tip="Menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg aria-hidden="true" width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 1h20M0 7h20M0 13h20" /></svg>
              </button>
              <a
                className="proposal-topbar-tip proposal-topbar-wa"
                data-tip="WhatsApp"
                href="https://wa.me/34671825489"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                {waIcon}
              </a>
            </div>
          </div>
        </nav>
        {menuOpen && (
          <div className="proposal-topbar-menu">
            {links.map(([href, id, label]) => (
              <a key={label} href={href} onClick={id ? (e) => go(e, id) : () => setMenuOpen(false)}>{label}</a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

// Contact section — copy of the Residential page's Contact block
// (submits via Web3Forms to office@).
export function HomeContactForm() {
  const [data, setData] = useState({ name: '', email: '', phone: '', city: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const ch = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (e.target.botcheck && e.target.botcheck.checked) return
    setStatus('sending')
    const { name, email, phone, city } = data
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'e88480f3-403a-4b70-aa15-80625df1c6db',
          to: 'office@belenko.design',
          subject: `New enquiry from ${name}`,
          from_name: name,
          name, email, phone: phone || '—', city: city || '—',
          message: `New enquiry from belenko.design\n\nName: ${name}\nEmail: ${email}\nPhone / WhatsApp: ${phone || '—'}\nCity: ${city || '—'}`
        })
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.success !== false) {
        if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Lead')
        setStatus('sent')
        setData({ name: '', email: '', phone: '', city: '' })
      } else {
        setStatus('error')
      }
    } catch (_) {
      setStatus('error')
    }
  }

  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const social = (href, label, svg) => (
    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="rcon-social">{svg}</a>
  )
  const field = (id, name, label, type, auto, required) => (
    <div className="rcon-field">
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
      <input className="rcon-input" id={id} name={name} type={type} autoComplete={auto} required={required} value={data[name]} onChange={ch} />
    </div>
  )

  return (
    <section id="contact" className="rcon" aria-label="Contact">
      <div className="rcon-head">
        <img src="/residential/belenko-mark-white.png" alt="" />
        <div>Contact</div>
      </div>
      <div className="rcon-row">
        <div className="rcon-left">
          <h2>Let&rsquo;s talk about<br />your project</h2>
          <div className="rcon-info">
            <div className="rcon-meta">VAT B21779202 / © Belenko Design 2026<br />Sq. Lesseps, 6<br />08023, Barcelona, Catalonia, Spain</div>
            <a href="https://wa.me/34671825489" target="_blank" rel="noopener noreferrer" aria-label="Write to us on WhatsApp: +34 671 825 489" className="rcon-phone">
              <span>+34 671 825 489</span>
              <span className="rcon-phone-icon"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" /></svg></span>
            </a>
            <div className="rcon-socials">
              {social('https://instagram.com/belenko', 'Instagram', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" /></svg>)}
              {social('https://t.me/belenko_studio', 'Telegram', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" /></svg>)}
              {social('https://es.pinterest.com/belenkodesign/', 'Pinterest', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9.5" /><path d="M10 20l2-10M9.5 13.5c-1.5-3 .5-6 3-6s4 2 3.5 4.5-2.5 4-4.5 2.5" /></svg>)}
              {social('https://www.linkedin.com/in/denisbelenko/', 'LinkedIn', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5c0-3.5 4.5-3.5 4.5 0V17" /></svg>)}
              {social('https://www.behance.net/studiobelenko', 'Behance', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><path d="M2 6h6.5a3 3 0 0 1 0 6H2zM2 12h7a3.2 3.2 0 0 1 0 6.4H2zM2 6v12.4M14.5 14.5h7.5c0-2.5-1.5-4-3.7-4s-3.8 1.6-3.8 4 1.6 4 3.8 4c1.6 0 2.8-.7 3.4-2M15.5 7h5.5" /></svg>)}
              {social('https://wa.me/34671825489', 'WhatsApp', <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" /></svg>)}
            </div>
          </div>
        </div>
        <div className="rcon-line" aria-hidden="true" />
        <form className="rcon-form" onSubmit={submit}>
          {field('cf-name', 'name', 'Name', 'text', 'name', true)}
          {field('cf-email', 'email', 'Email', 'email', 'email', true)}
          {field('cf-phone', 'phone', 'Phone / WhatsApp', 'tel', 'tel', false)}
          {field('cf-city', 'city', 'City', 'text', 'address-level2', false)}
          <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />
          <div className="rcon-actions">
            <button type="submit" className="rcon-send" disabled={status === 'sending'}>Send</button>
            <div role="status" aria-live="polite" className={`rcon-note${status === 'sent' || status === 'error' ? ' is-light' : ''}`}>
              {status === 'sending' && 'Sending…'}
              {status === 'sent' && 'Thank you. We will get back to you shortly.'}
              {status === 'error' && 'Something went wrong. Please write to office@belenko.design.'}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

// FAQ — visible on the page and mirrored as FAQPage structured data, so search
// engines and AI assistants (ChatGPT, Claude, Perplexity) can quote direct
// answers about the studio.
export const homeFaq = [
  {
    q: 'What does Belenko Design Studio do?',
    a: 'We are a Barcelona-based hospitality interior design studio. We design restaurants, bars, cafés, hotels and beach clubs as complete business products: concept and positioning, architecture and interior, brand identity, menu and guest experience, FF&E procurement and construction administration through to opening. Founded in 2000, 250 venues completed in 11 countries.'
  },
  {
    q: 'Do you work with clients in the United States?',
    a: 'Yes. We design hospitality venues across the U.S. (Florida, California, Texas, New York) and already have completed work in Sarasota, FL. For U.S. projects we partner with a local architect of record and general contractor, run the project remotely with site visits at the key stages, and design to ADA requirements.'
  },
  {
    q: 'How much does restaurant interior design cost?',
    a: 'Design fees depend on the scope, the size of the venue and its location. We offer three engagement models: a concept-and-interior package, a full-service package (design, FF&E procurement and construction administration), and consulting by the day. Every project receives a fixed-fee proposal after a first consultation, so you know the cost before work starts.'
  },
  {
    q: 'How long does a restaurant design project take?',
    a: 'Typically, concept and positioning take 3–4 weeks and the full design package 10–14 weeks; construction depends on the site and usually takes 4–7 months. From the first meeting to opening, most restaurants take 8–12 months.'
  },
  {
    q: 'What is included in a full-service project?',
    a: 'One team and one point of accountability from concept to opening: positioning, architecture and layout, interior design, lighting, brand identity, menu structure, uniforms, tableware, FF&E specification and procurement, construction documentation, construction administration and pre-opening support.'
  },
  {
    q: 'Can you audit an existing restaurant or review another studio\'s design?',
    a: 'Yes. Our Consulting / Audit service covers a location assessment before signing a lease, an audit of an operating venue that is losing guests, and a second opinion on a concept or design produced by another studio — on site or as a remote review.'
  },
  {
    q: 'Where is the studio based and which regions do you serve?',
    a: 'The studio is based in Barcelona, Spain, and works internationally — 250 venues in 11 countries, including Spain, Turkey, Azerbaijan, Moldova, Ukraine and the United States.'
  }
]

// Compact awards strip — three international wins, links to /awards.
function HomeAwards() {
  const wins = [
    { year: '2024', award: 'FoodInSpace Awards', status: 'Winner ×2', project: 'Pixi · Mamaliga' },
    { year: '2023', award: 'Kyoto Global Design Awards', status: 'Laureate', project: 'Nikos' },
    { year: '2022', award: 'Restaurant & Bar Design Awards', status: 'Winner', project: 'Nikos Greek Bistro' }
  ]
  return (
    <section className="proposal-awards" id="awards" aria-label="Awards">
      <div className="proposal-awards-head">
        <h2 className="proposal-awards-title">Awards &amp; Recognition</h2>
        <a href="/awards" className="proposal-awards-link">All awards →</a>
      </div>
      <div className="proposal-awards-grid">
        {wins.map((w) => (
          <a key={w.award} href="/awards" className="proposal-awards-item">
            <span className="proposal-awards-year">{w.year}</span>
            <span className="proposal-awards-name">{w.award}</span>
            <span className="proposal-awards-status">{w.status}</span>
            <span className="proposal-awards-project">{w.project}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function HomeFaq() {
  const [open, setOpen] = useState(null)
  return (
    <section className="proposal-faq" aria-label="Frequently asked questions" id="faq">
      <h2 className="proposal-faq-title">Questions we get asked</h2>
      <div className="proposal-faq-list">
        {homeFaq.map((item, i) => {
          const isOpen = open === i
          return (
            <article key={item.q} className={`proposal-faq-item${isOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="proposal-faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="proposal-faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="proposal-faq-a" hidden={!isOpen}>
                <p>{item.a}</p>
              </div>
            </article>
          )
        })}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: homeFaq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          })
        }}
      />
    </section>
  )
}

// World map before the footer: fades/scales in once it scrolls into view and
// then stays visible for good.
function WorldMapReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`proposal-map-stage${shown ? ' is-shown' : ''}`} aria-label="Where we have worked">
      <img
        src="/projects/belenko-interior-design-world-map-projects-v3.webp"
        alt="World map with Belenko Design Studio project locations: United States, Spain, Portugal, Ukraine, Moldova, Turkey, Azerbaijan, Central Asia"
        loading="lazy"
        draggable={false}
      />
    </section>
  )
}

// Shared elegant chevron used by the Services and Portfolio accordion heads.
function AccordionArrow() {
  return (
    <svg className="proposal-accordion-arrow" viewBox="0 0 64 22" fill="none" aria-hidden="true">
      <path d="M4 5 C 20 19, 44 19, 60 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 13 L32 18 L40 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Portfolio grid (from the earlier site) — always expanded.
function PortfolioSection() {
  return (
    <section id="portfolio" className="proposal-portfolio-wrap is-open" aria-label="Portfolio">
      <div className="proposal-portfolio-head is-static">
        <span className="proposal-accordion-title on-dark">Portfolio</span>
      </div>

      <div id="proposal-portfolio-list" className="proposal-portfolio-list is-open">
        <div className="proposal-portfolio-list-inner">
          <Portfolio />
        </div>
      </div>
    </section>
  )
}

function Sections() {
  const [openSlug, setOpenSlug] = useState(null)
  const switchTimerRef = useRef(null)

  const handleToggle = useCallback((slug) => {
    if (switchTimerRef.current) {
      clearTimeout(switchTimerRef.current)
      switchTimerRef.current = null
    }
    setOpenSlug((prev) => {
      if (prev === slug) return null
      if (prev !== null) {
        switchTimerRef.current = setTimeout(() => {
          setOpenSlug(slug)
          switchTimerRef.current = null
        }, 320)
        return null
      }
      return slug
    })
  }, [])

  return (
    <section id="services" className="proposal-sections">
      <div className="proposal-services-head is-static">
        <span className="proposal-accordion-title">Services</span>
      </div>

      <div id="proposal-services-list" className="proposal-services-list is-open">
        <div className="proposal-services-list-inner">
          {sections.map((s, i) => {
            const isOpen = openSlug === s.slug
            return (
              <article
                key={s.slug}
                data-slug={s.slug}
                className={`proposal-section-link in${isOpen ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  className="proposal-section"
                  aria-expanded={isOpen}
                  aria-controls={`section-panel-${s.slug}`}
                  onClick={() => handleToggle(s.slug)}
                >
                  <div className="proposal-section-num">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="proposal-section-content">
                    <div className="proposal-section-header">
                      <h3 className="proposal-section-title">{s.title}</h3>
                  <span
                    className="proposal-section-toggle"
                    aria-hidden="true"
                  >
                    <ExpandIcon />
                  </span>
                </div>
                <p className="proposal-section-body">{s.body}</p>
              </div>
            </button>
            <div
              id={`section-panel-${s.slug}`}
              className="proposal-section-panel"
              aria-hidden={!isOpen}
            >
              <div className="proposal-section-panel-clip">
                <div className="proposal-section-panel-inner">
                  {s.longDescription && (
                    <p className="proposal-section-long">{s.longDescription}</p>
                  )}
                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="proposal-section-bullets">
                      {s.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {s.link && (
                    <a href={s.link.href} className="proposal-section-cta">{s.link.label} →</a>
                  )}
                </div>
              </div>
            </div>
          </article>
        )
          })}
        </div>
      </div>
    </section>
  )
}

const HERO_SLIDES_DESKTOP = ['/belenko-studio-hero-1.jpg', '/belenko-studio-hero-2.jpg', '/belenko-studio-hero-3.jpg', '/belenko-studio-hero-4.jpg', '/belenko-studio-hero-5.jpg', '/belenko-studio-hero-6.jpg', '/belenko-studio-hero-7.jpg', '/belenko-studio-hero-8.jpg', '/belenko-studio-hero-9.jpg', '/belenko-studio-hero-10.jpg', '/belenko-studio-hero-11.jpg', '/belenko-studio-hero-12.jpg']
const HERO_SLIDES_MOBILE = ['/belenko-studio-hero-mobile-1.jpg', '/belenko-studio-hero-mobile-2.jpg', '/belenko-studio-hero-mobile-3.jpg', '/belenko-studio-hero-mobile-4.jpg', '/belenko-studio-hero-mobile-5.jpg', '/belenko-studio-hero-mobile-6.jpg', '/belenko-studio-hero-mobile-7.jpg', '/belenko-studio-hero-mobile-8.jpg', '/belenko-studio-hero-mobile-10.jpg', '/belenko-studio-hero-mobile-11.jpg', '/belenko-studio-hero-mobile-12.jpg', '/belenko-studio-hero-mobile-13.jpg', '/belenko-studio-hero-mobile-14.jpg', '/belenko-studio-hero-mobile-15.jpg', '/belenko-studio-hero-mobile-16.jpg', '/belenko-studio-hero-mobile-17.jpg', '/belenko-studio-hero-mobile-18.jpg']
const MOBILE_QUERY = '(max-width: 720px)'
const SLIDE_DURATION = 700
const FADE_DURATION = 3000
const AUTO_INTERVAL = 4000

function shuffleArray(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Only one project video plays at a time: starting one resets the active one.
let activeVideoReset = null
// Briefly ignore scroll-to-reset right after a resize so device rotation
// (which can fire a scroll) doesn't stop playback.
let suppressScrollResetUntil = 0

function PixiVideo() {
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const startedRef = useRef(false)
  const [started, setStarted] = useState(false)

  const playEl = (v) => {
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }

  // Return to the cover: pause, rewind, reload so the poster shows again
  // (never a black last frame). No-op when already on the cover.
  const reset = useCallback(() => {
    if (!startedRef.current) return
    startedRef.current = false
    if (activeVideoReset === reset) activeVideoReset = null
    setStarted(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      try { v.currentTime = 0 } catch (_) {}
      v.load()
    }
  }, [])

  const start = () => {
    const v = videoRef.current
    if (!v || startedRef.current) return
    if (activeVideoReset && activeVideoReset !== reset) activeVideoReset()
    startedRef.current = true
    activeVideoReset = reset
    v.muted = false
    v.volume = 1
    setStarted(true)
    playEl(v)
  }

  // Tapping the cover starts playback straight in full screen (the user
  // gesture is required for fullscreen, so both happen in the click handler).
  const onFrameClick = () => {
    if (startedRef.current) return
    start()
    enterFullscreen()
  }

  // Fullscreen the whole frame (not the <video>) so our own controls — the
  // close (×) and Full Screen buttons — stay visible on top of the player.
  // iPhone Safari has no element fullscreen: fall back to the native player.
  const enterFullscreen = () => {
    const v = videoRef.current
    const f = frameRef.current
    if (!v) return
    try {
      if (f && f.requestFullscreen) { f.requestFullscreen().catch(() => {}); return }
      if (f && f.webkitRequestFullscreen) { f.webkitRequestFullscreen(); return }
    } catch (_) {}
    const go = () => {
      try {
        if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
      } catch (_) {}
    }
    if (v.readyState >= 1) go()
    else v.addEventListener('loadedmetadata', go, { once: true })
  }

  const onFullScreenClick = (e) => {
    e.stopPropagation()
    start()
    enterFullscreen()
  }

  // Close: leave fullscreen if we are in it, stop and return to the cover.
  const onCloseClick = (e) => {
    e.stopPropagation()
    try {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen()
      else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen()
    } catch (_) {}
    reset()
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Pause + return to cover on stop, scroll, end, or fullscreen exit. The
    // pause handler is skipped while the native fullscreen player is up (so
    // pausing there doesn't kick back); the exit event handles that.
    const inFs = () => v.webkitDisplayingFullscreen || (document.fullscreenElement && (document.fullscreenElement === v || document.fullscreenElement.contains(v)))
    const onPause = () => { if (!inFs()) reset() }
    const onScroll = () => { if (Date.now() >= suppressScrollResetUntil) reset() }
    const onResize = () => { suppressScrollResetUntil = Date.now() + 700 }
    const onFsChange = () => { if (!document.fullscreenElement) reset() }
    v.addEventListener('ended', reset)
    v.addEventListener('pause', onPause)
    v.addEventListener('webkitendfullscreen', reset)
    document.addEventListener('fullscreenchange', onFsChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      v.removeEventListener('ended', reset)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('webkitendfullscreen', reset)
      document.removeEventListener('fullscreenchange', onFsChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [reset])

  return (
    <div
      ref={frameRef}
      className={`proposal-pixi-frame${started ? ' is-playing' : ' is-idle'}`}
      onClick={onFrameClick}
    >
      <video
        ref={videoRef}
        className="proposal-pixi-video"
        src="/projects/pixi.mp4"
        poster="/projects/belenko-interior-design-pixi-poster2-2x.webp"
        controls={started}
        playsInline
        preload="metadata"
      />
      {!started && (
        <picture className="proposal-pixi-cover">
          <source media="(max-width: 720px)" srcSet="/projects/belenko-interior-design-pixi-poster-mobile-2x.webp" />
          <img src="/projects/belenko-interior-design-pixi-poster2-2x.webp" alt="Pixi Istanbul" draggable={false} />
        </picture>
      )}
      {started && (
        <div className="vmod-controls">
          <button type="button" className="vmod-fs-btn" onClick={onFullScreenClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Full Screen
          </button>
          <button type="button" className="vmod-close-btn" aria-label="Close video" onClick={onCloseClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// Reusable click-to-play video module (cover + sound + return-to-cover, and a
// rotated/upright full-screen overlay on phones). `landscape` rotates 90° for
// landscape clips; portrait clips fill the phone screen as-is.
function VideoModule({ src, poster, posterMobile, landscape = false }) {
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const startedRef = useRef(false)
  const [started, setStarted] = useState(false)

  const reset = useCallback(() => {
    if (!startedRef.current) return
    startedRef.current = false
    if (activeVideoReset === reset) activeVideoReset = null
    setStarted(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      try { v.currentTime = 0 } catch (_) {}
      v.load()
    }
  }, [])

  const start = () => {
    const v = videoRef.current
    if (!v || startedRef.current) return
    if (activeVideoReset && activeVideoReset !== reset) activeVideoReset()
    startedRef.current = true
    activeVideoReset = reset
    v.muted = false
    v.volume = 1
    setStarted(true)
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }

  // Tapping the cover starts playback straight in full screen (the user
  // gesture is required for fullscreen, so both happen in the click handler).
  const onFrameClick = () => {
    if (startedRef.current) return
    start()
    enterFullscreen()
  }

  // Fullscreen the whole frame (not the <video>) so our own controls — the
  // close (×) and Full Screen buttons — stay visible on top of the player.
  // iPhone Safari has no element fullscreen: fall back to the native player.
  const enterFullscreen = () => {
    const v = videoRef.current
    const f = frameRef.current
    if (!v) return
    try {
      if (f && f.requestFullscreen) { f.requestFullscreen().catch(() => {}); return }
      if (f && f.webkitRequestFullscreen) { f.webkitRequestFullscreen(); return }
    } catch (_) {}
    const go = () => {
      try {
        if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
      } catch (_) {}
    }
    if (v.readyState >= 1) go()
    else v.addEventListener('loadedmetadata', go, { once: true })
  }

  const onFullScreenClick = (e) => {
    e.stopPropagation()
    start()
    enterFullscreen()
  }

  // Close: leave fullscreen if we are in it, stop and return to the cover.
  const onCloseClick = (e) => {
    e.stopPropagation()
    try {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen()
      else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen()
    } catch (_) {}
    reset()
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const inFs = () => v.webkitDisplayingFullscreen || (document.fullscreenElement && (document.fullscreenElement === v || document.fullscreenElement.contains(v)))
    const onPause = () => { if (!inFs()) reset() }
    const onScroll = () => { if (Date.now() >= suppressScrollResetUntil) reset() }
    const onResize = () => { suppressScrollResetUntil = Date.now() + 700 }
    const onFsChange = () => { if (!document.fullscreenElement) reset() }
    v.addEventListener('ended', reset)
    v.addEventListener('pause', onPause)
    v.addEventListener('webkitendfullscreen', reset)
    document.addEventListener('fullscreenchange', onFsChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      v.removeEventListener('ended', reset)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('webkitendfullscreen', reset)
      document.removeEventListener('fullscreenchange', onFsChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [reset])

  return (
    <div
      ref={frameRef}
      className={`vmod-frame${started ? ' is-playing' : ' is-idle'}${landscape ? ' is-landscape' : ''}`}
      onClick={onFrameClick}
    >
      <video
        ref={videoRef}
        className="vmod-video"
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="metadata"
      />
      {!started && (
        <picture className="vmod-cover">
          {posterMobile && <source media="(max-width: 720px)" srcSet={posterMobile} />}
          <img src={poster} alt="" draggable={false} />
        </picture>
      )}
      {started && (
        <div className="vmod-controls">
          <button type="button" className="vmod-fs-btn" onClick={onFullScreenClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Full Screen
          </button>
          <button type="button" className="vmod-close-btn" aria-label="Close video" onClick={onCloseClick}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default function ClientLanding() {
  const heroRef = useRef(null)
  const sectionLinksRef = useRef(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [aboutMore, setAboutMore] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [shuffledSlides, setShuffledSlides] = useState(null)
  const heroSlides = shuffledSlides
    ? (isMobileViewport ? shuffledSlides.mobile : shuffledSlides.desktop)
    : (isMobileViewport ? HERO_SLIDES_MOBILE : HERO_SLIDES_DESKTOP)
  const heroSlidesRef = useRef(HERO_SLIDES_DESKTOP)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [leavingSlide, setLeavingSlide] = useState(null)
  const [direction, setDirection] = useState(null)
  const [transitionKey, setTransitionKey] = useState(0)
  const currentSlideRef = useRef(0)
  const autoTimerRef = useRef(null)
  const clearLeaveTimerRef = useRef(null)
  const touchStartXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const justSwipedRef = useRef(false)

  useEffect(() => {
    document.documentElement.classList.add('client-proposal-bg')
    return () => document.documentElement.classList.remove('client-proposal-bg')
  }, [])

  // Track viewport to swap horizontal/vertical slide sets
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobileViewport(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Shuffle slide order once per visit (client-only to avoid SSR mismatch)
  useEffect(() => {
    setShuffledSlides({
      desktop: shuffleArray(HERO_SLIDES_DESKTOP),
      mobile: shuffleArray(HERO_SLIDES_MOBILE)
    })
  }, [])

  // Keep slide-set ref in sync and reset the slider when set changes
  useEffect(() => {
    heroSlidesRef.current = heroSlides
    currentSlideRef.current = 0
    setCurrentSlide(0)
    setLeavingSlide(null)
    setDirection(null)
  }, [heroSlides])

  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [heroSlides])

  const goTo = useCallback((dir) => {
    const slides = heroSlidesRef.current
    if (slides.length <= 1) return
    const cur = currentSlideRef.current
    const N = slides.length
    const next = dir === 'prev' ? (cur - 1 + N) % N : (cur + 1) % N
    currentSlideRef.current = next
    setLeavingSlide(cur)
    setCurrentSlide(next)
    setDirection(dir)
    setTransitionKey((k) => k + 1)

    const duration = dir === 'fade' ? FADE_DURATION : SLIDE_DURATION
    if (clearLeaveTimerRef.current) clearTimeout(clearLeaveTimerRef.current)
    clearLeaveTimerRef.current = setTimeout(() => {
      setLeavingSlide(null)
      setDirection(null)
    }, duration + 80)

    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    autoTimerRef.current = setTimeout(() => goTo('fade'), AUTO_INTERVAL)
  }, [])

  useEffect(() => {
    autoTimerRef.current = setTimeout(() => goTo('fade'), AUTO_INTERVAL)
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
      if (clearLeaveTimerRef.current) clearTimeout(clearLeaveTimerRef.current)
    }
  }, [goTo])

  const handleHeroClick = (e) => {
    if (heroSlidesRef.current.length <= 1) return
    if (justSwipedRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    goTo(x > rect.width / 2 ? 'next' : 'prev')
  }

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartXRef.current
    const dy = e.changedTouches[0].clientY - touchStartYRef.current
    touchStartXRef.current = null
    touchStartYRef.current = null
    // Swipe must be predominantly horizontal and exceed threshold
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      justSwipedRef.current = true
      goTo(dx < 0 ? 'next' : 'prev')
      setTimeout(() => { justSwipedRef.current = false }, 400)
    }
  }



  useEffect(() => {
    let rafId = null
    let entryRafId = null
    const mountTime = performance.now()
    const ENTRY_DURATION = 1200
    const MAX_SECTION_SHIFT = 80

    const update = () => {
      rafId = null
      const scrollY = window.scrollY
      const vh = window.innerHeight
      // Hero backgrounds — entry animation + scroll parallax (left slides L, right slides R).
      // Skipped once the hero has scrolled out of view: nothing visible changes and the
      // style writes would only cost paint time on phones.
      const heroVisible = heroRef.current && scrollY < (heroRef.current.offsetHeight || vh) + 40
      if (heroVisible) {
        const elapsed = performance.now() - mountTime
        const progress = Math.min(1, elapsed / ENTRY_DURATION)
        const eased = 1 - Math.pow(1 - progress, 4)
        const heroWidth = heroRef.current.offsetWidth || window.innerWidth
        const entryShiftLeft = -heroWidth * (1 - eased)
        const entryShiftRight = heroWidth * (1 - eased)
        const maxScroll = window.innerWidth
        const scrollClamped = Math.min(scrollY, maxScroll)
        heroRef.current.style.setProperty(
          '--hero-bg-shift',
          `${-scrollClamped + entryShiftLeft}px`
        )
        heroRef.current.style.setProperty(
          '--hero-bg-shift-right',
          `${scrollClamped + entryShiftRight}px`
        )
        // Mobile: vertical parallax — background flies upward faster than the screen
        heroRef.current.style.setProperty(
          '--hero-bg-shift-y',
          `${-scrollY * (window.innerWidth <= 720 ? 0.8 : 0.4)}px`
        )
      }
      // Sections — slide-in-from-right when entering and slide-out-to-right when leaving.
      // Read every rect first, then write every style: interleaving the two forces a
      // layout per row (the main source of scroll jank here on phones).
      const vCenter = vh / 2
      const links = sectionLinksRef.current || (sectionLinksRef.current = Array.from(document.querySelectorAll('.proposal-section-link')))
      if (links.length) {
        const vw = window.innerWidth
        const reads = links.map((el) => {
          const rect = el.getBoundingClientRect()
          const currentShift = parseFloat(el.style.getPropertyValue('--section-shift')) || 0
          return { el, rect, currentShift }
        })
        for (const { el, rect, currentShift } of reads) {
          // Rows far outside the viewport keep their last value.
          if (rect.bottom < -vh || rect.top > vh * 2) continue
          const elCenter = rect.top + rect.height / 2
          const normalized = Math.min(1, Math.abs(elCenter - vCenter) / vh)
          // Never push the row (and its chevron) past the viewport's right edge:
          // cap the shift by the free space to the right of the unshifted row.
          const freeRight = vw - (rect.right - currentShift) - 16
          const shift = Math.max(0, Math.min(normalized * MAX_SECTION_SHIFT, freeRight))
          if (Math.abs(shift - currentShift) > 0.5) el.style.setProperty('--section-shift', `${shift}px`)
        }
      }
    }
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }
    const entryTick = () => {
      update()
      if (performance.now() - mountTime < ENTRY_DURATION) {
        entryRafId = requestAnimationFrame(entryTick)
      } else {
        entryRafId = null
      }
    }
    sectionLinksRef.current = null
    entryTick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      if (entryRafId) cancelAnimationFrame(entryRafId)
    }
  }, [])

  // Pin the LAST screen of the services-texts section so the cards after it
  // (Bella on mobile, and the final Cent Aura / Nikos videos) slide up over a
  // held panel — the same overlay effect the texts have over the Studio
  // gallery. A multi-screen section can't pin at top:0 (that would freeze its
  // first screen and hide the rest), so we offset the sticky top by the
  // overflow height: the section scrolls through, then its final screen sticks
  // while the next card rides over it. Applied on every width.
  useEffect(() => {
    const sec = document.querySelector('.proposal-sections')
    if (!sec) return
    const apply = () => {
      const overflow = sec.offsetHeight - window.innerHeight
      sec.style.top = overflow > 0 ? `${-overflow}px` : '0px'
    }
    apply()
    const settle = setTimeout(apply, 600)
    window.addEventListener('resize', apply)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null
    if (ro) ro.observe(sec)
    return () => {
      window.removeEventListener('resize', apply)
      clearTimeout(settle)
      if (ro) ro.disconnect()
    }
  }, [])

  return (
    <main className="proposal">
      <TopBar setServicesOpen={setServicesOpen} setPortfolioOpen={setPortfolioOpen} />
      <div className="proposal-stack">
      <header
        ref={heroRef}
        className="proposal-hero"
        onClick={handleHeroClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="proposal-hero-slides" aria-hidden="true">
          {heroSlides.map((src, i) => {
            const isCurrent = i === currentSlide
            const isLeaving = i === leavingSlide
            let cls = 'proposal-hero-slide'
            if (isLeaving && direction) {
              cls += ` proposal-hero-slide-leave-${direction}`
            } else if (isCurrent && direction) {
              cls += ` proposal-hero-slide-enter-${direction} is-current`
            } else if (isCurrent) {
              cls += ' is-current'
            } else {
              cls += ' is-hidden'
            }
            // Only the visible slide(s) get a background: a dozen full-screen
            // layers with images is what made phones drop frames while scrolling.
            const visible = isCurrent || isLeaving
            return (
              <div
                key={`${isMobileViewport ? 'm' : 'd'}-${i}`}
                className={cls}
                style={visible ? { backgroundImage: `url(${src})` } : { display: 'none' }}
              />
            )
          })}
        </div>
        <img
          className="proposal-hero-title"
          src="/custom-hospitality.png"
          alt="Custom Hospitality"
          draggable={false}
        />
        <a
          className="bk-scroll"
          href="#intro-film"
          aria-label="Scroll down"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const next = e.currentTarget.closest('header')?.nextElementSibling
            if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          <span>Scroll</span>
          <svg aria-hidden="true" width="14" height="34" viewBox="0 0 14 34" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1v31M1.5 26.5L7 32l5.5-5.5" /></svg>
        </a>
      </header>

      <section className="proposal-intro-video-stage" aria-label="Intro film">
        <VideoModule src="/projects/intro.mp4" poster="/projects/belenko-interior-design-intro-poster-2x.webp" />
      </section>

      <section className="proposal-statement" aria-label="Studio positioning">
        <FlyInStatement lines={['Creative Design Studio', 'for Hospitality Business']} />
      </section>

      <div className="studio-gallery-pin proposal-galleries-row">
        <StudioGallery
          bare
          slides={[
            '/studio-gallery-00.jpg',
            '/studio-gallery-01.jpg',
            '/studio-gallery-02.jpg',
            '/studio-gallery-03.jpg',
            '/studio-gallery-04.jpg',
            '/studio-gallery-05.jpg',
            '/studio-gallery-06.jpg',
            '/studio-gallery-07.jpg',
            '/studio-gallery-08.jpg',
            '/studio-gallery-09.jpg',
            '/studio-gallery-11.jpg',
            '/studio-gallery-12.jpg',
            '/studio-gallery-13.jpg',
            '/studio-gallery-14.jpg',
            '/studio-gallery-15.jpg',
            '/studio-gallery-16.jpg',
            '/studio-gallery-17.jpg',
            '/studio-gallery-18.jpg',
            '/studio-gallery-19.jpg',
            '/studio-gallery-20.jpg',
            '/studio-gallery-21.jpg',
            '/studio-gallery-22.jpg',
            '/studio-gallery-23.jpg',
            '/studio-gallery-24.jpg',
            '/studio-gallery-25.jpg',
            '/studio-gallery-26.jpg',
            '/studio-gallery-27.jpg',
          ]}
        />
        <StudioGallery bare slides={BELLA_SLIDES} className="proposal-gallery-bella-inline" />
      </div>

      <section className="proposal-bella-stage">
        <StudioGallery bare slides={BELLA_SLIDES} />
      </section>

      <section className="proposal-pixi-stage" aria-label="Pixi Istanbul">
        <PixiVideo />
      </section>

      <section className="proposal-statement proposal-statement--concept" aria-label="Our approach">
        <FlyInStatement lines={['We create the concept:', 'from the first idea on a napkin', 'to the first guests']} />
      </section>

      <section className="proposal-modules-row" aria-label="Projects">
        <VideoModule src="/projects/agata.mp4" poster="/projects/belenko-interior-design-agata-poster2-2x.webp" />
        <VideoModule src="/projects/video3.mp4" poster="/projects/belenko-interior-design-video3-poster-2x.webp" />
      </section>


      <section className="proposal-saint-stage" aria-label="Saint Bar">
        <VideoModule src="/projects/saint.mp4" poster="/projects/belenko-interior-design-saint-poster2-2x.webp" posterMobile="/projects/belenko-interior-design-saint-poster-mobile-2x.webp" landscape />
      </section>

      <section className="proposal-statement proposal-statement--branding" aria-label="Branding">
        <FlyInStatement lines={['Branding that', 'reinforces the concept']} />
        <a href="/branding" className="proposal-statement-link">See our branding work →</a>
      </section>


      <section className="proposal-modules-row proposal-monkeys-row" aria-label="12 Monkeys">
        <VideoModule src="/projects/monkeys2.mp4" poster="/projects/belenko-interior-design-monkeys2-poster3-2x.webp" />
      </section>

      <section className="proposal-modules-row proposal-final-row" aria-label="Projects">
        <VideoModule src="/projects/final.mp4" poster="/projects/belenko-interior-design-cent-aura-poster-2x.webp" />
        <VideoModule src="/projects/nikos.mp4" poster="/projects/belenko-interior-design-nikos-poster2-2x.webp" />
      </section>

      <Sections servicesOpen={servicesOpen} setServicesOpen={setServicesOpen} />

      <PortfolioSection open={portfolioOpen} setOpen={setPortfolioOpen} />

      <section id="about" className="proposal-mission-stage">
        <StudioMission more={aboutMore} setMore={setAboutMore} />
      </section>

      <section className={`proposal-who proposal-mission-more${aboutMore ? ' is-open' : ''}`} aria-label="Who we work with" aria-hidden={!aboutMore}>
        <div className="proposal-mission-more-inner">
        <h2 className="proposal-who-title">Who we work with</h2>
        <div className="proposal-who-grid">
          <article className="proposal-who-item">
            <h3>Restaurant Groups</h3>
            <p>New concepts, flagships and rollouts.</p>
          </article>
          <article className="proposal-who-item">
            <h3>Independent Restaurateurs</h3>
            <p>Chef-driven and destination restaurants.</p>
          </article>
          <article className="proposal-who-item">
            <h3>Hotel &amp; Resort Developers</h3>
            <p>Boutique hotels, F&amp;B and lifestyle hospitality.</p>
          </article>
          <article className="proposal-who-item">
            <h3>Investors &amp; Developers</h3>
            <p>Hospitality concepts built around commercial performance.</p>
          </article>
        </div>
        </div>
      </section>

      <HomeAwards />

      <HomeFaq />

      <HomeContactForm />

      <WorldMapReveal />

      <div className="proposal-outro">
        <div className="proposal-glitch-btn-wrap">
          <GlitchButton />
        </div>
        <ProposalFooter />
      </div>
      </div>
    </main>
  )
}
