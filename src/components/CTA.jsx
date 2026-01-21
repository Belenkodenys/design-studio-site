import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './CTA.css'

function CTA() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.2 })
  const [subtitleRef, subtitleVisible] = useScrollAnimation({ threshold: 0.2 })
  const [buttonRef, buttonVisible] = useScrollAnimation({ threshold: 0.2 })

  return (
    <section className="cta">
      <div className="cta-container">
        <h2
          ref={titleRef}
          className={`section-title light animate-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          {t('cta.title')}
        </h2>
        <p
          ref={subtitleRef}
          className={`cta-subtitle animate-fade-up ${subtitleVisible ? 'visible' : ''} delay-2`}
        >
          {t('cta.subtitle')}
        </p>
        <a
          ref={buttonRef}
          href="#contact"
          className={`cta-button animate-fade-up ${buttonVisible ? 'visible' : ''} delay-3`}
        >
          {t('cta.button')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}

export default CTA
