'use client'

import { useEffect, useRef } from 'react'

// Scroll-driven motion. Each element has a "resting" state at the middle of
// the screen (no transform, fully visible) and moves away from it the further
// it is from the centre — so the picture nearest the centre is always whole.
// `fx` picks the kind of motion:
//   'slide-l' / 'slide-r' — crosses the screen horizontally (ltr / rtl)
//   'rise'               — vertical parallax, grows as it comes up
//   'zoom'               — large and faded far away, 1:1 in the centre
//   'tilt'               — swings in on a rotation
// Motion is eased (cubic), so near the centre it is gentle and far from the
// centre it is fast — the eye reads it as varied, not as one sliding sheet.
const ease = (p) => p * p * p
const easeAbs = (a) => a * a

export default function ScrollDrift({ fx = 'slide-l', axis, depth = 1, className = '', children }) {
  const ref = useRef(null)
  // Backwards compatibility with the old `axis` prop.
  const kind = axis ? (axis === 'rtl' || axis === 'right' ? 'slide-r' : 'slide-l') : fx

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let ticking = false

    const update = () => {
      ticking = false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      const phone = vw <= 600
      // -1 … 0 … +1 : below the fold → centred → above the fold
      const p = Math.max(-1.3, Math.min(1.3, ((r.top + r.height / 2) - vh / 2) / (vh / 2)))
      const a = Math.abs(p)
      const e = ease(Math.max(-1, Math.min(1, p)))  // signed, cubic, clamped
      const ea = easeAbs(Math.min(1, a))

      let tx = 0, ty = 0, rot = 0, sc = 1, op = 1
      switch (kind) {
        case 'slide-r':
        case 'slide-l': {
          const dir = kind === 'slide-r' ? -1 : 1
          const travel = (vw + r.width) / 2
          tx = dir * e * travel * depth
          ty = p * vh * 0.03
          rot = dir * e * 6
          op = 1.4 - ea * 0.6
          break
        }
        case 'rise': {
          ty = e * vh * 0.22 * depth
          sc = 1 - ea * 0.3
          op = 1.3 - ea * 0.9
          break
        }
        case 'zoom': {
          sc = p > 0 ? 1 - ea * 0.4 : 1 + ea * (phone ? 0.35 : 0.9)
          ty = p * vh * 0.08
          op = 1.25 - ea * 1.1
          break
        }
        case 'tilt': {
          rot = e * 28 * depth
          tx = e * vw * 0.25
          ty = p * vh * 0.1
          sc = 1 - ea * 0.2
          op = 1.3 - ea * 0.7
          break
        }
        default:
          break
      }
      // Phones: the picture is 100% of the screen width at the centre and is
      // allowed to grow before and after.
      if (phone) sc *= 1 + ea * 0.3
      // neighbours stay visible (no empty white around the centre picture)
      op = Math.max(0.35, Math.min(1, op))
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`
      el.style.opacity = op.toFixed(3)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [kind, depth])

  return (
    <div ref={ref} className={`drift drift--${kind} ${className}`.trim()}>
      {children}
    </div>
  )
}
