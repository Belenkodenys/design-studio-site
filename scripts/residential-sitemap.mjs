// Builds src/data/residentialSitemap.json from the static Residential pages
// (public/residential/**/index.html): one entry per indexable page with its images.
// Runs before every build, so new pages and pictures reach the sitemap by themselves.
import fs from 'node:fs'
import path from 'node:path'
const root = path.join(process.cwd(), 'public', 'residential')
const out = []
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== 'mail') walk(p) }
    else if (e.name === 'index.html') {
      const html = fs.readFileSync(p, 'utf8')
      const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || ''
      if (/noindex/.test(robots)) continue
      const rel = path.relative(root, dir).split(path.sep).join('/')
      const images = [...new Set([...html.matchAll(/<(?:img|video)[^>]*(?:src|poster)="(\/residential\/[^"]+\.(?:webp|jpg|jpeg|png))"/g)].map((m) => m[1]))]
        .filter((s) => !/logo|mark-white|icon/.test(s))
      out.push({ path: '/residential' + (rel ? '/' + rel : ''), images, lastModified: fs.statSync(p).mtime.toISOString().slice(0, 10) })
    }
  }
}
walk(root)
out.sort((a, b) => a.path.localeCompare(b.path))
fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'residentialSitemap.json'), JSON.stringify(out, null, 1) + '\n')
console.log(`residential sitemap: ${out.length} pages, ${out.reduce((n, p) => n + p.images.length, 0)} images`)
