'use client'

import Link from 'next/link'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import './Portfolio.css'

function Portfolio() {
  const { t } = useLanguage()

  return (
    <section className="portfolio">
      <div className="portfolio-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="portfolio-card"
          >
            {project.image && (
              <img
                className="portfolio-card-img"
                src={project.image}
                alt={project.title}
                loading="lazy"
              />
            )}
            <div className="portfolio-card-info">
              <h3>{project.title}</h3>
              <span>{project.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Portfolio
