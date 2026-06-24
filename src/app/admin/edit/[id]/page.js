'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import '../../admin.css'

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), { ssr: false })

export default function EditPostPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('en')

  const [formData, setFormData] = useState({
    slug: '',
    status: 'draft',
    category: 'Design',
    imageUrl: '',
    title_en: '', content_en: '', excerpt_en: '',
    title_uk: '', content_uk: '', excerpt_uk: '',
    title_ru: '', content_ru: '', excerpt_ru: '',
    title_es: '', content_es: '', excerpt_es: ''
  })

  useEffect(() => {
    checkAuthAndLoadPost()
  }, [id])

  const checkAuthAndLoadPost = async () => {
    const authRes = await fetch('/api/cms/auth')
    if (!authRes.ok) {
      router.push('/admin')
      return
    }

    try {
      const res = await fetch(`/api/cms/posts/${id}`)
      if (res.ok) {
        const data = await res.json()
        const post = data.post

        setFormData({
          slug: post.slug || '',
          status: post.status || 'draft',
          category: post.category || 'Design',
          imageUrl: post.imageUrl || '',
          title_en: post.translations?.en?.title || '',
          content_en: post.translations?.en?.content || '',
          excerpt_en: post.translations?.en?.excerpt || '',
          title_uk: post.translations?.uk?.title || '',
          content_uk: post.translations?.uk?.content || '',
          excerpt_uk: post.translations?.uk?.excerpt || '',
          title_ru: post.translations?.ru?.title || '',
          content_ru: post.translations?.ru?.content || '',
          excerpt_ru: post.translations?.ru?.excerpt || '',
          title_es: post.translations?.es?.title || '',
          content_es: post.translations?.es?.content || '',
          excerpt_es: post.translations?.es?.excerpt || ''
        })
      } else {
        router.push('/admin')
      }
    } catch (err) {
      console.error('Failed to load post:', err)
      router.push('/admin')
    }

    setIsLoading(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (res.ok) {
        const data = await res.json()
        handleChange('imageUrl', data.url)
      } else {
        alert('Ошибка загрузки изображения')
      }
    } catch (err) {
      alert('Ошибка загрузки')
    }
  }

  const handleSubmit = async (status) => {
    setIsSaving(true)

    try {
      const res = await fetch(`/api/cms/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status })
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        alert('Ошибка сохранения')
      }
    } catch (err) {
      alert('Ошибка сервера')
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return <div className="admin-loading"><div className="spinner"></div></div>
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' }
  ]

  return (
    <div className="admin-editor">
      <header className="editor-header">
        <div className="editor-header-left">
          <button onClick={() => router.push('/admin')} className="admin-btn secondary">
            ← Назад
          </button>
          <h1>Редактирование поста</h1>
        </div>
        <div className="editor-header-right">
          <button
            onClick={() => handleSubmit('draft')}
            className="admin-btn secondary"
            disabled={isSaving}
          >
            Сохранить черновик
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className="admin-btn primary"
            disabled={isSaving}
          >
            {formData.status === 'published' ? 'Обновить' : 'Опубликовать'}
          </button>
        </div>
      </header>

      <main className="editor-main">
        <div className="form-row">
          <div className="form-group">
            <label>Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="my-post-url"
            />
          </div>
          <div className="form-group">
            <label>Категория</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="Design">Design</option>
              <option value="Trends">Trends</option>
              <option value="Tips">Tips</option>
              <option value="Projects">Projects</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Изображение</label>
          <div
            className={`image-upload ${formData.imageUrl ? 'has-image' : ''}`}
            onClick={() => document.getElementById('image-input').click()}
          >
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Preview" />
            ) : (
              <p>Нажмите для загрузки изображения</p>
            )}
          </div>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div className="language-tabs">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-tab ${activeTab === lang.code ? 'active' : ''}`}
              onClick={() => setActiveTab(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {languages.map((lang) => (
          <div key={lang.code} style={{ display: activeTab === lang.code ? 'block' : 'none' }}>
            <div className="form-group">
              <label>Заголовок ({lang.name})</label>
              <input
                type="text"
                value={formData[`title_${lang.code}`]}
                onChange={(e) => handleChange(`title_${lang.code}`, e.target.value)}
                placeholder={`Заголовок на ${lang.name}`}
              />
            </div>

            <div className="form-group">
              <label>Краткое описание ({lang.name})</label>
              <textarea
                value={formData[`excerpt_${lang.code}`]}
                onChange={(e) => handleChange(`excerpt_${lang.code}`, e.target.value)}
                placeholder={`Краткое описание на ${lang.name}`}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Контент ({lang.name})</label>
              <RichTextEditor
                content={formData[`content_${lang.code}`]}
                onChange={(content) => handleChange(`content_${lang.code}`, content)}
              />
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
