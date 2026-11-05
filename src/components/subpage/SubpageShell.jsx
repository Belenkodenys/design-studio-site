'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import ProposalFooter from '../../app/clients/proposal/ProposalFooter'
import '../../app/clients/proposal/layout.css'
import './SubpageShell.css'

const NAV = [
  { href: '/projects', label: 'Our Works' },
  { href: '/career', label: 'Career' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contacts' }
]

// Shared frame for the standalone pages (/services, /projects, /about,
// /contact): light header with real links, page title, content, footer.
export default function SubpageShell({ title, lead, current, children, wide = false }) {
  // Phones: the menu folds into a square button at the right; tapping it
  // drops the links down under the header.
  const [open, setOpen] = useState(false)
  // The header is fixed to the top of the screen; reserve its height above
  // the page content (measured, so it follows the logo size and the open menu).
  const headerRef = useRef(null)
  useEffect(() => {
    const h = headerRef.current
    if (!h) return
    const apply = () => document.documentElement.style.setProperty('--subpage-header-h', `${h.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(h)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [open])
  return (
    <div className="subpage">
      <header className="subpage-header" ref={headerRef}>
        <Link href="/" className="subpage-logo" aria-label="Belenko Design Studio — home">
          <img src="/belenko-logo-footer.png" alt="Belenko" />
        </Link>
        <button
          type="button"
          className={`subpage-menu-btn${open ? ' is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="subpage-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="subpage-nav" className={`subpage-nav${open ? ' is-open' : ''}`} aria-label="Site">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={current === n.href ? 'is-current' : ''} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className={`subpage-main${wide ? ' is-wide' : ''}`}>
        {title && (
          <div className="subpage-head">
            <h1 className="subpage-title">{title}</h1>
            {lead && <p className="subpage-lead">{lead}</p>}
          </div>
        )}
        {children}
      </main>

      <ProposalFooter />
    </div>
  )
}
