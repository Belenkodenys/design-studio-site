import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './BlogPage.css'

const blogPostsData = [
  { id: 1, date: '2024', category: 'Design', image: '/bella-1.jpg' },
  { id: 2, date: '2024', category: 'Insights', image: '/projects/mamaliga-1.jpg' },
  { id: 3, date: '2024', category: 'Trends', image: '/projects/sereia-1.jpg' }
]

function BlogCard({ post, index }) {
  const { t } = useLanguage()
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={`blog-card animate-fade-up ${isVisible ? 'visible' : ''} delay-${(index % 3) + 1}`}
    >
      <div className="blog-card-image">
        <img src={post.image} alt={t(`blog.post${post.id}Title`)} loading="lazy" />
        <span className="blog-card-category">{post.category}</span>
      </div>
      <div className="blog-card-content">
        <span className="blog-card-date">{post.date}</span>
        <h3 className="blog-card-title">{t(`blog.post${post.id}Title`)}</h3>
        <p className="blog-card-excerpt">{t(`blog.post${post.id}Excerpt`)}</p>
        <span className="blog-card-link">{t('blog.readMore')}</span>
      </div>
    </article>
  )
}

function BlogPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()

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
        </div>

        <div className="blog-grid">
          {blogPostsData.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPage
