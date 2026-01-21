import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../i18n/LanguageContext'
import './Services.css'

const serviceImages = [
  '/service-1.jpg',
  '/service-2.jpg',
  '/service-3.jpg',
  '/service-4.jpg',
  '/service-5.jpg',
  '/service-6.jpg'
]

function ServiceCard({ serviceKey, image, index }) {
  const { t } = useLanguage()
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={`service-card animate-fade-up ${isVisible ? 'visible' : ''} delay-${(index % 3) + 1}`}
    >
      <div className="service-image">
        <img src={image} alt={t(`services.service${serviceKey}Title`)} loading="lazy" />
      </div>
      <div className="service-content">
        <h3 className="service-title">{t(`services.service${serviceKey}Title`)}</h3>
        <p className="service-description">{t(`services.service${serviceKey}Text`)}</p>
      </div>
    </article>
  )
}

function Services() {
  const { t } = useLanguage()
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section className="services" id="services">
      <div className="services-container">
        <header
          ref={titleRef}
          className={`services-header animate-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title dark">{t('services.title')}</h2>
          <p className="services-subtitle">{t('services.subtitle')}</p>
        </header>

        <div className="services-grid">
          {serviceImages.map((image, index) => (
            <ServiceCard key={image} serviceKey={index + 1} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
