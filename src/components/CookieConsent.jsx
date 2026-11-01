'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import './CookieConsent.css'

const GA_MEASUREMENT_ID = 'G-MHRT379CY9'
const META_PIXEL_ID = '404907462596504'
const COOKIE_CONSENT_KEY = 'cookieConsent'
const CONSENT_ACCEPTED = 'accepted'
const CONSENT_DECLINED = 'declined'

function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments) }

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script')
    script.id = 'ga4-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  if (!window.__belenkoGa4Initialized) {
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    })
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname + window.location.search
    })
    window.__belenkoGa4Initialized = true
  }
}

function loadMetaPixel() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  if (!window.fbq) {
    const fbq = function fbq() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
    }
    window.fbq = fbq
    window._fbq = fbq
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
  }

  if (!document.getElementById('meta-pixel-script')) {
    const script = document.createElement('script')
    script.id = 'meta-pixel-script'
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  }

  window.fbq('consent', 'grant')

  if (!window.__belenkoMetaPixelInitialized) {
    window.fbq('init', META_PIXEL_ID)
    window.fbq('track', 'PageView')
    window.__belenkoMetaPixelInitialized = true
  }
}

function loadTrackingScripts() {
  loadGoogleAnalytics()
  loadMetaPixel()
}

function disableTracking() {
  if (typeof window === 'undefined') return

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true

  if (typeof window.fbq === 'function') {
    window.fbq('consent', 'revoke')
  }

  // Remove first-party tracking cookies at host and parent-domain scopes.
  const hostname = window.location.hostname
  const domains = ['', hostname, ...hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'))]
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.trim().split('=')[0]
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_fbp$|_fbc$)/.test(name)) return
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`
    })
  })
}

function trackPageView() {
  if (typeof window === 'undefined') return

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView')
  }
}

function CookieConsent() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [consent, setConsent] = useState(null)
  const hasHandledInitialPageViewRef = useRef(false)

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    setConsent([CONSENT_ACCEPTED, CONSENT_DECLINED].includes(savedConsent) ? savedConsent : null)

    if (savedConsent === CONSENT_ACCEPTED) {
      loadTrackingScripts()
      return
    }

    if (savedConsent === CONSENT_DECLINED) {
      disableTracking()
      return
    }

    if (savedConsent !== CONSENT_ACCEPTED && savedConsent !== CONSENT_DECLINED) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const syncConsent = (event) => {
      if (event.key === COOKIE_CONSENT_KEY || event.key === null) window.location.reload()
    }
    window.addEventListener('storage', syncConsent)
    return () => window.removeEventListener('storage', syncConsent)
  }, [])

  useEffect(() => {
    if (consent !== CONSENT_ACCEPTED) return

    if (!hasHandledInitialPageViewRef.current) {
      hasHandledInitialPageViewRef.current = true
      return
    }

    trackPageView()
  }, [pathname, consent])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_ACCEPTED)
    setConsent(CONSENT_ACCEPTED)
    loadTrackingScripts()
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_DECLINED)
    setConsent(CONSENT_DECLINED)
    disableTracking()
    setIsVisible(false)
    // Reload removes active vendor runtimes and any pending event queues.
    if (consent === CONSENT_ACCEPTED) window.location.reload()
  }

  const handleManage = () => {
    setIsVisible(true)
  }

  if (!isVisible) {
    if (!consent) return null

    return (
      <button
        type="button"
        onClick={handleManage}
        className="cookie-manage"
        aria-label={t('cookies.manage')}
      >
        {t('cookies.manage')}
      </button>
    )
  }

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
