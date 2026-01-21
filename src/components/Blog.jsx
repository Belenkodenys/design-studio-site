import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './Blog.css'

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

function Blog() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section className="blog" id="blog">
      <div className="blog-container">
        <header
          ref={titleRef}
          className={`blog-header animate-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title dark">{t('blog.title')}</h2>
          <p className="blog-subtitle">{t('blog.subtitle')}</p>
        </header>

        <div className="blog-grid">
          {blogPostsData.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
