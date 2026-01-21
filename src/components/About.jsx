import { useMemo } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useParallax } from '../hooks/useParallax'
import { useLanguage } from '../i18n/LanguageContext'
import './About.css'

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

  // Random image on each page load
  const randomImage = useMemo(() => {
    return aboutImages[Math.floor(Math.random() * aboutImages.length)]
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
                <p className="about-description large">
                  {t('about.years')}
                </p>
                <p className="about-description">
                  {t('about.specialization')} <strong>{t('about.specializationList')}</strong> <strong>{t('about.specializationListEnd')}</strong>
                </p>
              </AnimatedBlock>

              <AnimatedBlock className="about-block highlight-block" delay={2}>
                <h3 className="about-heading accent">{t('about.atmosphereTitle')}</h3>
              </AnimatedBlock>

              <AnimatedBlock className="about-block" delay={1}>
                <h3 className="about-heading">{t('about.storiesTitle')}</h3>
                <p className="about-description">
                  {t('about.storiesText')}
                </p>
                <p className="about-quote">
                  {t('about.quote')}
                </p>
              </AnimatedBlock>

              <AnimatedBlock className="about-block" delay={2}>
                <h3 className="about-heading">{t('about.commercialTitle')}</h3>
                <p className="about-description">
                  {t('about.commercialText')}
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
            </div>
          </div>

          <div
            ref={statsRef}
            className={`about-stats stagger-children ${statsVisible ? 'visible' : ''}`}
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
