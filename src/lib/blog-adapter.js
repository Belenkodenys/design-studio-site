const LANGUAGES = ['en', 'ru', 'uk', 'es']

function extractFirstImage(html) {
  const m = (html || '').match(/<img[^>]+src="([^"]+)"/i)
  return m ? m[1] : '/hero-bg.jpg'
}

function htmlToText(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function readTime(html) {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function adaptAdminPost(post) {
  const baseTitle = post.title || post.slug
  const baseContent = post.content || ''
  const baseExcerpt = post.metaDescription || htmlToText(baseContent).slice(0, 160)

  const title = {}
  const content = {}
  const excerpt = {}
  for (const lang of LANGUAGES) {
    const tr = post.translations?.[lang]
    title[lang] = tr?.title || baseTitle
    content[lang] = tr?.content || baseContent
    excerpt[lang] = tr?.metaDescription || (tr?.content ? htmlToText(tr.content).slice(0, 160) : baseExcerpt)
  }

  return {
    id: post.slug,
    slug: post.slug,
    title,
    excerpt,
    content,
    image: extractFirstImage(baseContent),
    category: 'Blog',
    date: post.createdAt,
    readTime: readTime(baseContent),
    isHtml: true,
  }
}
