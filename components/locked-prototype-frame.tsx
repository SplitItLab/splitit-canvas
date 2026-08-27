'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

type NavigateEventLike = Event & {
  destination?: { url?: string }
}

type WindowWithNavigation = Window & {
  navigation?: EventTarget
}

function normalizePathname(pathname: string): string {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '')
}

function isSameScreen(destination: string, lockedUrl: URL, currentUrl: string): boolean {
  try {
    const targetUrl = new URL(destination, currentUrl)
    return (
      targetUrl.origin === lockedUrl.origin &&
      normalizePathname(targetUrl.pathname) === normalizePathname(lockedUrl.pathname)
    )
  } catch {
    return false
  }
}

function stopNavigation(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()
}

export function LockedPrototypeFrame({ route, title }: { route: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const cleanupRef = useRef<() => void>(() => undefined)
  const recoveringRef = useRef(false)
  const lockedPathname = useMemo(
    () => normalizePathname(new URL(route, 'https://splitit.local').pathname),
    [route]
  )

  const restoreRoute = useCallback(() => {
    const frame = frameRef.current
    if (!frame || recoveringRef.current) return

    recoveringRef.current = true
    cleanupRef.current()
    cleanupRef.current = () => undefined
    frame.src = route
  }, [route])

  const lockLoadedDocument = useCallback(() => {
    const frame = frameRef.current
    const frameWindow = frame?.contentWindow
    if (!frame || !frameWindow) return

    recoveringRef.current = false
    cleanupRef.current()

    const lockedUrl = new URL(route, window.location.origin)

    try {
      if (!isSameScreen(frameWindow.location.href, lockedUrl, frameWindow.location.href)) {
        restoreRoute()
        return
      }

      const frameDocument = frameWindow.document
      const blocksDestination = (destination: string) =>
        !isSameScreen(destination, lockedUrl, frameWindow.location.href)

      const handleClick = (event: Event) => {
        const target = event.target as { closest?: (selector: string) => Element | null } | null
        const link = target?.closest?.('a[href]') as HTMLAnchorElement | null
        if (!link) return

        const linkTarget = link.getAttribute('target')?.toLowerCase()
        if ((linkTarget && linkTarget !== '_self') || blocksDestination(link.href)) {
          stopNavigation(event)
        }
      }

      const handleSubmit = (event: Event) => {
        const form = event.target as HTMLFormElement | null
        if (!form) return

        const formTarget = form.getAttribute('target')?.toLowerCase()
        const action = form.getAttribute('action') || frameWindow.location.href
        if ((formTarget && formTarget !== '_self') || blocksDestination(action)) {
          stopNavigation(event)
        }
      }

      const handleNavigate: EventListener = (event) => {
        const destination = (event as NavigateEventLike).destination?.url
        if (destination && blocksDestination(destination)) {
          event.preventDefault()
        }
      }

      frameDocument.addEventListener('click', handleClick, true)
      frameDocument.addEventListener('submit', handleSubmit, true)

      const navigation = (frameWindow as WindowWithNavigation).navigation
      navigation?.addEventListener('navigate', handleNavigate)

      cleanupRef.current = () => {
        frameDocument.removeEventListener('click', handleClick, true)
        frameDocument.removeEventListener('submit', handleSubmit, true)
        navigation?.removeEventListener('navigate', handleNavigate)
      }
    } catch {
      restoreRoute()
    }
  }, [restoreRoute, route])

  useEffect(() => {
    const monitor = window.setInterval(() => {
      const frameWindow = frameRef.current?.contentWindow
      if (!frameWindow || recoveringRef.current) return

      const lockedUrl = new URL(route, window.location.origin)
      try {
        if (!isSameScreen(frameWindow.location.href, lockedUrl, frameWindow.location.href)) {
          restoreRoute()
        }
      } catch {
        restoreRoute()
      }
    }, 200)

    return () => {
      window.clearInterval(monitor)
      cleanupRef.current()
    }
  }, [restoreRoute, route])

  return (
    <iframe
      ref={frameRef}
      src={route}
      title={title}
      sandbox="allow-forms allow-modals allow-same-origin allow-scripts"
      data-canvas-route-lock={lockedPathname}
      onLoad={lockLoadedDocument}
      style={{ display: 'block', width: '100%', height: '80vh', border: 'none' }}
    />
  )
}
