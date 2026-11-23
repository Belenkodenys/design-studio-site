'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { projectTranslations } from '../../../i18n/projectTranslations'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import SocialFloat from '../../../components/SocialFloat'
import ProposalFooter from '../../clients/proposal/ProposalFooter'
import Breadcrumbs from '../../../components/Breadcrumbs'
import '../../../page-components/ProjectDetail.css'

export default function ProjectDetailClient({ project, prevProject, nextProject }) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Swipe state for lightbox (TikTok style)
  const [swipeOffset, setSwipeOffset] = useState(0)
  // Pinch-zoom state for the active lightbox slide (phones)
  const [zoom, setZoom] = useState({ s: 1, x: 0, y: 0 })
  const pinch = useRef(null) // { d0, s0, cx, cy, x0, y0 }
  const pan = useRef(null) // { x0, y0, px, py }
  const lastTap = useRef(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)
  const startTime = useRef(0)
  const velocity = useRef(0)
  const videoRef = useRef(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  // Project swipe navigation
  const projectSwipeStartX = useRef(0)
  const projectSwipeStartY = useRef(0)
  const isProjectSwiping = useRef(false)

  const handleProjectTouchStart = (e) => {
    if (lightboxOpen) return
    projectSwipeStartX.current = e.touches[0].clientX
    projectSwipeStartY.current = e.touches[0].clientY
    isProjectSwiping.current = true
  }

  const handleProjectTouchEnd = (e) => {
    if (!isProjectSwiping.current || lightboxOpen) return
    isProjectSwiping.current = false

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = projectSwipeStartX.current - touchEndX
    const diffY = Math.abs(projectSwipeStartY.current - touchEndY)

    // Only trigger if horizontal swipe is dominant and significant
    if (Math.abs(diffX) > 80 && Math.abs(diffX) > diffY * 1.5) {
      if (diffX > 0) {
        // Swipe left -> next project
        router.push(`/project/${nextProject.id}`)
      } else {
        // Swipe right -> previous project
        router.push(`/project/${prevProject.id}`)
      }
    }
  }

  // Get translated project content
  const getProjectTranslation = (projectId) => {
    const trans = projectTranslations[projectId]
    if (trans && trans[language]) {
      return trans[language]
    }
    return trans?.en || { title: '', description: '' }
  }

  const projectTrans = getProjectTranslation(project.id)
  const prevProjectTrans = getProjectTranslation(prevProject.id)
  const nextProjectTrans = getProjectTranslation(nextProject.id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project.id])

  // Ensure video autoplay works
  useEffect(() => {
    if (project.video && videoRef.current) {
      const video = videoRef.current
      video.muted = true
      setIsMuted(true)

      const handleCanPlay = () => {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay was prevented
          })
        }
      }

      video.addEventListener('canplay', handleCanPlay)
      video.load()

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [project.id, project.video])

  const handleContactClick = (e) => {
    e.preventDefault()
    router.push('/')
    setTimeout(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.hash = 'contact'
      }
    }, 300)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  useEffect(() => { resetZoom() }, [lightboxIndex, lightboxOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const lightboxNext = useCallback(() => {
    if (project && !isAnimating) {
      setLightboxIndex((prev) => (prev + 1) % project.images.length)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 400)
    }
  }, [project, isAnimating])

  const lightboxPrev = useCallback(() => {
    if (project && !isAnimating) {
      setLightboxIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 400)
    }
  }, [project, isAnimating])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return

      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowRight') {
        lightboxNext()
      } else if (e.key === 'ArrowLeft') {
        lightboxPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxNext, lightboxPrev])

  // Lightbox swipe handlers (TikTok style with velocity)
  const touchStartY = useRef(0)
  const touchCurrentY = useRef(0)
  const resetZoom = () => { setZoom({ s: 1, x: 0, y: 0 }); pinch.current = null; pan.current = null }

  const handleLightboxTouchStart = (e) => {
    // Two fingers: start a pinch; never treat as a swipe.
    if (e.touches.length === 2) {
      const [a, b] = e.touches
      const d0 = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      pinch.current = { d0, s0: zoom.s, cx: (a.clientX + b.clientX) / 2, cy: (a.clientY + b.clientY) / 2, x0: zoom.x, y0: zoom.y }
      setIsSwiping(false)
      return
    }
    // One finger while zoomed: pan the image instead of swiping slides.
    if (zoom.s > 1) {
      pan.current = { x0: e.touches[0].clientX, y0: e.touches[0].clientY, px: zoom.x, py: zoom.y }
      return
    }
    // Double tap toggles 2.5x zoom.
    const now = Date.now()
    if (now - lastTap.current < 300) {
      lastTap.current = 0
      const r = e.currentTarget.getBoundingClientRect()
      const tx = e.touches[0].clientX - r.left - r.width / 2
      const ty = e.touches[0].clientY - r.top - r.height / 2
      setZoom({ s: 2.5, x: -tx * 1.5, y: -ty * 1.5 })
      return
    }
    lastTap.current = now
    touchStartY.current = e.touches[0].clientY
    touchCurrentY.current = touchStartY.current
    if (isAnimating) return
    touchStartX.current = e.touches[0].clientX
    touchCurrentX.current = e.touches[0].clientX
    startTime.current = Date.now()
    velocity.current = 0
    setIsSwiping(true)
  }

  const handleLightboxTouchMove = (e) => {
    if (pinch.current && e.touches.length === 2) {
      e.preventDefault()
      const [a, b] = e.touches
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const ns = Math.min(5, Math.max(1, pinch.current.s0 * (d / pinch.current.d0)))
      const cx = (a.clientX + b.clientX) / 2, cy = (a.clientY + b.clientY) / 2
      setZoom({ s: ns, x: pinch.current.x0 + (cx - pinch.current.cx), y: pinch.current.y0 + (cy - pinch.current.cy) })
      return
    }
    if (pan.current && zoom.s > 1) {
      e.preventDefault()
      setZoom((z) => ({ ...z, x: pan.current.px + (e.touches[0].clientX - pan.current.x0), y: pan.current.py + (e.touches[0].clientY - pan.current.y0) }))
      return
    }
    if (!isSwiping || isAnimating) return
    e.preventDefault()

    const prevX = touchCurrentX.current
    touchCurrentX.current = e.touches[0].clientX
    touchCurrentY.current = e.touches[0].clientY
    const diff = touchCurrentX.current - touchStartX.current

    // Calculate velocity
    const timeDiff = Date.now() - startTime.current
    if (timeDiff > 0) {
      velocity.current = (touchCurrentX.current - prevX) / timeDiff * 16
    }

    setSwipeOffset(diff)
  }

  const handleLightboxTouchEnd = (e) => {
    if (pinch.current) {
      if (!e || e.touches.length < 2) {
        pinch.current = null
        if (zoom.s <= 1.02) resetZoom()
      }
      return
    }
    if (pan.current) { pan.current = null; return }
    if (zoom.s > 1) return
    if (!isSwiping) return
    setIsSwiping(false)

    // A mostly vertical swipe (up or down) dismisses the full-screen view.
    const dy = touchCurrentY.current - touchStartY.current
    const dx = touchCurrentX.current - touchStartX.current
    if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx) * 1.3) {
      setSwipeOffset(0)
      closeLightbox()
      return
    }

    const diff = touchStartX.current - touchCurrentX.current
    const threshold = window.innerWidth * 0.15
    const velocityThreshold = 0.5

    const shouldGoNext = diff > threshold || (diff > 0 && velocity.current < -velocityThreshold)
    const shouldGoPrev = diff < -threshold || (diff < 0 && velocity.current > velocityThreshold)

    if (shouldGoNext) {
      lightboxNext()
    } else if (shouldGoPrev) {
      lightboxPrev()
    }

    setSwipeOffset(0)
  }

  // Mouse drag for desktop
  const handleLightboxMouseDown = (e) => {
    if (isAnimating) return
    e.preventDefault()
    touchStartX.current = e.clientX
    touchCurrentX.current = e.clientX
    startTime.current = Date.now()
    velocity.current = 0
    setIsSwiping(true)
  }

  const handleLightboxMouseMove = (e) => {
    if (!isSwiping || isAnimating) return

    const prevX = touchCurrentX.current
    touchCurrentX.current = e.clientX
    const diff = touchCurrentX.current - touchStartX.current

    // Calculate velocity
    const timeDiff = Date.now() - startTime.current
    if (timeDiff > 0) {
      velocity.current = (touchCurrentX.current - prevX) / timeDiff * 16
    }

    setSwipeOffset(diff)
  }

  const handleLightboxMouseUp = () => {
    if (!isSwiping) return
    setIsSwiping(false)

    const diff = touchStartX.current - touchCurrentX.current
    const threshold = window.innerWidth * 0.15
    const velocityThreshold = 0.5

    const shouldGoNext = diff > threshold || (diff > 0 && velocity.current < -velocityThreshold)
    const shouldGoPrev = diff < -threshold || (diff < 0 && velocity.current > velocityThreshold)

    if (shouldGoNext) {
      lightboxNext()
    } else if (shouldGoPrev) {
      lightboxPrev()
    }

    setSwipeOffset(0)
  }

  // Calculate slide style for TikTok effect
  const getSlideStyle = (index) => {
    const diff = index - lightboxIndex
    const baseOffset = diff * 100
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
    const dragPercent = (swipeOffset / windowWidth) * 100

    // Only show current, prev and next slides
    if (Math.abs(diff) > 1) {
      return {
        transform: `translateX(${diff > 0 ? 200 : -200}%)`,
        opacity: 0,
        visibility: 'hidden'
      }
    }

    // Scale and opacity for non-active slides
    const isActive = index === lightboxIndex
    const scale = isActive ? 1 : 0.9
    const opacity = isActive ? 1 : 0.6

    return {
      transform: `translateX(calc(${baseOffset}% + ${dragPercent}%)) scale(${scale})`,
      opacity,
      zIndex: isActive ? 2 : 1,
      visibility: 'visible'
    }
  }

  return (
    <div
      className="project-detail"
      onTouchStart={handleProjectTouchStart}
      onTouchEnd={handleProjectTouchEnd}
    >
      <header className="project-header">
        <Link href="/#portfolio" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </Link>
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); router.push('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <img src="/belenko-logo.png" alt="Belenko" />
        </a>
        <div className="header-actions">
          <LanguageSwitcher />
          <a href="/#contact" onClick={handleContactClick} className="header-contact-btn">{t('nav.contact')}</a>
        </div>
      </header>

      {project.video ? (
        <div className={`project-hero project-hero-video${project.videoFit === 'width' ? ' project-hero-video--fit' : ''}`}>
          <video
            ref={videoRef}
            src={project.video}
            poster={project.videoPoster}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
          />
          <button
            className="video-mute-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      ) : (
        <div className="project-hero">
          <div className="project-hero-image" onClick={() => openLightbox(currentImageIndex)}>
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} — ${project.category.toLowerCase()} interior design in ${project.location} by Belenko Design Studio`}
              width="2000"
              height="1338"
              fetchPriority="high"
            />
            {project.images.length > 1 && (
              <div className="image-nav" onClick={(e) => e.stopPropagation()}>
                <button onClick={prevImage} aria-label="Previous image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span>{currentImageIndex + 1} / {project.images.length}</span>
                <button onClick={nextImage} aria-label="Next image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="project-content">
        <Breadcrumbs
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.portfolio'), href: '/#portfolio' },
            { label: projectTrans?.title || project.title }
          ]}
        />
        <div className="project-info">
          <span className="project-category">{project.category}</span>
          <h1 className="project-title">{projectTrans?.title || project.title}</h1>

          <div className="project-meta">
            <div className="meta-item">
              <span className="meta-label">{t('project.location')}</span>
              <span className="meta-value">{project.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('project.year')}</span>
              <span className="meta-value">{project.year}</span>
            </div>
          </div>
        </div>

        <div className="project-description">
          {projectTrans?.quote && (
            <blockquote className="project-quote">
              <p>{projectTrans.quote}</p>
              <cite>— {projectTrans.quoteAuthor}</cite>
            </blockquote>
          )}

          <p>{projectTrans?.description || project.description}</p>

          <div className="project-services">
            <h3>{t('project.services')}</h3>
            <ul>
              {project.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="project-gallery">
        {project.images.map((image, index) => (
          <div
            key={index}
            className={`gallery-item ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`${project.title} — ${project.category.toLowerCase()} interior design, ${project.location}, Belenko Design Studio (photo ${index + 1})`}
              width="2000"
              height="1338"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Project Navigation */}
      <div className="project-navigation">
        <Link href={`/project/${prevProject.id}`} className="project-nav-link prev">
          <span className="project-nav-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('project.prevProject')}
          </span>
          <span className="project-nav-title">{prevProjectTrans?.title || prevProject.title}</span>
        </Link>
        <Link href={`/project/${nextProject.id}`} className="project-nav-link next">
          <span className="project-nav-label">
            {t('project.nextProject')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="project-nav-title">{nextProjectTrans?.title || nextProject.title}</span>
        </Link>
      </div>

      <ProposalFooter />

      {/* Lightbox - TikTok Style */}
      {lightboxOpen && (
        <div
          className={`lightbox ${isSwiping ? 'is-swiping' : ''} ${isAnimating ? 'is-animating' : ''}`}
          onClick={closeLightbox}
          onMouseMove={handleLightboxMouseMove}
          onMouseUp={handleLightboxMouseUp}
          onMouseLeave={handleLightboxMouseUp}
        >
          <a
            className="lightbox-download"
            href={project.images[lightboxIndex]}
            download
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            aria-label="Save photo"
            title="Save photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
          </a>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div
            className="lightbox-slider"
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
            onMouseDown={handleLightboxMouseDown}
            onClick={(e) => e.stopPropagation()}
          >
            {project.images.map((image, index) => (
              <div
                key={index}
                className={`lightbox-slide ${index === lightboxIndex ? 'active' : ''}`}
                style={getSlideStyle(index)}
              >
                <img
                  src={image}
                  alt={`${project.title} — ${project.category.toLowerCase()} interior design, ${project.location}, Belenko Design Studio (photo ${index + 1})`}
                  width="2000"
                  height="1338"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className={index === lightboxIndex && zoom.s > 1 ? 'is-zoomed' : undefined}
                  style={index === lightboxIndex && zoom.s > 1 ? { transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`, transition: pinch.current || pan.current ? 'none' : 'transform .2s ease-out' } : undefined}
                />
              </div>
            ))}
          </div>

          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); lightboxPrev(); }} aria-label="Previous">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); lightboxNext(); }} aria-label="Next">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}

      <SocialFloat />
    </div>
  )
}
