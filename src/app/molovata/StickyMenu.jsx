'use client'
import { useEffect, useRef, useState } from 'react'

// Chapter menu that pins under the fixed site header once scrolled past.
// Uses a fixed clone position (not CSS sticky) because the page's scroll
// container isn't the menu's ancestor chain on every browser.
export default function StickyMenu({ items }) {
  const ref = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [h, setH] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--subpage-header-h')) || 64
    const onScroll = () => {
      const top = el.getBoundingClientRect().top
      setH(el.offsetHeight)
      setPinned(top <= headerH() + 0.5)
      // active chapter
      let cur = ''
      for (const it of items) {
        const s = document.getElementById(it.id)
        if (s && s.getBoundingClientRect().top <= headerH() + el.offsetHeight + 40) cur = it.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [items])

  return (
    <div ref={ref} className="mol-menu-wrap" style={pinned ? { height: h } : undefined}>
      <nav className={`mol-menu${pinned ? ' is-pinned' : ''}`} aria-label="Разделы">
        {items.map((m, i) => (
          <a key={m.id} href={`#${m.id}`} className={`mol-menu-item${active === m.id ? ' is-active' : ''}`}>
            <span className="mol-menu-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="mol-menu-label">{m.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
