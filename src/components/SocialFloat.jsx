import { useState } from 'react'
import './SocialFloat.css'

function SocialFloat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`social-float ${isOpen ? 'open' : ''}`}>
      <div className="social-float-links">
        <a
          href="https://instagram.com/belenko"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float-link"
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
          </svg>
        </a>
        <a
          href="https://t.me/belenko_studio"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float-link"
          aria-label="Telegram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href="https://wa.me/34671825489"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float-link"
          aria-label="WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.63 21 7.89 20.47 6.4 19.56L2 21L3.44 16.6C2.53 15.11 2 13.37 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <div className="social-float-bottom">
        <span className="social-float-label">CONTACT US</span>
        <button
          className="social-float-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close social menu' : 'Open social menu'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-plus">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-minus">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SocialFloat
