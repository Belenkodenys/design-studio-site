'use client'

import { useState, useRef, useEffect } from 'react'
import './AccordionSection.css'

export default function AccordionSection({
  title,
  number,
  children,
  defaultOpen = false,
  id
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMounted, setIsMounted] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px')

  // Ensure consistent hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Listen for openAccordion events from navigation
  useEffect(() => {
    const handleOpenAccordion = (e) => {
      if (e.detail.id === id) {
        setIsOpen(true)
      }
    }

    window.addEventListener('openAccordion', handleOpenAccordion)
    return () => window.removeEventListener('openAccordion', handleOpenAccordion)
  }, [id])

  useEffect(() => {
    if (!isMounted) return

    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight}px`)
      const timer = setTimeout(() => {
        setHeight('auto')
        // Refresh ScrollTrigger after accordion animation completes
        if (typeof window !== 'undefined' && window.ScrollTrigger) {
          window.ScrollTrigger.refresh()
        }
      }, 700)
      return () => clearTimeout(timer)
    } else {
      if (contentRef.current?.scrollHeight) {
        setHeight(`${contentRef.current.scrollHeight}px`)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setHeight('0px')
          })
        })
      }
    }
  }, [isOpen, isMounted])

  return (
    <div className={`accordion-section ${isOpen ? 'open' : 'closed'}`} id={id}>
      <button
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="accordion-header-left">
          {number && <span className="accordion-number">{number}</span>}
          <span className="accordion-title">{title}</span>
        </span>
        <span className="accordion-icon">
          <span className="accordion-icon-line horizontal" />
          <span className="accordion-icon-line vertical" />
        </span>
      </button>
      <div
        className="accordion-content"
        ref={contentRef}
        style={{ height }}
      >
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  )
}
