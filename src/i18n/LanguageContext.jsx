import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'uk', name: 'Українська', flag: 'UK' },
  { code: 'ru', name: 'Русский', flag: 'RU' }
]

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

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
