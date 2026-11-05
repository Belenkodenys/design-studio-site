'use client'

import { useState } from 'react'
import Link from 'next/link'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import './Portfolio.css'

const MOBILE_PREVIEW = 3

function Card({ project }) {
  return (
    <Link href={`/project/${project.id}`} className="portfolio-card">
      {project.image && (
        <img className="portfolio-card-img" src={project.image} alt={project.title} loading="lazy" />
      )}
      <div className="portfolio-card-info">
        <h3>{project.title}</h3>
        <span>{project.category}</span>
      </div>
    </Link>
  )
}

// On phones only the first three projects are shown; "More" unfolds the rest
// as an accordion. On wider screens every project is shown at once (CSS).
function Portfolio() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const head = projects.slice(0, MOBILE_PREVIEW)
  const rest = projects.slice(MOBILE_PREVIEW)

  return (
    <section className="portfolio">
      <div className="portfolio-grid">
        {head.map((project) => (
          <Card key={project.id} project={project} />
        ))}
        <div className={`portfolio-more-wrap${open ? ' is-open' : ''}`}>
          <div className="portfolio-more-inner">
            {rest.map((project) => (
              <Card key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      {!open && rest.length > 0 && (
        <button type="button" className="portfolio-more-btn" onClick={() => setOpen(true)}>
          More Projects <span className="portfolio-more-count">+{rest.length}</span>
        </button>
      )}
    </section>
  )
}

export default Portfolio
