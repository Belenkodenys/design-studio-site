import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './CareerPage.css'

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

function CareerPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleBackClick = (e) => {
    e.preventDefault()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="career-page">
      <header className="career-page-header">
        <a href="/" className="back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </a>
        <a href="/" className="logo" onClick={handleBackClick}>BELENKO</a>
        <div className="header-spacer"></div>
      </header>

      <div className="career-page-content">
        <div className="career-page-intro">
          <h1 className="career-page-title">{t('career.title')}</h1>
          <p className="career-page-subtitle">{t('career.subtitle')}</p>
          <p className="career-page-description">{t('career.description')}</p>
        </div>

        <div className="positions-list">
          {positionsData.map((position, index) => (
            <PositionCard key={position.id} position={position} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CareerPage
