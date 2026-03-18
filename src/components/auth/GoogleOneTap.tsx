"use client"

import { useEffect, useRef } from "react"
import { useSession, signIn } from "next-auth/react"

/**
 * Google One Tap Login Component
 * Renders a "One Tap" login prompt if the user is not authenticated.
 * This significantly improves CTR and user experience for returning users.
 */
export default function GoogleOneTap() {
  const { status } = useSession()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only proceed if user is unauthenticated and we haven't initialized yet
    if (status !== "unauthenticated" || isInitialized.current) return

    isInitialized.current = true

    // Only run in browser environment
    if (typeof window === "undefined" || !window.document) return

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!googleClientId) {
      console.warn("One Tap: Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environmental variable.")
      return
    }

    const scriptId = "google-identity-services-script"
    let script = document.getElementById(scriptId) as HTMLScriptElement

    const initializeOneTap = () => {
      if (!window.google) return

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            // After Google returns the credential, 
            // we use next-auth's signIn with 'google' or a custom implementation.
            // Note: Since standard next-auth google provider doesn't directly take 'credential',
            // we typically trigger the standard flow OR use a custom route if needed.
            // For most UX, we'll trigger the standard sign-in flow which Google handles:
            await signIn("google", {
              callbackUrl: window.location.href,
            })
          },
          auto_select: true, // Attempt auto sign-in
          cancel_on_tap_outside: false,
          context: "signin",
        })

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap: Prompt not displayed.", notification.getNotDisplayedReason())
          } else if (notification.isSkippedMoment()) {
            console.log("One Tap: Prompt skipped.", notification.getSkippedReason())
          } else if (notification.isDismissedMoment()) {
            console.log("One Tap: Prompt dismissed.", notification.getDismissedReason())
          }
        })
      } catch (error) {
        console.error("One Tap: Initialization failed", error)
      }
    }

    if (!script) {
      script = document.createElement("script")
      script.id = scriptId
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initializeOneTap
      document.head.appendChild(script)
    } else if (window.google) {
      initializeOneTap()
    }

    // Cleanup logic if needed (usually script stays for session)
  }, [status])

  return null // This component doesn't render visual UI, Google handles it via script
}

declare global {
  interface Window {
    google: any
  }
}
