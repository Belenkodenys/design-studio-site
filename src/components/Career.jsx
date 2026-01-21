import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './Career.css'

const positionsData = [
  { id: 1, location: 'Barcelona / Remote' },
  { id: 2, location: 'Barcelona / Remote' },
  { id: 3, location: 'Barcelona' }
]

function PositionCard({ position, index }) {
  const { t } = useLanguage()
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={`position-card animate-fade-up ${isVisible ? 'visible' : ''} delay-${(index % 3) + 1}`}
    >
      <div className="position-header">
        <h3 className="position-title">{t(`career.position${position.id}Title`)}</h3>
        <div className="position-meta">
          <span className="position-type">{t('career.fullTime')}</span>
          <span className="position-location">{position.location}</span>
        </div>
      </div>
      <p className="position-description">{t(`career.position${position.id}Desc`)}</p>
      <button className="position-apply">{t('career.applyNow')}</button>
    </article>
  )
}

function Career() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section className="career" id="career">
      <div className="career-container">
        <div className="career-intro">
          <header
            ref={titleRef}
            className={`career-header animate-fade-up ${titleVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title light">{t('career.title')}</h2>
            <p className="career-subtitle">{t('career.subtitle')}</p>
          </header>

          <div
            ref={contentRef}
            className={`career-text animate-fade-up ${contentVisible ? 'visible' : ''} delay-2`}
          >
            <p>{t('career.description')}</p>
          </div>
        </div>

        <div className="positions-list">
          {positionsData.map((position, index) => (
            <PositionCard key={position.id} position={position} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Career
