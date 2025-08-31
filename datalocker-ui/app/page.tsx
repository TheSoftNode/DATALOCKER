'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SplashScreen } from '@/components/landing/SplashScreen'
import { LandingContent } from '@/components/landing/LandingContent'

function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <LandingContent key="landing" onEnterApp={() => router.push('/dashboard')} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage;