'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import './ServicePage.css'

export default function ServicePageClient({
  serviceKey,
  slug,
  heroImage,
  stats,
  projects,
  // Legacy props for backwards compatibility
  title,
  subtitle,
  introTitle,
  introText,
  faqs: legacyFaqs,
  ctaTitle,
  ctaSubtitle,
  // New P1 SEO props
  process,
  deliverables,
  pricing
}) {
  const router = useRouter()
  const { t } = useLanguage()

  // Helper to get translation or fallback to prop
  const getTranslation = (key, fallback) => {
    if (!serviceKey) return fallback
    const result = t(`servicePages.${serviceKey}.${key}`)
    // If translation key is returned as-is (not found), use fallback
    if (result && !result.includes('servicePages.')) {
      return result
    }
    return fallback
  }

  const commonT = (key) => t(`servicePage.${key}`)

  const handleBackClick = (e) => {
    e.preventDefault()
    router.push('/')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openAccordion', { detail: { id: 'services' } }))
      setTimeout(() => {
        const servicesSection = document.getElementById('services')
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }, 300)
  }

  // Build FAQs from translations or legacy props
  let faqs = []
  if (serviceKey) {
    faqs = [
      { question: getTranslation('faq1q', ''), answer: getTranslation('faq1a', '') },
      { question: getTranslation('faq2q', ''), answer: getTranslation('faq2a', '') },
      { question: getTranslation('faq3q', ''), answer: getTranslation('faq3a', '') },
      { question: getTranslation('faq4q', ''), answer: getTranslation('faq4a', '') }
    ].filter(faq => faq.question && faq.answer)
  } else if (legacyFaqs) {
    faqs = legacyFaqs
  }

  // FAQ Schema for SEO
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Build intro texts from translations or legacy props
  let introTexts = []
  if (serviceKey) {
    introTexts = [
      getTranslation('introText1', ''),
      getTranslation('introText2', ''),
      getTranslation('introText3', '')
    ].filter(text => text)
  } else if (introText && Array.isArray(introText)) {
    introTexts = introText
  }

  // Get title, subtitle, etc. from translations or props
  const pageTitle = getTranslation('title', title)
  const pageSubtitle = getTranslation('subtitle', subtitle)
  const pageIntroTitle = getTranslation('introTitle', introTitle)
  const pageCtaTitle = getTranslation('ctaTitle', ctaTitle)
  const pageCtaSubtitle = getTranslation('ctaSubtitle', ctaSubtitle)

  const pageTitleForSchema = getTranslation('title', title)
  const pageSubtitleForSchema = getTranslation('subtitle', subtitle)

  const breadcrumbSchema = slug ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.belenko.design/" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.belenko.design/#services" },
      { "@type": "ListItem", "position": 3, "name": pageTitleForSchema, "item": `https://www.belenko.design/services/${slug}` }
    ]
  } : null

  const serviceSchema = slug ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": pageTitleForSchema,
    "name": pageTitleForSchema,
    "description": pageSubtitleForSchema,
    "url": `https://www.belenko.design/services/${slug}`,
    "provider": {
      "@type": "ProfessionalService",
      "name": "Belenko Design Studio",
      "url": "https://www.belenko.design",
      "address": { "@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "Spain" }
    },
    "areaServed": {
      "@type": "City",
      "name": "Barcelona",
      "containedInPlace": { "@type": "Country", "name": "Spain" }
    }
  } : null

  return (
    <div className="service-page">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <header className="service-header">
        <a href="/" className="back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </a>
        <Link href="/" className="logo">
          <img src="/belenko-logo.png" alt="Belenko" />
        </Link>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link href="/#contact" className="contact-btn">{t('nav.contact')}</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="service-hero">
        <div className="service-hero-content">
          <h1>{pageTitle}</h1>
          <p className="service-hero-subtitle">{pageSubtitle}</p>
          <Link href="/#contact" className="service-hero-cta">
            {commonT('startProject')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          {stats && (
            <div className="service-stats">
              {stats.map((stat, i) => (
                <div key={i} className="service-stat">
                  <div className="service-stat-number">{stat.number}</div>
                  <div className="service-stat-label">{stat.labelKey ? commonT(stat.labelKey) : stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Intro */}
      {(pageIntroTitle || introTexts.length > 0) && (
        <section className="service-intro">
          <div className="service-intro-grid">
            <h2>{pageIntroTitle}</h2>
            <div className="service-intro-text">
              {introTexts.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {process && process.length > 0 && (
        <section className="service-process">
          <div className="service-process-header">
            <h2>{commonT('ourProcess') || 'Our Process'}</h2>
            <p className="service-process-subtitle">{commonT('processSubtitle') || 'A proven approach to creating exceptional spaces'}</p>
          </div>
          <div className="service-process-steps">
            {process.map((step, i) => (
              <div key={i} className="process-step">
                <div className="process-step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="process-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  {step.duration && <span className="process-duration">{step.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Deliverables */}
      {deliverables && deliverables.length > 0 && (
        <section className="service-deliverables">
          <h2>{commonT('whatIncluded') || "What's Included"}</h2>
          <div className="deliverables-grid">
            {deliverables.map((item, i) => (
              <div key={i} className="deliverable-item">
                <div className="deliverable-icon">{item.icon || '✓'}</div>
                <div className="deliverable-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      {pricing && (
        <section className="service-pricing">
          <h2>{commonT('investment') || 'Investment'}</h2>
          <div className="pricing-content">
            <p className="pricing-description">{pricing.description}</p>
            {pricing.startingFrom && (
              <div className="pricing-starting">
                <span className="pricing-label">{commonT('startingFrom') || 'Starting from'}</span>
                <span className="pricing-value">{pricing.startingFrom}</span>
              </div>
            )}
            {pricing.factors && (
              <div className="pricing-factors">
                <h4>{commonT('pricingFactors') || 'Pricing depends on:'}</h4>
                <ul>
                  {pricing.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="service-projects">
          <div className="service-projects-header">
            <h2>{commonT('featuredProjects')}</h2>
          </div>
          <div className="service-projects-grid">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}/`} className="service-project-card">
                {project.image && <img src={project.image} alt={project.title} />}
                <div className="service-project-overlay">
                  <div className="service-project-title">{project.title}</div>
                  <div className="service-project-location">{project.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="service-faq">
          <h2>{commonT('faq')}</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      {(pageCtaTitle || pageCtaSubtitle) && (
        <section className="service-cta">
          <h2>{pageCtaTitle}</h2>
          <p className="service-cta-subtitle">{pageCtaSubtitle}</p>
          <Link href="/#contact" className="service-hero-cta">
            {commonT('getInTouch')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>
      )}
    </div>
  )
}
