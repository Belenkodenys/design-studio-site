'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const [onLightBg, setOnLightBg] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const rafRef = useRef(null)

  const isHomePage = pathname === '/'

  useEffect(() => {
    if (!isHomePage) {
      setLogoOpacity(1)
      setOnLightBg(false)
      setScrolled(true)
      return
    }

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const vh = window.innerHeight

        // Header logo fades in as hero logo fades out (over 30% of vh)
        const fadeProgress = Math.min(1, scrollY / (vh * 0.3))
        setLogoOpacity(fadeProgress)

        setScrolled(scrollY > 20)

        // Check if header is over light background (About section)
        const aboutSection = document.querySelector('.about')
        if (aboutSection) {
          const rect = aboutSection.getBoundingClientRect()
          // Header is about 70px tall, check if about section is under it
          setOnLightBg(rect.top < 70 && rect.bottom > 0)
        }

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

  // Toggle body class when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])


  const closeMenu = () => setMenuOpen(false)

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    closeMenu()

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
    closeMenu()
    if (pathname !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className={`header ${onLightBg ? 'on-light-bg' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <Link
        href="/"
        className="logo"
        onClick={handleHomeClick}
        style={{ opacity: logoOpacity, pointerEvents: logoOpacity > 0.1 ? 'auto' : 'none' }}
      >
        <img src="/belenko-logo.png" alt="Belenko" />
      </Link>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>{t('nav.about')}</a>
        <a href="#services" className="nav-link" onClick={(e) => handleNavClick(e, 'services')}>{t('nav.services')}</a>
        <a href="#portfolio" className="nav-link" onClick={(e) => handleNavClick(e, 'portfolio')}>{t('nav.portfolio')}</a>
        <a href="#blog" className="nav-link" onClick={(e) => handleNavClick(e, 'blog')}>{t('nav.blog')}</a>
        <a href="#career" className="nav-link" onClick={(e) => handleNavClick(e, 'career')}>{t('nav.career')}</a>
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
