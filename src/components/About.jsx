import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useParallax } from '../hooks/useParallax'
import { useLanguage } from '../i18n/LanguageContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const aboutImages = [
  '/about-1.jpg',
  '/about-2.jpg',
  '/about-3.jpg'
]

function AnimatedBlock({ children, className = '', delay = 0, animation = 'animate-fade-up' }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? 'visible' : ''} ${delay ? `delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  )
}

function ParallaxImage({ src, alt, speed = 0.1, className = '' }) {
  const [ref, offset] = useParallax(speed)
  return (
    <div ref={ref} className={`parallax-container ${className}`}>
      <img
        src={src}
        alt={alt}
        className="parallax-element"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      />
    </div>
  )
}

function About() {
  const { t } = useLanguage()
  const [leftRef, leftVisible] = useScrollAnimation({ threshold: 0.1 })
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.1 })
  const statsContainerRef = useRef(null)

  // GSAP animation for stats numbers
  useEffect(() => {
    const statsContainer = statsContainerRef.current
    if (!statsContainer) return

    const statNumbers = statsContainer.querySelectorAll('.stat-number')
    const statItems = statsContainer.querySelectorAll('.stat-item')

    // Animate stat items sliding up with stagger
    gsap.fromTo(
      statItems,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsContainer,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === statsContainer) {
          trigger.kill()
        }
      })
    }
  }, [])

  // Random image on each page load (client-side only to avoid hydration mismatch)
  const [randomImage, setRandomImage] = useState(aboutImages[0])

  useEffect(() => {
    setRandomImage(aboutImages[Math.floor(Math.random() * aboutImages.length)])
  }, [])

  return (
    <>
      <section className="about" id="about">
        <div className="about-container">
          <div
            ref={leftRef}
            className={`about-left animate-fade-left ${leftVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title dark">{t('about.title')}</h2>

            <div className="about-text">
              <p className="about-paragraph">
                <strong>{t('about.intro')}</strong>{t('about.introText')}
              </p>

              <p className="about-paragraph">
                {t('about.paragraph2')} <span className="muted">{t('about.paragraph2Muted')}</span>{t('about.paragraph2End')}
              </p>

              <p className="about-paragraph">
                {t('about.paragraph3')}
              </p>

              <p className="about-paragraph">
                {t('about.paragraph4')} <strong>{t('about.paragraph4Bold')}</strong>{t('about.paragraph4End')}
              </p>
            </div>
          </div>

          <div className="about-right">
            <AnimatedBlock className="about-main-image" animation="image-reveal" delay={2}>
              <ParallaxImage
                src={randomImage}
                alt="Restaurant interior design Barcelona - Belenko Design Studio"
                speed={0.08}
              />
            </AnimatedBlock>
            <AnimatedBlock className="about-image-quote" animation="animate-slide-up" delay={3}>
              <p>{t('about.imageQuote')}</p>
            </AnimatedBlock>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="about-stats-section">
        <div className="about-stats-container">
          <AnimatedBlock className="about-stats-header">
            <h2 className="section-title light">{t('about.principlesTitle')}</h2>
            <p className="about-stats-subtitle">{t('about.principlesSubtitle')}</p>
          </AnimatedBlock>

          <div className="about-content-grid">
            <div className="about-content-text">
              <AnimatedBlock className="about-block" delay={1}>
                <h3 className="about-block-title">{t('about.principle1Title')}</h3>
                <p className="about-description">
                  {t('about.principle1Text')}
                </p>
              </AnimatedBlock>

              <AnimatedBlock className="about-block" delay={2}>
                <h3 className="about-block-title">{t('about.principle2Title')}</h3>
                <p className="about-description">
                  {t('about.principle2Text')}
                </p>
              </AnimatedBlock>

              <AnimatedBlock className="about-block" delay={1}>
                <h3 className="about-block-title">{t('about.principle3Title')}</h3>
                <p className="about-description">
                  {t('about.principle3Text')}
                </p>
              </AnimatedBlock>

              <AnimatedBlock className="about-block" delay={2}>
                <h3 className="about-block-title">{t('about.principle4Title')}</h3>
                <p className="about-description">
                  {t('about.principle4Text')}
                </p>
              </AnimatedBlock>
            </div>

            <div className="about-content-images">
              <AnimatedBlock className="about-content-image single" animation="image-reveal" delay={3}>
                <ParallaxImage
                  src="/denis-belenko.jpg"
                  alt="Denis Belenko - Founder of Belenko Design Studio"
                  speed={0.05}
                />
              </AnimatedBlock>
              <AnimatedBlock className="founder-quote-block" animation="animate-fade-up" delay={4}>
                <p>{t('about.founderQuote')}</p>
                <span className="founder-author">{t('about.founderAuthor')}</span>
              </AnimatedBlock>
            </div>
          </div>

          <div
            ref={statsContainerRef}
            className="about-stats"
          >
            <div className="stat-item">
              <span className="stat-number">{t('about.stat1Number')}</span>
              <span className="stat-label">{t('about.stat1Label')}</span>
              <span className="stat-description">{t('about.stat1Desc')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{t('about.stat2Number')}</span>
              <span className="stat-label">{t('about.stat2Label')}</span>
              <span className="stat-description">{t('about.stat2Desc')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{t('about.stat3Number')}</span>
              <span className="stat-label">{t('about.stat3Label')}</span>
              <span className="stat-description">{t('about.stat3Desc')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
