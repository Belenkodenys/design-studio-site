'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { sections } from './sections'
import ProposalFooter from './ProposalFooter'
import './ClientLanding.css'

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
  '/projects/bella-cover2.jpg',
  '/projects/bella-4.jpg',
  '/projects/bella-8.jpg',
  '/projects/bella-1.jpg',
  '/projects/bella-3.jpg',
  '/projects/bella-5.jpg',
  '/projects/bella-2.jpg',
  '/projects/bella-6.jpg',
  '/projects/bella-restaurant-dnipro-1.webp',
  '/projects/bella-restaurant-dnipro-2.webp',
  '/projects/bella-restaurant-dnipro-3.webp',
  '/projects/bella-restaurant-dnipro-4.webp',
  '/projects/bella-restaurant-dnipro-5.webp',
  '/projects/bella-restaurant-dnipro-6.webp',
  '/projects/bella-restaurant-dnipro-7.webp',
  '/projects/bella-restaurant-dnipro-8.webp',
  '/projects/bella-restaurant-dnipro-9.webp',
  '/projects/bella-restaurant-dnipro-10.webp',
  '/projects/bella-restaurant-dnipro-11.webp',
  '/projects/bella-restaurant-dnipro-12.webp',
  '/projects/bella-restaurant-dnipro-13.webp',
  '/projects/bella-restaurant-dnipro-14.webp',
  '/projects/bella-restaurant-dnipro-15.webp',
  '/projects/bella-restaurant-dnipro-17.webp',
  '/projects/bella-restaurant-dnipro-24.webp',
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
    const update = () => {
      rafId = null
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight || 800
      const start = vh
      const end = vh * 0.2
      const raw = (start - rect.top) / Math.max(1, start - end)
      const progress = Math.max(0, Math.min(1, raw))
      const els = ref.current.querySelectorAll('.mission-letter')
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

function Sections() {
  const [openSlug, setOpenSlug] = useState(null)
  const [revealedSlugs, setRevealedSlugs] = useState(() => new Set())
  const itemRefs = useRef({})
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

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealedSlugs(new Set(sections.map((s) => s.slug)))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.dataset.slug
            setRevealedSlugs((prev) => {
              if (prev.has(slug)) return prev
              const next = new Set(prev)
              next.add(slug)
              return next
            })
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    Object.values(itemRefs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="proposal-sections">
      {sections.map((s, i) => {
        const isOpen = openSlug === s.slug
        const isIn = revealedSlugs.has(s.slug)
        return (
          <article
            key={s.slug}
            ref={(el) => { itemRefs.current[s.slug] = el }}
            data-slug={s.slug}
            className={`proposal-section-link${isOpen ? ' is-open' : ''}${isIn ? ' in' : ''}`}
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
                  <h2 className="proposal-section-title">{s.title}</h2>
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
                </div>
              </div>
            </div>
          </article>
        )
      })}
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

export default function ClientLanding() {
  const heroRef = useRef(null)
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
      // Hero backgrounds — entry animation + scroll parallax (left slides L, right slides R)
      if (heroRef.current) {
        const elapsed = performance.now() - mountTime
        const progress = Math.min(1, elapsed / ENTRY_DURATION)
        const eased = 1 - Math.pow(1 - progress, 4)
        const heroWidth = heroRef.current.offsetWidth || window.innerWidth
        const entryShiftLeft = -heroWidth * (1 - eased)
        const entryShiftRight = heroWidth * (1 - eased)
        const maxScroll = window.innerWidth
        const scrollClamped = Math.min(window.scrollY, maxScroll)
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
          `${-window.scrollY * (window.innerWidth <= 720 ? 0.8 : 0.4)}px`
        )
      }
      // Sections — slide-in-from-right when entering and slide-out-to-right when leaving
      const vh = window.innerHeight
      const vCenter = vh / 2
      document.querySelectorAll('.proposal-section-link').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height / 2
        const dist = Math.abs(elCenter - vCenter)
        const normalized = Math.min(1, dist / vh)
        const shift = normalized * MAX_SECTION_SHIFT
        el.style.setProperty('--section-shift', `${shift}px`)
      })
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

  // Pin the LAST screen of the services-texts section so the stacked Bella
  // gallery slides up over a held panel — the same overlay effect the texts
  // have over the Studio gallery. A multi-screen section can't pin at top:0
  // (that would freeze its first screen and hide the rest), so we offset the
  // sticky top by the overflow height: the section scrolls through normally,
  // then its final screen sticks while Bella rides over it. Only below the
  // side-by-side breakpoint, where the stacked Bella exists.
  useEffect(() => {
    const sec = document.querySelector('.proposal-sections')
    if (!sec) return
    const apply = () => {
      if (window.innerWidth >= 1300) {
        sec.style.top = ''
        return
      }
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
            return (
              <div
                key={`${isMobileViewport ? 'm' : 'd'}-${i}`}
                className={cls}
                style={{ backgroundImage: `url(${src})` }}
              />
            )
          })}
        </div>
        <div className="proposal-wordmark-wrap">
          <div className="proposal-wordmark-belenko">BELENKO</div>
          <div className="proposal-wordmark-studio">STUDIO</div>
        </div>
      </header>

      <section className="proposal-mission-stage">
        <p className="proposal-mission">
          Barcelona-based, award-winning international hospitality studio creating venues worldwide where interior, brand, and guest experience come together to make people fall in love — and come back
        </p>
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

      <Sections />

      <section className="proposal-bella-stage">
        <StudioGallery bare slides={BELLA_SLIDES} />
      </section>

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
