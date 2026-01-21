import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useScrollProgress } from '../hooks/useParallax'
import './Portfolio.css'

function Portfolio() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.2 })
  const [sectionRef, scrollProgress] = useScrollProgress()

  const startX = useRef(0)
  const currentX = useRef(0)
  const startTime = useRef(0)
  const velocity = useRef(0)
  const sliderRef = useRef(null)
  const animationRef = useRef(null)
  const animationTimerRef = useRef(null)

  // Get slide width (approximately 60% of viewport for main slide)
  const getSlideWidth = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth * 0.6
    }
    return 600
  }

  const goToSlide = useCallback((index) => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    setCurrentIndex(index)
    setIsAnimating(true)
    animationTimerRef.current = setTimeout(() => setIsAnimating(false), 500)
  }, [])

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % projects.length)
  }

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + projects.length) % projects.length)
  }

  const handleDragStart = (clientX) => {
    if (isAnimating) return
    setIsDragging(true)
    startX.current = clientX
    currentX.current = clientX
    startTime.current = Date.now()
    velocity.current = 0

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleDragMove = (clientX) => {
    if (!isDragging || isAnimating) return

    const prevX = currentX.current
    currentX.current = clientX
    const diff = clientX - startX.current

    // Calculate velocity
    const timeDiff = Date.now() - startTime.current
    if (timeDiff > 0) {
      velocity.current = (clientX - prevX) / timeDiff * 16 // Normalize to ~60fps
    }

    // Add resistance at edges
    const resistance = 0.3
    let adjustedDiff = diff

    if ((currentIndex === 0 && diff > 0) ||
        (currentIndex === projects.length - 1 && diff < 0)) {
      adjustedDiff = diff * resistance
    }

    setDragOffset(adjustedDiff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const diff = startX.current - currentX.current
    const slideWidth = getSlideWidth()
    const threshold = slideWidth * 0.15 // 15% of slide width
    const velocityThreshold = 0.5

    // Determine direction based on distance and velocity
    const shouldGoNext = diff > threshold || (diff > 0 && velocity.current < -velocityThreshold)
    const shouldGoPrev = diff < -threshold || (diff < 0 && velocity.current > velocityThreshold)

    if (shouldGoNext && currentIndex < projects.length - 1) {
      nextSlide()
    } else if (shouldGoPrev && currentIndex > 0) {
      prevSlide()
    } else if (shouldGoNext && currentIndex === projects.length - 1) {
      // Loop to first
      goToSlide(0)
    } else if (shouldGoPrev && currentIndex === 0) {
      // Loop to last
      goToSlide(projects.length - 1)
    } else {
      // Snap back with spring animation
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
      setIsAnimating(true)
      animationTimerRef.current = setTimeout(() => setIsAnimating(false), 400)
    }

    setDragOffset(0)
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault()
    }
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }

  const handleLinkClick = (e) => {
    if (Math.abs(startX.current - currentX.current) > 10) {
      e.preventDefault()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // Calculate transform for each slide
  const getSlideStyle = (index) => {
    const diff = index - currentIndex
    const baseOffset = diff * 100 // percentage based

    return {
      transform: `translateX(calc(${baseOffset}% + ${dragOffset}px))`,
      zIndex: index === currentIndex ? 2 : 1,
    }
  }

  // Calculate parallax offset for images based on scroll
  const imageParallaxOffset = (scrollProgress - 0.5) * 30

  return (
    <section className="portfolio" id="gallery" ref={sectionRef}>
      <h2
        ref={titleRef}
        className={`portfolio-section-title animate-blur ${titleVisible ? 'visible' : ''}`}
      >
        {t('portfolio.title')}
      </h2>
      <div
        ref={sliderRef}
        className={`portfolio-slider ${isDragging ? 'is-dragging' : ''} ${isAnimating ? 'is-animating' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className={`portfolio-slide ${index === currentIndex ? 'active' : ''}`}
            style={getSlideStyle(index)}
            onClick={handleLinkClick}
          >
            <div className="portfolio-slide-image">
              <img
                src={project.image}
                alt={project.title}
                style={{
                  transform: `translateY(${imageParallaxOffset}px) scale(1.1)`,
                }}
              />
            </div>
            <div className="portfolio-slide-content">
              <h2 className="portfolio-slide-title">{project.title}</h2>
              <p className="portfolio-slide-category">{project.category}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress dots */}
      <div className="portfolio-dots">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`portfolio-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="portfolio-nav">
        <button className="portfolio-nav-btn" onClick={prevSlide} aria-label="Previous project">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="portfolio-nav-btn" onClick={nextSlide} aria-label="Next project">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="portfolio-counter">
        <span className="portfolio-counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="portfolio-counter-separator">/</span>
        <span className="portfolio-counter-total">{String(projects.length).padStart(2, '0')}</span>
      </div>

      <Link to="/projects" className="portfolio-all-btn">
        {t('portfolio.allProjects')}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </section>
  )
}

export default Portfolio
