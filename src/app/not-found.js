'use client'

import Link from 'next/link'
import './not-found.css'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <Link href="/" className="not-found-logo">
          <img src="/belenko-logo.png" alt="Belenko" />
        </Link>

        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Page Not Found</p>
        <p className="not-found-description">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="not-found-btn primary">
            Go to Homepage
          </Link>
          <Link href="/#portfolio" className="not-found-btn secondary">
            View Projects
          </Link>
        </div>

        <div className="not-found-contact">
          <p>Need help? <a href="https://wa.me/34671825489">Contact us on WhatsApp</a></p>
        </div>
      </div>
    </div>
  )
}
