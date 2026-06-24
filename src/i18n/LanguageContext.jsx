'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'uk', name: 'Українська', flag: 'UK' },
  { code: 'ru', name: 'Русский', flag: 'RU' }
]

// Detect browser language and map to supported languages
function detectBrowserLanguage() {
  if (typeof window === 'undefined') return 'en'

  const browserLang = navigator.language || navigator.userLanguage || 'en'
  const langCode = browserLang.split('-')[0].toLowerCase()

  // Map browser language to supported languages
  const langMap = {
    'en': 'en',
    'es': 'es',
    'uk': 'uk',
    'ru': 'ru',
    // Additional mappings for regional variants
    'be': 'ru', // Belarusian users often prefer Russian
    'kk': 'ru', // Kazakh users often prefer Russian
  }

  return langMap[langCode] || 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize language on client side only
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null
    if (saved) {
      setLanguage(saved)
    } else {
      setLanguage(detectBrowserLanguage())
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
    }
  }, [language, isHydrated])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Fallback to English
        value = translations['en']
        for (const fallbackKey of keys) {
          if (value && value[fallbackKey]) {
            value = value[fallbackKey]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
