import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef } from 'react'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { projectTranslations } from '../i18n/projectTranslations'
import './ProjectDetail.css'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Swipe state for lightbox (TikTok style)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)
  const startTime = useRef(0)
  const velocity = useRef(0)

  const project = projects.find(p => p.id === parseInt(id))
  const currentIndex = projects.findIndex(p => p.id === parseInt(id))
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1]
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0]

  // Get translated project content
  const getProjectTranslation = (projectId) => {
    const trans = projectTranslations[projectId]
    if (trans && trans[language]) {
      return trans[language]
    }
    return trans?.en || { title: '', description: '' }
  }

  const projectTrans = project ? getProjectTranslation(project.id) : null
  const prevProjectTrans = prevProject ? getProjectTranslation(prevProject.id) : null
  const nextProjectTrans = nextProject ? getProjectTranslation(nextProject.id) : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const handleContactClick = (e) => {
    e.preventDefault()
    navigate('/')
    setTimeout(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.hash = 'contact'
      }
    }, 300)
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <h1>Project not found</h1>
        <Link to="/projects" className="back-link">Back to Projects</Link>
      </div>
    )
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
  const handleLightboxTouchStart = (e) => {
    if (isAnimating) return
    touchStartX.current = e.touches[0].clientX
    touchCurrentX.current = e.touches[0].clientX
    startTime.current = Date.now()
    velocity.current = 0
    setIsSwiping(true)
  }

  const handleLightboxTouchMove = (e) => {
    if (!isSwiping || isAnimating) return
    e.preventDefault()

    const prevX = touchCurrentX.current
    touchCurrentX.current = e.touches[0].clientX
    const diff = touchCurrentX.current - touchStartX.current

    // Calculate velocity
    const timeDiff = Date.now() - startTime.current
    if (timeDiff > 0) {
      velocity.current = (touchCurrentX.current - prevX) / timeDiff * 16
    }

    setSwipeOffset(diff)
  }

  const handleLightboxTouchEnd = () => {
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
    const dragPercent = (swipeOffset / window.innerWidth) * 100

    // Scale and opacity for non-active slides
    const isActive = index === lightboxIndex
    const scale = isActive ? 1 : 0.85
    const opacity = isActive ? 1 : 0.5

    return {
      transform: `translateX(calc(${baseOffset}% + ${dragPercent}%)) scale(${scale})`,
      opacity,
      zIndex: isActive ? 2 : 1
    }
  }

  return (
    <div className="project-detail">
      <header className="project-header">
        <Link to="/projects" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </Link>
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>BELENKO</a>
        <a href="/#contact" onClick={handleContactClick} className="header-contact-btn">{t('nav.contact')}</a>
      </header>

      <div className="project-hero">
        <div className="project-hero-image" onClick={() => openLightbox(currentImageIndex)}>
          <img src={project.images[currentImageIndex]} alt={project.title} />
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

      <div className="project-content">
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

        {project.video ? (
          <div className="project-video-section">
            <div className="project-video">
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
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
        ) : (
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
        )}
      </div>

      <div className="project-gallery">
        {project.images.map((image, index) => (
          <div
            key={index}
            className={`gallery-item ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => openLightbox(index)}
          >
            <img src={image} alt={`${project.title} ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="project-cta">
        <h2>{t('project.interestedTitle')}</h2>
        <a href="/#contact" onClick={handleContactClick} className="cta-button">{t('project.getInTouch')}</a>
      </div>

      {/* Project Navigation */}
      <div className="project-navigation">
        <Link to={`/project/${prevProject.id}`} className="project-nav-link prev">
          <span className="project-nav-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('project.prevProject')}
          </span>
          <span className="project-nav-title">{prevProjectTrans?.title || prevProject.title}</span>
        </Link>
        <Link to={`/project/${nextProject.id}`} className="project-nav-link next">
          <span className="project-nav-label">
            {t('project.nextProject')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="project-nav-title">{nextProjectTrans?.title || nextProject.title}</span>
        </Link>
      </div>

      {/* Lightbox - TikTok Style */}
      {lightboxOpen && (
        <div
          className={`lightbox ${isSwiping ? 'is-swiping' : ''} ${isAnimating ? 'is-animating' : ''}`}
          onClick={closeLightbox}
          onMouseMove={handleLightboxMouseMove}
          onMouseUp={handleLightboxMouseUp}
          onMouseLeave={handleLightboxMouseUp}
        >
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
                  alt={`${project.title} ${index + 1}`}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
