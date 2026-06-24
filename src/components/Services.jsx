import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './Services.css'

const services = [
  { url: '/services/concept-positioning/' },
  { url: '/services/architecture/' },
  { url: '/services/interior-design/' },
  { url: '/services/decor-furniture/' },
  { url: '/services/branding/' },
  { url: '/services/creative-content/' },
  { url: '/services/author-supervision/' }
]

function Services() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })
  const [blurAmount, setBlurAmount] = useState(0)
  const carouselRef = useRef(null)

  // Smooth scroll state - Lenis-style
  const state = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    targetScroll: 0,
    currentScroll: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    isAnimating: false,
    rafId: null,
    isSnapping: false,
    hasDragged: false
  })

  // Lenis-style lerp - very smooth
  const lerp = (start, end, factor) => start + (end - start) * factor

  // Main animation loop - runs continuously like Lenis
  const smoothScroll = useCallback(() => {
    const s = state.current
    if (!carouselRef.current) return

    // Calculate the difference
    const diff = s.targetScroll - s.currentScroll

    // Use faster lerp when snapping, slower when dragging
    const lerpFactor = s.isSnapping ? 0.08 : 0.025
    s.currentScroll = lerp(s.currentScroll, s.targetScroll, lerpFactor)

    // Apply to DOM
    carouselRef.current.scrollLeft = s.currentScroll

    // Calculate speed for blur effect
    const speed = Math.abs(diff)
    const newBlur = Math.min(speed * 0.008, 3)
    setBlurAmount(newBlur)

    // Continue animation if still moving
    if (Math.abs(diff) > 0.5 || s.isDragging) {
      s.rafId = requestAnimationFrame(smoothScroll)
    } else {
      s.isAnimating = false
      s.isSnapping = false
      setBlurAmount(0)
    }
  }, [])

  const startAnimation = useCallback(() => {
    const s = state.current
    if (!s.isAnimating) {
      s.isAnimating = true
      s.rafId = requestAnimationFrame(smoothScroll)
    }
  }, [smoothScroll])

  // Get boundaries
  const getBounds = useCallback(() => {
    if (!carouselRef.current) return { min: 0, max: 0 }
    const el = carouselRef.current
    return {
      min: 0,
      max: el.scrollWidth - el.clientWidth
    }
  }, [])

  // Clamp scroll position
  const clampScroll = useCallback((value) => {
    const bounds = getBounds()
    return Math.max(bounds.min, Math.min(bounds.max, value))
  }, [getBounds])

  // Find nearest snap point (card center) - for mobile only
  const getSnapPoint = useCallback((scrollPos) => {
    if (!carouselRef.current) return scrollPos

    const carousel = carouselRef.current
    const slides = carousel.querySelectorAll('.service-slide')
    if (!slides.length) return scrollPos

    const containerCenter = carousel.clientWidth / 2
    let nearestSnap = scrollPos
    let minDistance = Infinity

    slides.forEach((slide) => {
      const slideLeft = slide.offsetLeft
      const slideCenter = slideLeft + slide.offsetWidth / 2
      const snapPosition = slideCenter - containerCenter
      const distance = Math.abs(scrollPos - snapPosition)

      if (distance < minDistance) {
        minDistance = distance
        nearestSnap = snapPosition
      }
    })

    return clampScroll(nearestSnap)
  }, [clampScroll])

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    const s = state.current
    s.isDragging = true
    s.hasDragged = false
    s.startX = e.clientX
    s.lastX = e.clientX
    s.startScrollLeft = carouselRef.current?.scrollLeft || 0
    s.currentScroll = s.startScrollLeft
    s.targetScroll = s.startScrollLeft
    s.lastTime = performance.now()
    s.velocity = 0

    carouselRef.current?.classList.add('dragging')
    startAnimation()
  }, [startAnimation])

  const handleMouseMove = useCallback((e) => {
    const s = state.current
    if (!s.isDragging) return
    e.preventDefault()

    const now = performance.now()
    const dt = now - s.lastTime
    const dx = e.clientX - s.lastX

    // Mark as dragged if moved more than 5px
    const totalDelta = Math.abs(s.startX - e.clientX)
    if (totalDelta > 5) {
      s.hasDragged = true
    }

    // Track velocity with smoothing
    if (dt > 0) {
      const instantVelocity = dx / dt
      s.velocity = lerp(s.velocity, instantVelocity, 0.4)
    }

    s.lastX = e.clientX
    s.lastTime = now

    // Update target scroll
    const delta = s.startX - e.clientX
    s.targetScroll = clampScroll(s.startScrollLeft + delta)
  }, [clampScroll])

  const handleMouseUp = useCallback(() => {
    const s = state.current
    if (!s.isDragging) return
    s.isDragging = false

    carouselRef.current?.classList.remove('dragging')

    // Apply momentum - multiply velocity for smooth glide
    const momentum = s.velocity * 800
    s.targetScroll = clampScroll(s.targetScroll - momentum)
  }, [clampScroll])

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    const s = state.current
    const touch = e.touches[0]
    s.isDragging = true
    s.hasDragged = false
    s.startX = touch.clientX
    s.lastX = touch.clientX
    s.startScrollLeft = carouselRef.current?.scrollLeft || 0
    s.currentScroll = s.startScrollLeft
    s.targetScroll = s.startScrollLeft
    s.lastTime = performance.now()
    s.velocity = 0

    carouselRef.current?.classList.add('dragging')
    startAnimation()
  }, [startAnimation])

  const handleTouchMove = useCallback((e) => {
    const s = state.current
    if (!s.isDragging) return

    const touch = e.touches[0]
    const now = performance.now()
    const dt = now - s.lastTime
    const dx = touch.clientX - s.lastX

    // Mark as dragged if moved more than 5px
    const totalDelta = Math.abs(s.startX - touch.clientX)
    if (totalDelta > 5) {
      s.hasDragged = true
    }

    if (dt > 0) {
      const instantVelocity = dx / dt
      s.velocity = lerp(s.velocity, instantVelocity, 0.4)
    }

    s.lastX = touch.clientX
    s.lastTime = now

    const delta = s.startX - touch.clientX
    s.targetScroll = clampScroll(s.startScrollLeft + delta)
  }, [clampScroll])

  const handleTouchEnd = useCallback(() => {
    const s = state.current
    if (!s.isDragging) return
    s.isDragging = false

    carouselRef.current?.classList.remove('dragging')

    // Apply reduced momentum for better snap control
    const momentum = s.velocity * 400
    const scrollAfterMomentum = clampScroll(s.targetScroll - momentum)

    // Enable snapping mode and snap to nearest card center
    s.isSnapping = true
    s.targetScroll = getSnapPoint(scrollAfterMomentum)
  }, [clampScroll, getSnapPoint])

  // Wheel handler for trackpad/mouse wheel
  const handleWheel = useCallback((e) => {
    // Only handle horizontal scroll or shift+scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault()
      const s = state.current
      const delta = e.deltaX || e.deltaY
      s.targetScroll = clampScroll(s.targetScroll + delta)
      startAnimation()
    }
  }, [clampScroll, startAnimation])

  // Prevent link navigation if dragged
  const handleLinkClick = useCallback((e) => {
    if (state.current.hasDragged) {
      e.preventDefault()
    }
  }, [])

  // Initialize and cleanup
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      state.current.currentScroll = carousel.scrollLeft
      state.current.targetScroll = carousel.scrollLeft

      // Add wheel listener with passive: false for preventDefault
      carousel.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (state.current.rafId) {
        cancelAnimationFrame(state.current.rafId)
      }
      if (carousel) {
        carousel.removeEventListener('wheel', handleWheel)
      }
    }
  }, [handleWheel])

  return (
    <section
      className="services"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header
        ref={titleRef}
        className={`services-header animate-fade-up ${titleVisible ? 'visible' : ''}`}
      >
        <h2 className="section-title dark">{t('services.title')}</h2>
        <p className="services-subtitle">{t('services.subtitle')}</p>
      </header>

      <div className="services-carousel-wrapper">
        <div
          className="services-carousel"
          ref={carouselRef}
          style={{ '--blur-amount': `${blurAmount}px` }}
        >
          {services.map((service, index) => (
            <Link
              key={service.url}
              href={service.url}
              className="service-slide"
              onClick={handleLinkClick}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              <div className="service-slide-content">
                <span className="service-number">0{index + 1}</span>
                <h3 className="service-slide-title">{t(`services.service${index + 1}Title`)}</h3>
                <p className="service-slide-description">{t(`services.service${index + 1}Text`)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="swipe-hint">
          <span className="swipe-hint-arrow">→</span>
        </div>
      </div>
    </section>
  )
}

export default Services
