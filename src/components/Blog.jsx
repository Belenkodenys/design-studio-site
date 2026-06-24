'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import { blogPosts as staticBlogPosts } from '../data/blogPosts'
import './Blog.css'

function BlogCard({ post, index }) {
  const { language, t } = useLanguage()
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const title = post.title[language] || post.title.en
  const excerpt = post.excerpt[language] || post.excerpt.en

  return (
    <Link
      href={`/blog/${post.slug}`}
      ref={ref}
      className={`blog-card animate-fade-up ${isVisible ? 'visible' : ''} delay-${(index % 3) + 1}`}
    >
      <div className="blog-card-image">
        <img src={post.image} alt={title} loading="lazy" />
        {post.category && <span className="blog-card-category">{post.category}</span>}
      </div>
      <div className="blog-card-content">
        <span className="blog-card-date">
          {new Date(post.date).toLocaleDateString(
            language === 'ru' ? 'ru-RU' : language === 'uk' ? 'uk-UA' : language === 'es' ? 'es-ES' : 'en-US',
            { day: 'numeric', month: 'long', year: 'numeric' }
          )}
        </span>
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>
        <span className="blog-card-link">{t('blog.readMore')}</span>
      </div>
    </Link>
  )
}

function Blog() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })
  const [adminPosts, setAdminPosts] = useState([])

  useEffect(() => {
    fetch('/api/blog/published')
      .then((r) => (r.ok ? r.json() : []))
      .then((posts) => setAdminPosts(Array.isArray(posts) ? posts : []))
      .catch(() => setAdminPosts([]))
  }, [])

  const allPosts = [...adminPosts, ...staticBlogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section className="blog">
      <div className="blog-container">
        <header
          ref={titleRef}
          className={`blog-header animate-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title dark">{t('blog.title')}</h2>
          <p className="blog-subtitle">{t('blog.subtitle')}</p>
        </header>

        <div className="blog-grid">
          {allPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
