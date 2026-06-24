'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './CookieConsent.css'

function CookieConsent() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <p>{t('cookies.message')}</p>
        <div className="cookie-consent-buttons">
          <button onClick={handleDecline} className="cookie-btn cookie-btn-decline">
            {t('cookies.decline')}
          </button>
          <button onClick={handleAccept} className="cookie-btn cookie-btn-accept">
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
