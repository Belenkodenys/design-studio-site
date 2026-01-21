import { useState, useRef, useEffect } from 'react'
import { useLanguage, languages } from '../i18n/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = languages.find(l => l.code === language)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {currentLang?.flag}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={isOpen ? 'rotated' : ''}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === language ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
