import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })
  const [infoRef, infoVisible] = useScrollAnimation({ threshold: 0.1 })
  const [formRef, formVisible] = useScrollAnimation({ threshold: 0.1 })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'e88480f3-403a-4b70-aa15-80625df1c6db',
          to: 'studiobelenko@gmail.com',
          subject: `New message from ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        // Meta Pixel Lead event
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead')
        }
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div
          ref={infoRef}
          className={`contact-info animate-fade-left ${infoVisible ? 'visible' : ''}`}
        >
          <h2
            ref={titleRef}
            className={`section-title dark animate-fade-up ${titleVisible ? 'visible' : ''}`}
          >
            {t('contact.title')}
          </h2>
          <p className="contact-description">
            {t('contact.description')}
          </p>

          <div className="contact-links">
            <a href="https://instagram.com/belenko" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
              Instagram
            </a>
            <a href="https://t.me/belenko_studio" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Telegram
            </a>
            <a href="https://wa.me/34671825489" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.63 21 7.89 20.47 6.4 19.56L2 21L3.44 16.6C2.53 15.11 2 13.37 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              WhatsApp
            </a>
          </div>

          <div className="contact-direct">
            <p>
              <strong>{t('contact.phone')}:</strong> +34 67182 54 89
            </p>
            <p>
              <strong>{t('contact.email')}:</strong> info@belenko.studio
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div
            ref={formRef}
            className={`contact-form contact-success animate-fade-right ${formVisible ? 'visible' : ''}`}
          >
            <div className="success-message">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#0a0a0a" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>{t('contact.successTitle')}</h3>
              <p>{t('contact.successText')}</p>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            className={`contact-form animate-fade-right ${formVisible ? 'visible' : ''}`}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder={t('contact.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder={t('contact.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder={t('contact.messagePlaceholder')}
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? t('contact.sending') : t('contact.send')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Contact
