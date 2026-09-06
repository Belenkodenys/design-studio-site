'use client'

import { useEffect } from 'react'
import '../MiamiLanding.css'

export default function ThankYou({ basePath = '/miami-hospitality-design', marketLabel = 'Miami & South Florida' }) {
  useEffect(() => {
    document.documentElement.classList.add('miami-bg')
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'en-US'
    // Conversion confirmation (fires on the dedicated thank-you view).
    try {
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Miami inquiry — thank you' })
      if (window.gtag) window.gtag('event', 'generate_lead', { content_name: 'Miami inquiry' })
    } catch (_) {}
    return () => {
      document.documentElement.classList.remove('miami-bg')
      document.documentElement.lang = prevLang || 'en'
    }
  }, [])

  return (
    <main className="miami">
      <section className="miami-hero" style={{ minHeight: '100svh' }}>
        <div className="miami-hero-bg" aria-hidden="true" />
        <div className="miami-hero-scrim" aria-hidden="true" />
        <div className="miami-hero-inner">
          <p className="miami-eyebrow">Belenko · {marketLabel}</p>
          <h1 className="miami-hero-title">Thank you</h1>
          <p className="miami-hero-sub">
            Your request has been received. We review every inquiry personally and
            respond within one business day.
          </p>
          <div className="miami-hero-cta">
            <a className="miami-btn miami-btn-light" href={basePath}>Back to the landing</a>
          </div>
        </div>
      </section>
    </main>
  )
}
