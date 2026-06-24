'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../i18n/LanguageContext'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import SocialFloat from '../../../components/SocialFloat'
import './BlogPost.css'

export default function BlogPostClient({ post, relatedProjects }) {
  const { language, t } = useLanguage()
  const router = useRouter()

  const title = post.title[language] || post.title.en
  const content = post.content[language] || post.content.en
  const excerpt = post.excerpt[language] || post.excerpt.en

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const locale = language === 'ru' ? 'ru-RU' : language === 'uk' ? 'uk-UA' : language === 'es' ? 'es-ES' : 'en-US'
      return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Simple markdown-like rendering
  const renderContent = (text) => {
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="blog-list">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(<h2 key={index}>{trimmedLine.replace('## ', '')}</h2>)
      } else if (trimmedLine.startsWith('### ')) {
        flushList()
        elements.push(<h3 key={index}>{trimmedLine.replace('### ', '')}</h3>)
      } else if (trimmedLine.startsWith('- **')) {
        // List item with bold
        const match = trimmedLine.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/)
        if (match) {
          currentList.push(<><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</>)
        }
      } else if (trimmedLine.startsWith('- ')) {
        currentList.push(trimmedLine.replace('- ', ''))
      } else if (trimmedLine === '') {
        flushList()
      } else if (trimmedLine) {
        flushList()
        // Handle bold text within paragraphs
        const boldRegex = /\*\*(.+?)\*\*/g
        const parts = trimmedLine.split(boldRegex)
        const formattedParts = parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )
        elements.push(<p key={index}>{formattedParts}</p>)
      }
    })

    flushList()
    return elements
  }

  return (
    <div className="blog-post-page">
      <header className="blog-post-header">
        <Link href="/blog/" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </Link>
        <Link href="/" className="logo">
          <img src="/belenko-logo.png" alt="Belenko" />
        </Link>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link href="/#contact" className="header-contact-btn">{t('nav.contact')}</Link>
        </div>
      </header>

      <article className="blog-post-content">
        <div className="blog-post-hero">
          <img src={post.image} alt={title} className="blog-post-hero-image" />
        </div>

        <div className="blog-post-body">
          <div className="blog-post-meta">
            <span className="blog-post-category">{post.category}</span>
            <span className="blog-post-date">{formatDate(post.date)}</span>
            <span className="blog-post-read-time">{post.readTime} min read</span>
          </div>

          <h1 className="blog-post-title">{title}</h1>
          {!post.isHtml && <p className="blog-post-excerpt">{excerpt}</p>}

          <div className="blog-post-text">
            {post.isHtml
              ? <div dangerouslySetInnerHTML={{ __html: content }} />
              : renderContent(content)}
          </div>

          {relatedProjects && relatedProjects.length > 0 && (
            <div className="blog-post-related">
              <h3>Related Projects</h3>
              <div className="related-projects-grid">
                {relatedProjects.map(project => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}/`}
                    className="related-project-card"
                  >
                    {project.image && <img src={project.image} alt={project.title} />}
                    <div className="related-project-info">
                      <span className="related-project-title">{project.title}</span>
                      <span className="related-project-location">{project.location}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="blog-post-cta">
            <h3>Ready to transform your space?</h3>
            <p>Let's discuss your restaurant, bar, or hospitality project.</p>
            <Link href="/#contact" className="cta-button">Get in Touch</Link>
          </div>
        </div>
      </article>

      <SocialFloat />
    </div>
  )
}
