import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { projectTranslations } from '../i18n/projectTranslations'
import SEO from '../components/SEO'
import './AllProjects.css'

function AllProjects() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getProjectTitle = (projectId) => {
    const trans = projectTranslations[projectId]
    if (trans && trans[language]) {
      return trans[language].title
    }
    return trans?.en?.title || ''
  }

  return (
    <div className="all-projects">
      <SEO
        title="All Projects — Restaurant & Bar Interior Design Portfolio"
        description={`Explore ${projects.length} restaurant, bar, and hospitality interior design projects by Belenko Studio. Projects in Ukraine, Turkey, Spain, Azerbaijan and more.`}
        url="/projects"
      />
      <header className="all-projects-header">
        <a href="/" className="back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('project.back')}
        </a>
        <a href="/" className="logo" onClick={handleBackClick}>
          <img src="/belenko-logo.png" alt="Belenko" />
        </a>
        <div className="header-spacer"></div>
      </header>

      <div className="all-projects-content">
        <h1 className="all-projects-title">{t('allProjects.title')}</h1>
        <p className="all-projects-count">{projects.length} {t('allProjects.projects')}</p>

        <div className="projects-grid">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="project-card"
            >
              <div className="project-card-image">
                {project.image && <img src={project.image} alt={getProjectTitle(project.id) || project.title} loading="lazy" />}
              </div>
              <div className="project-card-info">
                <span className="project-card-category">{project.category}</span>
                <h3 className="project-card-title">{getProjectTitle(project.id) || project.title}</h3>
                <span className="project-card-location">{project.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllProjects
