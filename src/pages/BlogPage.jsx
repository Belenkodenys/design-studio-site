import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './BlogPage.css'

function TelegramPost({ post, index }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <article
      ref={ref}
      className={`telegram-post animate-fade-up ${isVisible ? 'visible' : ''} delay-${(index % 3) + 1}`}
    >
      {post.images && post.images.length > 0 && (
        <div className="telegram-post-images">
          {post.images.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className={post.images.length === 1 ? 'single' : ''}
            />
          ))}
        </div>
      )}
      <div className="telegram-post-content">
        <span className="telegram-post-date">{formatDate(post.date)}</span>
        {post.content && (
          <p className="telegram-post-text">{post.content}</p>
        )}
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-post-link"
        >
          Читать в Telegram
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  )
}

function BlogPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/telegram-posts')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="blog-page">
      <header className="blog-page-header">
        <a href="/" className="back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </a>
        <a href="/" className="logo" onClick={handleBackClick}>BELENKO</a>
        <div className="header-spacer"></div>
      </header>

      <div className="blog-page-content">
        <div className="blog-page-intro">
          <h1 className="blog-page-title">{t('blog.title')}</h1>
          <p className="blog-page-subtitle">{t('blog.subtitle')}</p>
          <a
            href="https://t.me/belenko_studio"
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-channel-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            @belenko_studio
          </a>
        </div>

        {loading && (
          <div className="blog-loading">
            <div className="loading-spinner"></div>
            <p>Загрузка постов...</p>
          </div>
        )}

        {error && (
          <div className="blog-error">
            <p>Не удалось загрузить посты</p>
            <a href="https://t.me/belenko_studio" target="_blank" rel="noopener noreferrer">
              Перейти в Telegram-канал
            </a>
          </div>
        )}

        {!loading && !error && (
          <div className="telegram-posts">
            {posts.map((post, index) => (
              <TelegramPost key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
