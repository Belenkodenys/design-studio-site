'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import SocialFloat from '../../components/SocialFloat'
import '../../page-components/CareerPage.css'

const positionsData = [
  { id: 1, location: 'Barcelona / Remote' },
  { id: 2, location: 'Barcelona / Remote' },
  { id: 3, location: 'Barcelona' },
  { id: 4, location: 'Barcelona / Remote' },
  { id: 5, location: 'Barcelona / Remote' }
]

function PositionCard({ position, index }) {
  const { t } = useLanguage()
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })
  const [copied, setCopied] = useState(false)
  const EMAIL = 'office@belenko.design'

  const positionTitle = t(`career.position${position.id}Title`)
  const subject = `${t('career.applicationSubject')}: ${positionTitle}`
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(t('career.applicationBody'))}`

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      // Clipboard blocked: select the address so it can be copied by hand
      const el = document.getElementById(`apply-email-${position.id}`)
      if (el && window.getSelection) {
        const r = document.createRange(); r.selectNodeContents(el)
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r)
      }
    }
  }

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
      <div className="position-actions">
        <a className="position-apply" href={mailto}>{t('career.applyNow')}</a>
        <div className="position-email">
          <span className="position-email-label">{t('career.orEmail')}</span>
          <a id={`apply-email-${position.id}`} href={mailto} className="position-email-address">{EMAIL}</a>
          <button type="button" className="position-email-copy" onClick={copyEmail} aria-live="polite">
            {copied ? t('career.copied') : t('career.copy')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function CareerPageClient() {
  const { t } = useLanguage()
  const router = useRouter()

  const handleBackClick = (e) => {
    e.preventDefault()
    router.push('/')
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
        <a href="/" className="logo" onClick={handleBackClick}>
          <img src="/belenko-logo.png" alt="Belenko" />
        </a>
        <div className="header-actions">
          <LanguageSwitcher />
        </div>
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
      <SocialFloat />
    </div>
  )
}
