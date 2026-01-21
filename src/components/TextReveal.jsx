import React from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// Split text into words with staggered animation
export function TextRevealWords({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const words = children.split(' ')

  return (
    <span
      ref={ref}
      className={`animate-words ${isVisible ? 'visible' : ''} ${className}`}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="word"
          style={{ transitionDelay: `${delay + index * 0.05}s` }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

// Split text into characters with staggered animation
export function TextRevealChars({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const chars = children.split('')

  return (
    <span
      ref={ref}
      className={`animate-chars ${isVisible ? 'visible' : ''} ${className}`}
    >
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="char"
          style={{ transitionDelay: `${delay + index * 0.03}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

// Line by line reveal animation
export function TextRevealLines({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  // Split by line breaks or treat as single line
  const lines = typeof children === 'string'
    ? children.split('\n')
    : [children]

  return (
    <span
      ref={ref}
      className={`animate-lines ${isVisible ? 'visible' : ''} ${className}`}
    >
      {lines.map((line, index) => (
        <span key={`line-${index}`} className="line">
          <span
            className="line-inner"
            style={{ transitionDelay: `${delay + index * 0.15}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  )
}

// Counter animation component
export function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '' }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 })
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!isVisible) return

    let startTime
    const startValue = 0
    const endValue = parseInt(end)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className="animate-counter">
      {prefix}{count}{suffix}
    </span>
  )
}

export default TextRevealWords
