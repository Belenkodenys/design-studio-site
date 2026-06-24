'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Hero.css'

const heroMedia = [
  { type: 'image', src: '/story_02_people_filled_bright.jpg' },
  { type: 'image', src: '/new_story_07_people_filled.jpg' },
  { type: 'image', src: '/story_03_people_filled_bright.jpg' },
  { type: 'image', src: '/story_04_people_filled_bright.jpg' },
  { type: 'image', src: '/story_01_people_filled_bright.jpg' },
  { type: 'image', src: '/story_07_people_filled_bright.jpg' },
  { type: 'image', src: '/story_05_people_filled_bright.jpg' },
  { type: 'image', src: '/story_06_people_filled_bright.jpg' },
  { type: 'image', src: '/story_08_people_filled_bright.jpg' },
  { type: 'image', src: '/story_10_people_filled_bright.jpg' },
  { type: 'image', src: '/story_09_people_filled_bright.jpg' },
  { type: 'video', src: '/chou-chou.mp4' },
  { type: 'video', src: '/babo-gardens.mp4' },
  { type: 'video', src: '/monica-1.mp4' },
  { type: 'video', src: '/monica-2.mp4' },
  { type: 'video', src: '/take-five.mp4' },
  { type: 'video', src: '/para-janov.mp4' },
]

const TILE_ASPECT = 9 / 16

const rotatingWords = [
  'Design',
  'Branding',
  'Interior Solutions',
  'Menu',
  'Furniture',
  'Atmosphere',
  'Customer Experience',
  'Tableware',
  'Lighting Design',
  'Ideas for Concepts',
]
const longestWord = rotatingWords.reduce(
  (a, b) => (b.length > a.length ? b : a),
  ''
)

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const idxRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const current = idxRef.current
      const next = (current + 1) % rotatingWords.length
      idxRef.current = next
      setPrevIdx(current)
      setIdx(next)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (prevIdx === null) return
    const t = setTimeout(() => setPrevIdx(null), 700)
    return () => clearTimeout(t)
  }, [prevIdx, idx])

  return (
    <span className="rotator">
      <span className="rotator-spacer">{longestWord}</span>
      {prevIdx !== null && (
        <span key={`out-${prevIdx}`} className="rotator-word outgoing">
          {rotatingWords[prevIdx]}
        </span>
      )}
      <span key={`in-${idx}`} className="rotator-word incoming">
        {rotatingWords[idx]}
      </span>
    </span>
  )
}

function pickDistinctMedia(count) {
  const pool = heroMedia.map((_, i) => i)
  const result = []
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) pool.push(...heroMedia.map((_, j) => j))
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

function HeroTile({ mediaIdx }) {
  const [stack, setStack] = useState([{ id: 0, mediaIdx }])
  const counterRef = useRef(1)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const newId = counterRef.current++
    setStack((prev) => {
      const last = prev[prev.length - 1]
      return last ? [last, { id: newId, mediaIdx }] : [{ id: newId, mediaIdx }]
    })
    const t = setTimeout(() => {
      setStack((prev) => prev.filter((s) => s.id === newId))
    }, 1100)
    return () => clearTimeout(t)
  }, [mediaIdx])

  return (
    <div className="hero-tile">
      {stack.map((item) => {
        const media = heroMedia[item.mediaIdx]
        return (
          <div key={item.id} className="hero-image">
            {media.type === 'video' ? (
              <video
                src={media.src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <img src={media.src} alt="" draggable="false" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Hero() {
  const { t } = useLanguage()
  const [tiles, setTiles] = useState([])
  const tilesRef = useRef([])
  useEffect(() => {
    tilesRef.current = tiles
  }, [tiles])

  useEffect(() => {
    const recalc = () => {
      const tileWidth = window.innerHeight * TILE_ASPECT
      const count = Math.max(1, Math.ceil(window.innerWidth / tileWidth))
      setTiles((prev) => {
        if (prev.length === count) return prev
        if (prev.length < count) {
          const used = new Set(prev)
          const available = heroMedia
            .map((_, i) => i)
            .filter((i) => !used.has(i))
          const extras = []
          for (let i = 0; i < count - prev.length; i++) {
            if (available.length === 0) {
              extras.push(Math.floor(Math.random() * heroMedia.length))
            } else {
              const pickIdx = Math.floor(Math.random() * available.length)
              extras.push(available.splice(pickIdx, 1)[0])
            }
          }
          return [...prev, ...extras]
        }
        return prev.slice(0, count)
      })
    }
    if (tiles.length === 0) {
      const tileWidth = window.innerHeight * TILE_ASPECT
      const count = Math.max(1, Math.ceil(window.innerWidth / tileWidth))
      setTiles(pickDistinctMedia(count))
    }
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tiles.length === 0) return
    const getDelay = (mediaIdx) =>
      heroMedia[mediaIdx]?.type === 'video' ? 5000 : 1500
    const timeouts = new Set()
    let active = true

    const scheduleSwap = (tileIdx, delay) => {
      const t = setTimeout(() => {
        if (!active) return
        timeouts.delete(t)
        const currentTiles = tilesRef.current
        if (tileIdx >= currentTiles.length) return
        const current = currentTiles[tileIdx]
        const candidates = heroMedia
          .map((_, i) => i)
          .filter((i) => i !== current)
        const newMediaIdx =
          candidates[Math.floor(Math.random() * candidates.length)]
        setTiles((prev) => {
          if (tileIdx >= prev.length) return prev
          const next = [...prev]
          next[tileIdx] = newMediaIdx
          return next
        })
        scheduleSwap(tileIdx, getDelay(newMediaIdx))
      }, delay)
      timeouts.add(t)
    }

    tiles.forEach((mediaIdx, tileIdx) => {
      const jitter = Math.random() * 1000
      scheduleSwap(tileIdx, jitter + getDelay(mediaIdx))
    })

    return () => {
      active = false
      timeouts.forEach(clearTimeout)
    }
  }, [tiles.length])

  return (
    <section className="hero">
      <div className="hero-slider">
        {tiles.map((activeIdx, tileIdx) => (
          <HeroTile key={tileIdx} mediaIdx={activeIdx} />
        ))}
      </div>

      <div className="hero-background-logo visible">
        <img src="/belenko-logo.png" alt="Belenko" />
        <h1 className="hero-title hero-title-elegant">
          <span className="hero-title-static">{t('hero.title')}</span>
          <span className="hero-title-rotator">
            <RotatingWord />
          </span>
        </h1>
      </div>
    </section>
  )
}

export default Hero
