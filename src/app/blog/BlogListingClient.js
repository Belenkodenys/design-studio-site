'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import SocialFloat from '../../components/SocialFloat'
import './BlogListing.css'

function BlogPostCard({ post, index }) {
  const { language } = useLanguage()

  const title = post.title[language] || post.title.en
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

  return (
    <Link
      href={`/blog/${post.slug}/`}
      className={`blog-card animate-fade-up delay-${(index % 3) + 1}`}
    >
      <div className="blog-card-image">
        <img src={post.image} alt={title} loading="lazy" />
      </div>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="blog-card-category">{post.category}</span>
          <span className="blog-card-date">{formatDate(post.date)}</span>
        </div>
        <h2 className="blog-card-title">{title}</h2>
        <p className="blog-card-excerpt">{excerpt}</p>
        <div className="blog-card-footer">
          <span className="blog-card-read-time">{post.readTime} min read</span>
          <span className="blog-card-link">
            Read more
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogListingClient({ posts }) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleBackClick = (e) => {
    e.preventDefault()
    router.push('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="blog-listing-page">
      <header className="blog-listing-header">
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
          <Link href="/#contact" className="header-contact-btn">{t('nav.contact')}</Link>
        </div>
      </header>

      <div className="blog-listing-content">
        <div className="blog-listing-intro">
          <h1 className="blog-listing-title">{t('blog.title')}</h1>
          <p className="blog-listing-subtitle">
            Expert insights on restaurant, bar, and hospitality interior design.
            Tips on lighting, materials, color psychology, and industry trends.
          </p>
        </div>

        <div className="blog-cards-grid">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <div className="blog-cta-section">
          <h2>Have a project in mind?</h2>
          <p>Let's create something extraordinary together.</p>
          <Link href="/#contact" className="cta-button">Start a Conversation</Link>
        </div>
      </div>

      <SocialFloat />
    </div>
  )
}
