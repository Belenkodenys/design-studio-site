import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const rafRef = useRef(null)

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (!isHomePage) {
      setPastHero(false)
      return
    }

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setPastHero(window.scrollY >= window.innerHeight)
        rafRef.current = null
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isHomePage])


  const closeMenu = () => setMenuOpen(false)

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    closeMenu()

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.hash = sectionId
        }
      }, 300)
    } else {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleHomeClick = (e) => {
    e.preventDefault()
    closeMenu()
    if (location.pathname !== '/') {
      navigate('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className={`header ${isHomePage && !pastHero ? 'logo-hidden' : ''}`}>
      <Link to="/" className="logo" onClick={handleHomeClick}>BELENKO</Link>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>{t('nav.about')}</a>
        <a href="#services" className="nav-link" onClick={(e) => handleNavClick(e, 'services')}>{t('nav.services')}</a>
        <a href="#gallery" className="nav-link" onClick={(e) => handleNavClick(e, 'gallery')}>{t('nav.portfolio')}</a>
        <Link to="/blog" className="nav-link" onClick={closeMenu}>{t('nav.blog')}</Link>
        <Link to="/career" className="nav-link" onClick={closeMenu}>{t('nav.career')}</Link>
        <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>{t('nav.contact')}</a>
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
