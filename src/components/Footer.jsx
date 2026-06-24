'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import './Footer.css'

function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [visitorCount, setVisitorCount] = useState(null)

  useEffect(() => {
    fetch('/api/counter')
      .then(r => r.json())
      .then(d => setVisitorCount(d.count))
      .catch(() => {})
  }, [])

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()

    const openAccordion = () => {
      // Dispatch custom event to open accordion
      window.dispatchEvent(new CustomEvent('openAccordion', { detail: { id: sectionId } }))
      // Scroll to section after a small delay for accordion to open
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }

    if (pathname !== '/') {
      router.push('/')
      setTimeout(openAccordion, 300)
    } else {
      openAccordion()
    }
  }

  const handleHomeClick = (e) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo" onClick={handleHomeClick}>
              <img src="/belenko-logo.png" alt="Belenko" />
            </a>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>

          <nav className="footer-nav">
            <a href="#about" className="footer-link" onClick={(e) => handleNavClick(e, 'about')}>{t('nav.about')}</a>
            <a href="#services" className="footer-link" onClick={(e) => handleNavClick(e, 'services')}>{t('nav.services')}</a>
            <a href="#portfolio" className="footer-link" onClick={(e) => handleNavClick(e, 'portfolio')}>{t('nav.portfolio')}</a>
            <a href="#blog" className="footer-link" onClick={(e) => handleNavClick(e, 'blog')}>{t('nav.blog')}</a>
            <a href="#career" className="footer-link" onClick={(e) => handleNavClick(e, 'career')}>{t('nav.career')}</a>
            <a href="#contact" className="footer-link" onClick={(e) => handleNavClick(e, 'contact')}>{t('nav.contact')}</a>
          </nav>

          <div className="footer-social">
            <a href="https://instagram.com/belenko" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://t.me/belenko_studio" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://es.pinterest.com/belenkodesign/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Pinterest">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.805-2.425 1.808-2.425.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://wa.me/34671825489" target="_blank" rel="noopener noreferrer" className="social-link whatsapp-btn" aria-label="WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.657 0-3.216-.5-4.51-1.357l-.323-.194-2.871.854.854-2.871-.194-.323A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; 2026 {t('footer.rights')} Belenko Studio</p>
          {visitorCount !== null && (
            <div className="visitor-counter">{visitorCount.toLocaleString()}</div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
