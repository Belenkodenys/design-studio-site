'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import './Brief.css'

export default function BriefPageClient() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    // Contact Info
    name: '',
    company: '',
    email: '',
    phone: '',

    // Project Info
    projectType: '',
    projectName: '',
    city: '',
    address: '',
    area: '',

    // Concept
    concept: '',
    targetAudience: '',
    competitors: '',
    references: '',

    // Budget & Timeline
    budget: '',
    timeline: '',
    startDate: '',

    // Additional
    additionalInfo: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/briefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Error submitting brief. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const texts = {
    en: {
      title: 'Project Brief',
      subtitle: 'Please fill out this form to help us understand your project better',

      contactSection: 'Contact Information',
      name: 'Your Name',
      company: 'Company Name',
      email: 'Email',
      phone: 'Phone',

      projectSection: 'Project Information',
      projectType: 'Project Type',
      projectTypeOptions: ['Restaurant', 'Bar', 'Cafe', 'Hotel', 'Other'],
      projectName: 'Project Name (if any)',
      city: 'City',
      address: 'Address (if known)',
      area: 'Approximate Area (m²)',

      conceptSection: 'Concept & Vision',
      concept: 'Describe your concept or idea',
      conceptPlaceholder: 'What atmosphere do you want to create? What story should the space tell?',
      targetAudience: 'Target Audience',
      targetAudiencePlaceholder: 'Who are your guests? Age, interests, income level...',
      competitors: 'Competitors or Inspirations',
      competitorsPlaceholder: 'List similar establishments you admire or want to differ from',
      references: 'Visual References',
      referencesPlaceholder: 'Links to Pinterest boards, Instagram accounts, or websites',

      budgetSection: 'Budget & Timeline',
      budget: 'Approximate Budget',
      budgetOptions: ['Under €50,000', '€50,000 - €100,000', '€100,000 - €200,000', '€200,000 - €500,000', 'Over €500,000', 'Not determined yet'],
      timeline: 'Desired Timeline',
      timelineOptions: ['3-6 months', '6-12 months', '12+ months', 'Flexible'],
      startDate: 'Desired Start Date',

      additionalSection: 'Additional Information',
      additionalInfo: 'Anything else you would like to share',
      additionalPlaceholder: 'Special requirements, questions, comments...',

      submit: 'Submit Brief',
      submitting: 'Sending...',

      successTitle: 'Thank you!',
      successMessage: 'Your brief has been submitted successfully. We will contact you within 24 hours.',
      backHome: 'Back to Home'
    },
    ru: {
      title: 'Бриф проекта',
      subtitle: 'Пожалуйста, заполните форму, чтобы мы лучше поняли ваш проект',

      contactSection: 'Контактная информация',
      name: 'Ваше имя',
      company: 'Название компании',
      email: 'Email',
      phone: 'Телефон',

      projectSection: 'Информация о проекте',
      projectType: 'Тип проекта',
      projectTypeOptions: ['Ресторан', 'Бар', 'Кафе', 'Отель', 'Другое'],
      projectName: 'Название проекта (если есть)',
      city: 'Город',
      address: 'Адрес (если известен)',
      area: 'Примерная площадь (м²)',

      conceptSection: 'Концепция и видение',
      concept: 'Опишите вашу концепцию или идею',
      conceptPlaceholder: 'Какую атмосферу вы хотите создать? Какую историю должно рассказывать пространство?',
      targetAudience: 'Целевая аудитория',
      targetAudiencePlaceholder: 'Кто ваши гости? Возраст, интересы, уровень дохода...',
      competitors: 'Конкуренты или вдохновение',
      competitorsPlaceholder: 'Перечислите похожие заведения, которыми восхищаетесь или от которых хотите отличаться',
      references: 'Визуальные референсы',
      referencesPlaceholder: 'Ссылки на Pinterest-доски, Instagram-аккаунты или сайты',

      budgetSection: 'Бюджет и сроки',
      budget: 'Примерный бюджет',
      budgetOptions: ['До €50,000', '€50,000 - €100,000', '€100,000 - €200,000', '€200,000 - €500,000', 'Более €500,000', 'Пока не определён'],
      timeline: 'Желаемые сроки',
      timelineOptions: ['3-6 месяцев', '6-12 месяцев', '12+ месяцев', 'Гибко'],
      startDate: 'Желаемая дата начала',

      additionalSection: 'Дополнительная информация',
      additionalInfo: 'Что-нибудь ещё, чем хотели бы поделиться',
      additionalPlaceholder: 'Особые требования, вопросы, комментарии...',

      submit: 'Отправить бриф',
      submitting: 'Отправка...',

      successTitle: 'Спасибо!',
      successMessage: 'Ваш бриф успешно отправлен. Мы свяжемся с вами в течение 24 часов.',
      backHome: 'На главную'
    },
    uk: {
      title: 'Бриф проекту',
      subtitle: 'Будь ласка, заповніть форму, щоб ми краще зрозуміли ваш проект',

      contactSection: 'Контактна інформація',
      name: 'Ваше ім\'я',
      company: 'Назва компанії',
      email: 'Email',
      phone: 'Телефон',

      projectSection: 'Інформація про проект',
      projectType: 'Тип проекту',
      projectTypeOptions: ['Ресторан', 'Бар', 'Кафе', 'Готель', 'Інше'],
      projectName: 'Назва проекту (якщо є)',
      city: 'Місто',
      address: 'Адреса (якщо відома)',
      area: 'Приблизна площа (м²)',

      conceptSection: 'Концепція та бачення',
      concept: 'Опишіть вашу концепцію або ідею',
      conceptPlaceholder: 'Яку атмосферу ви хочете створити? Яку історію має розповідати простір?',
      targetAudience: 'Цільова аудиторія',
      targetAudiencePlaceholder: 'Хто ваші гості? Вік, інтереси, рівень доходу...',
      competitors: 'Конкуренти або натхнення',
      competitorsPlaceholder: 'Перелічіть схожі заклади, якими захоплюєтесь або від яких хочете відрізнятись',
      references: 'Візуальні референси',
      referencesPlaceholder: 'Посилання на Pinterest-дошки, Instagram-акаунти або сайти',

      budgetSection: 'Бюджет та терміни',
      budget: 'Приблизний бюджет',
      budgetOptions: ['До €50,000', '€50,000 - €100,000', '€100,000 - €200,000', '€200,000 - €500,000', 'Понад €500,000', 'Поки не визначено'],
      timeline: 'Бажані терміни',
      timelineOptions: ['3-6 місяців', '6-12 місяців', '12+ місяців', 'Гнучко'],
      startDate: 'Бажана дата початку',

      additionalSection: 'Додаткова інформація',
      additionalInfo: 'Що-небудь ще, чим хотіли б поділитись',
      additionalPlaceholder: 'Особливі вимоги, питання, коментарі...',

      submit: 'Надіслати бриф',
      submitting: 'Надсилання...',

      successTitle: 'Дякуємо!',
      successMessage: 'Ваш бриф успішно надіслано. Ми зв\'яжемось з вами протягом 24 годин.',
      backHome: 'На головну'
    },
    es: {
      title: 'Brief del Proyecto',
      subtitle: 'Por favor, complete este formulario para ayudarnos a entender mejor su proyecto',

      contactSection: 'Información de Contacto',
      name: 'Su Nombre',
      company: 'Nombre de la Empresa',
      email: 'Email',
      phone: 'Teléfono',

      projectSection: 'Información del Proyecto',
      projectType: 'Tipo de Proyecto',
      projectTypeOptions: ['Restaurante', 'Bar', 'Cafetería', 'Hotel', 'Otro'],
      projectName: 'Nombre del Proyecto (si lo tiene)',
      city: 'Ciudad',
      address: 'Dirección (si se conoce)',
      area: 'Área Aproximada (m²)',

      conceptSection: 'Concepto y Visión',
      concept: 'Describa su concepto o idea',
      conceptPlaceholder: '¿Qué atmósfera quiere crear? ¿Qué historia debe contar el espacio?',
      targetAudience: 'Público Objetivo',
      targetAudiencePlaceholder: '¿Quiénes son sus clientes? Edad, intereses, nivel de ingresos...',
      competitors: 'Competidores o Inspiraciones',
      competitorsPlaceholder: 'Liste establecimientos similares que admire o de los que quiera diferenciarse',
      references: 'Referencias Visuales',
      referencesPlaceholder: 'Enlaces a tableros de Pinterest, cuentas de Instagram o sitios web',

      budgetSection: 'Presupuesto y Plazos',
      budget: 'Presupuesto Aproximado',
      budgetOptions: ['Menos de €50,000', '€50,000 - €100,000', '€100,000 - €200,000', '€200,000 - €500,000', 'Más de €500,000', 'Aún no determinado'],
      timeline: 'Plazo Deseado',
      timelineOptions: ['3-6 meses', '6-12 meses', '12+ meses', 'Flexible'],
      startDate: 'Fecha de Inicio Deseada',

      additionalSection: 'Información Adicional',
      additionalInfo: 'Algo más que le gustaría compartir',
      additionalPlaceholder: 'Requisitos especiales, preguntas, comentarios...',

      submit: 'Enviar Brief',
      submitting: 'Enviando...',

      successTitle: '¡Gracias!',
      successMessage: 'Su brief ha sido enviado con éxito. Nos pondremos en contacto con usted en 24 horas.',
      backHome: 'Volver al Inicio'
    }
  }

  const t = texts[language] || texts.en

  if (isSubmitted) {
    return (
      <div className="brief-page">
        <div className="brief-success">
          <img src="/belenko-logo.png" alt="Belenko" className="success-logo" />
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>{t.successTitle}</h1>
          <p>{t.successMessage}</p>
          <Link href="/" className="back-home-btn">{t.backHome}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="brief-page">
      <div className="brief-container">
        <header className="brief-header">
          <div className="brief-header-top">
            <Link href="/" className="brief-logo">
              <img src="/belenko-logo.png" alt="Belenko" />
            </Link>
            <LanguageSwitcher />
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </header>

        <form onSubmit={handleSubmit} className="brief-form">
          {/* Contact Section */}
          <section className="form-section">
            <h2>{t.contactSection}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">{t.name} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">{t.company}</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t.email} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">{t.phone} *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Project Section */}
          <section className="form-section">
            <h2>{t.projectSection}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="projectType">{t.projectType} *</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                >
                  <option value="">—</option>
                  {t.projectTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="projectName">{t.projectName}</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">{t.city} *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">{t.address}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="area">{t.area}</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                />
              </div>
            </div>
          </section>

          {/* Concept Section */}
          <section className="form-section">
            <h2>{t.conceptSection}</h2>
            <div className="form-group full-width">
              <label htmlFor="concept">{t.concept}</label>
              <textarea
                id="concept"
                name="concept"
                value={formData.concept}
                onChange={handleChange}
                rows="4"
                placeholder={t.conceptPlaceholder}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="targetAudience">{t.targetAudience}</label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                rows="3"
                placeholder={t.targetAudiencePlaceholder}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="competitors">{t.competitors}</label>
              <textarea
                id="competitors"
                name="competitors"
                value={formData.competitors}
                onChange={handleChange}
                rows="3"
                placeholder={t.competitorsPlaceholder}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="references">{t.references}</label>
              <textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                rows="3"
                placeholder={t.referencesPlaceholder}
              />
            </div>
          </section>

          {/* Budget Section */}
          <section className="form-section">
            <h2>{t.budgetSection}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="budget">{t.budget}</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  {t.budgetOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="timeline">{t.timeline}</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  {t.timelineOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">{t.startDate}</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Additional Section */}
          <section className="form-section">
            <h2>{t.additionalSection}</h2>
            <div className="form-group full-width">
              <label htmlFor="additionalInfo">{t.additionalInfo}</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="4"
                placeholder={t.additionalPlaceholder}
              />
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
