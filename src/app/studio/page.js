'use client'

import Header from '../../components/Header'
import Hero from '../../components/Hero'
import About from '../../components/About'
import Services from '../../components/Services'
import Portfolio from '../../components/Portfolio'
import Blog from '../../components/Blog'
import Career from '../../components/Career'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'
import SocialFloat from '../../components/SocialFloat'
import AccordionSection from '../../components/AccordionSection'
import { useLanguage } from '../../i18n/LanguageContext'

export default function StudioPage() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <Hero />

      <div className="accordion-sections">
        <AccordionSection
          number="01"
          title={t('about.title')}
          id="about"
          defaultOpen={false}
        >
          <About />
        </AccordionSection>

        <AccordionSection
          number="02"
          title={t('services.title')}
          id="services"
          defaultOpen={false}
        >
          <Services />
        </AccordionSection>

        <AccordionSection
          number="03"
          title={t('nav.portfolio')}
          id="portfolio"
          defaultOpen={false}
        >
          <Portfolio />
        </AccordionSection>

        <AccordionSection
          number="04"
          title={t('nav.blog')}
          id="blog"
          defaultOpen={false}
        >
          <Blog />
        </AccordionSection>

        <AccordionSection
          number="05"
          title={t('nav.career')}
          id="career"
          defaultOpen={false}
        >
          <Career />
        </AccordionSection>

        <AccordionSection
          number="06"
          title={t('contact.title')}
          id="contact"
          defaultOpen={false}
        >
          <Contact />
        </AccordionSection>
      </div>

      <Footer />
      <SocialFloat />
    </>
  )
}
