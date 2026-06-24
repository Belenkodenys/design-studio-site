import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CTA.css'

gsap.registerPlugin(ScrollTrigger)

function CTA() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const button = buttonRef.current

    if (!section) return

    // Create timeline for coordinated animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    // Title reveal with clip-path
    tl.fromTo(
      title,
      {
        opacity: 0,
        y: 60,
        clipPath: 'inset(100% 0% 0% 0%)'
      },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        ease: 'power4.out'
      }
    )

    // Subtitle fade up
    tl.fromTo(
      subtitle,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )

    // Button scale and fade
    tl.fromTo(
      button,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.4'
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section className="cta" ref={sectionRef}>
      <div className="cta-container">
        <h2 ref={titleRef} className="section-title light">
          {t('cta.title')}
        </h2>
        <p ref={subtitleRef} className="cta-subtitle">
          {t('cta.subtitle')}
        </p>
        <a ref={buttonRef} href="#contact" className="cta-button">
          {t('cta.button')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}

export default CTA
