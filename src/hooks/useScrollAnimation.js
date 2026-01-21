import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

export function useScrollAnimationMultiple(count, options = {}) {
  const refs = useRef([])
  const [visibleItems, setVisibleItems] = useState(new Array(count).fill(false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target)
            if (index !== -1) {
              setVisibleItems((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    )

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [count, options.threshold, options.rootMargin])

  const setRef = (index) => (el) => {
    refs.current[index] = el
  }

  return [setRef, visibleItems]
}
