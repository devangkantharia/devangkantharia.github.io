'use client'

import { useEffect, useState } from 'react'

import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
    if (initial === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    const x = event.clientX
    const y = event.clientY

    startCircleTransition(() => {
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, x, y)
  }

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-button"
      aria-label="Toggle theme"
      type="button"
    >
      <div className="theme-toggle-icon-light">
        <Sun className="w-5 h-5" />
      </div>
      <div className="theme-toggle-icon-dark">
        <Moon className="w-5 h-5" />
      </div>
    </button>
  )
}

// Circular transition animation using View Transitions API
async function startCircleTransition(
  callback: () => void,
  x: number,
  y: number
) {
  // Check if browser supports View Transitions API
  if (!document.startViewTransition) {
    callback()
    return
  }

  const styleId = 'theme-transition-style'
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
  `
  document.head.appendChild(style)

  const transition = document.startViewTransition(() => {
    callback()
  })

  await transition.ready

  transition.finished.then(() => {
    document.getElementById(styleId)?.remove()
  })

  const gradientOffset = 0.7
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
    <defs>
      <radialGradient id="toggle-theme-gradient">
        <stop offset="${gradientOffset}"/>
        <stop offset="1" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="4" cy="4" r="4" fill="url(#toggle-theme-gradient)"/>
  </svg>`

  const maskUrl = `data:image/svg+xml;base64,${btoa(maskSvg)}`

  const w = window.innerWidth
  const h = window.innerHeight

  const maxRadius = Math.ceil(
    Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) / gradientOffset
  )

  document.documentElement.animate(
    {
      maskImage: [`url('${maskUrl}')`, `url('${maskUrl}')`],
      maskRepeat: ['no-repeat', 'no-repeat'],
      maskPosition: [`${x}px ${y}px`, `${x - maxRadius}px ${y - maxRadius}px`],
      maskSize: ['0', `${2 * maxRadius}px`],
    },
    {
      duration: 500,
      easing: 'ease-in',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}