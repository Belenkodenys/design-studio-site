'use client'

import { useEffect, useRef, useState } from 'react'
import './ProposalFooter.css'

export default function ProposalFooter() {
  const ref = useRef(null)
  const [visits, setVisits] = useState(null)

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

  const circle = (href, label, svg) => (
    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="rfoot-social">{svg}</a>
  )
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

  return (
    <footer ref={ref} className="rfoot">
      <div className="rfoot-col rfoot-col--brand">
        <a href="/" aria-label="Belenko — home" className="rfoot-logo"><img src="/residential/belenko-logo-white.png" alt="Belenko" /></a>
        <div className="rfoot-meta">
          <div>VAT B21779202 / © Belenko Design S.L. 2026</div>
          <address>Sq. Lesseps, 6<br />08023, Barcelona, Catalonia, Spain</address>
        </div>
      </div>
      <div className="rfoot-col rfoot-col--links">
        <a href="/residential">Residential interiors</a>
        <a href="/residential/legal">Legal notice</a>
        <a href="/residential/credits">Credits</a>
        <a href="/residential/privacy">Privacy</a>
        <a href="/residential/cookies">Cookies</a>
      </div>
      <div className="rfoot-socials">
        {circle('https://instagram.com/belenko', 'Instagram', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" /></svg>)}
        {circle('https://t.me/belenko_studio', 'Telegram', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" /></svg>)}
        {circle('https://es.pinterest.com/belenkodesign/', 'Pinterest', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9.5" /><path d="M10 20l2-10M9.5 13.5c-1.5-3 .5-6 3-6s4 2 3.5 4.5-2.5 4-4.5 2.5" /></svg>)}
        {circle('https://www.linkedin.com/in/denisbelenko/', 'LinkedIn', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5c0-3.5 4.5-3.5 4.5 0V17" /></svg>)}
        {circle('https://www.behance.net/studiobelenko', 'Behance', <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...stroke}><path d="M2 6h6.5a3 3 0 0 1 0 6H2zM2 12h7a3.2 3.2 0 0 1 0 6.4H2zM2 6v12.4M14.5 14.5h7.5c0-2.5-1.5-4-3.7-4s-3.8 1.6-3.8 4 1.6 4 3.8 4c1.6 0 2.8-.7 3.4-2M15.5 7h5.5" /></svg>)}
        {circle('https://wa.me/34671825489', 'WhatsApp', <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" /></svg>)}
      </div>
      <div className="rfoot-visits" title="Unique visits">
        <span aria-label="Unique visits">{visits !== null ? visits.toLocaleString('en-US') : '—'}</span>
      </div>
    </footer>
  )
}
