import { useEffect, useState, useRef } from 'react'

// Parallax effect based on scroll position
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [ref, offset]
}

// Scroll progress within a section (0 to 1)
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate progress: 0 when element enters, 1 when it leaves
      const start = windowHeight
      const end = -elementHeight
      const current = rect.top
      const totalDistance = start - end
      const traveled = start - current

      const progress = Math.max(0, Math.min(1, traveled / totalDistance))
      setProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [ref, progress]
}

// Scale effect on scroll
export function useScrollScale(minScale = 0.8, maxScale = 1) {
  const [scale, setScale] = useState(minScale)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const windowCenter = windowHeight / 2

      // Distance from center (0 = centered, 1 = at edge)
      const distanceFromCenter = Math.abs(elementCenter - windowCenter) / windowCenter
      const normalizedDistance = Math.max(0, Math.min(1, distanceFromCenter))

      // Scale based on distance from center
      const scale = maxScale - (maxScale - minScale) * normalizedDistance
      setScale(scale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [minScale, maxScale])

  return [ref, scale]
}

// Horizontal scroll effect
export function useHorizontalScroll(sensitivity = 1) {
  const [translateX, setTranslateX] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far through the element we've scrolled
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))

      // Convert to horizontal translation
      const maxTranslate = ref.current.scrollWidth - ref.current.clientWidth
      setTranslateX(-clampedProgress * maxTranslate * sensitivity)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sensitivity])

  return [ref, translateX]
}

// Rotation on scroll
export function useScrollRotate(maxDegrees = 10) {
  const [rotation, setRotation] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2

      // Rotation based on position
      const progress = (windowHeight / 2 - elementCenter) / windowHeight
      setRotation(progress * maxDegrees)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [maxDegrees])

  return [ref, rotation]
}

// Mouse parallax effect
export function useMouseParallax(sensitivity = 0.05) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) * sensitivity
      const y = (e.clientY - centerY) * sensitivity

      setPosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [sensitivity])

  return [ref, position]
}
