import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useMouseParallax } from '../hooks/useParallax'
import './Hero.css'

const heroImages = [
  '/hero-bg.jpg',
  '/hero-1.jpg',
  '/hero-2.jpg',
  '/hero-3.jpg',
  '/hero-4.jpg',
  '/hero-5.jpg',
]

function Hero() {
  const { t } = useLanguage()
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mouseParallaxRef, mousePosition] = useMouseParallax(0.02)

  // Random starting index on mount
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * heroImages.length))

  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const rafRef = useRef(null)
  const [slideDirection, setSlideDirection] = useState('up')

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('up')
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe up - next image
        setSlideDirection('up')
        setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      } else {
        // Swipe down - previous image
        setSlideDirection('down')
        setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
      }
    } else if (Math.abs(diff) < 10) {
      // Tap - next image
      setSlideDirection('up')
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }
  }

  // Mouse drag support for desktop
  const handleMouseDown = (e) => {
    touchStartY.current = e.clientY
  }

  const handleMouseUp = (e) => {
    touchEndY.current = e.clientY
    const diff = touchStartY.current - touchEndY.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setSlideDirection('up')
        setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      } else {
        setSlideDirection('down')
        setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
      }
    }
  }

  return (
    <section className="hero" ref={mouseParallaxRef}>
      <div
        className={`hero-slider slide-${slideDirection}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`hero-image ${index === currentIndex ? 'active' : ''}`}
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002}) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            <img src={src} alt={`Interior ${index + 1}`} />
          </div>
        ))}
      </div>

      <div
        className={`hero-background-text ${loaded && scrollY < window.innerHeight ? 'visible' : ''}`}
        style={(() => {
          const progress = Math.min(1, scrollY / (window.innerHeight * 0.5))
          const vh = window.innerHeight
          const vw = window.innerWidth

          // Start position depends on viewport
          const startTopPercent = vw <= 600 ? 0.45 : vw <= 1100 ? 0.35 : 0.4
          const startTop = vh * startTopPercent
          const startLeft = vw * 0.5

          // End position (header logo position)
          const endTop = vw <= 600 ? 22 : 30
          const endLeft = vw <= 600 ? 20 : 40

          // Interpolate position
          const currentTop = startTop + (endTop - startTop) * progress
          const currentLeft = startLeft + (endLeft - startLeft) * progress

          // Mouse parallax reduces as we scroll
          const parallaxFactor = 1 - progress
          const mouseX = mousePosition.x * -0.3 * parallaxFactor
          const mouseY = mousePosition.y * -0.3 * parallaxFactor

          // Transform eases from centered to top-left aligned
          const translateX = -50 * (1 - progress)
          const translateY = -50 * (1 - progress)

          return {
            '--scroll-progress': progress,
            top: `${currentTop + mouseY}px`,
            left: `${currentLeft + mouseX}px`,
            transform: `translate(${translateX}%, ${translateY}%)`,
          }
        })()}
      >
        BELENKO
      </div>

      <div className="hero-content">
        <div
          className={`hero-left animate-fade-left ${loaded ? 'visible' : ''}`}
          style={{
            transform: `translateY(${scrollY * -0.1}px) translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollY * 0.002),
          }}
        >
          <h1 className="hero-title">
            <span className="hero-title-line">{t('hero.title')}</span>
            <span className="hero-title-line">{t('hero.titleLine2')}</span>
          </h1>
        </div>
      </div>

    </section>
  )
}

export default Hero
