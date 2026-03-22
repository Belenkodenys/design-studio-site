'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageContext'
import './Breadcrumbs.css'

function Breadcrumbs({ items }) {
  const { t } = useLanguage()

  // Generate JSON-LD structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://www.belenko.design${item.href}` : undefined
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs-list">
          {items.map((item, index) => (
            <li key={index} className="breadcrumbs-item">
              {index > 0 && <span className="breadcrumbs-separator">/</span>}
              {item.href && index < items.length - 1 ? (
                <Link href={item.href} className="breadcrumbs-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumbs
