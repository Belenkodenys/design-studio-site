'use client'

import Link from 'next/link'
import ProposalFooter from '../../app/clients/proposal/ProposalFooter'
import '../../app/clients/proposal/layout.css'
import './SubpageShell.css'

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
]

// Shared frame for the standalone pages (/services, /projects, /about,
// /contact): light header with real links, page title, content, footer.
export default function SubpageShell({ title, lead, current, children, wide = false }) {
  return (
    <div className="subpage">
      <header className="subpage-header">
        <Link href="/" className="subpage-logo" aria-label="Belenko Design Studio — home">
          <img src="/belenko-logo.png" alt="Belenko" />
        </Link>
        <nav className="subpage-nav" aria-label="Site">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={current === n.href ? 'is-current' : ''}>
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
