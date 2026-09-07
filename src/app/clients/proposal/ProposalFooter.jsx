'use client'

import { useEffect, useRef, useState } from 'react'
import './ProposalFooter.css'

export default function ProposalFooter() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Unique-visit counter: increment once per browser (localStorage flag),
  // otherwise just read the current total. Persisted via a free counter API.
  useEffect(() => {
    let cancelled = false
    let counted = false
    try { counted = !!localStorage.getItem('blnk_visit_counted') } catch (_) {}
    const base = 'https://abacus.jasoncameron.dev'
    const url = counted ? `${base}/get/belenko.design/unique` : `${base}/hit/belenko.design/unique`
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d || typeof d.value !== 'number') return
        setVisits(d.value)
        if (!counted) { try { localStorage.setItem('blnk_visit_counted', '1') } catch (_) {} }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <footer
      ref={ref}
      className={`proposal-footer ${visible ? 'is-visible' : ''}`}
    >
      <div className="proposal-footer-inner">
        <div className="proposal-footer-mark">Belenko Studio</div>
        <div className="proposal-footer-address">Barcelona, Spain</div>
        <div className="proposal-footer-contact">
          <a href="mailto:office@belenko.design">office@belenko.design</a>
          <span className="proposal-footer-divider">·</span>
          <a href="tel:+34671825489">+34 67182 54 89</a>
        </div>
        <div className="proposal-footer-social">
          <a
            href="https://instagram.com/belenko"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="proposal-footer-social-link"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/denisbelenko/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="proposal-footer-social-link"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
        <div className="proposal-footer-copyright">
          © 2026 Belenko Studio. All rights reserved.
        </div>
        {visits !== null && (
          <div className="proposal-footer-count" title="Unique visits">
            {visits.toLocaleString('en-US')}
          </div>
        )}
      </div>
    </footer>
  )
}
