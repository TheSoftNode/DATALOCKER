import { motion } from 'framer-motion'
import { HeroSection } from './HeroSection'
import { FeatureCards } from './FeatureCards'
import { StatsSection } from './StatsSection'
import { Navigation } from '../layout/Navigation'
import { Footer } from '../layout/Footer'
import { CTASection } from './CTASection'

interface LandingContentProps {
  onEnterApp: () => void
}

export function LandingContent({ onEnterApp }: LandingContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      <Navigation onEnterApp={onEnterApp} />
      <HeroSection onEnterApp={onEnterApp} />
      <FeatureCards />
      <CTASection onEnterApp={onEnterApp} />
      {/* <StatsSection /> */}
      <Footer />
    </motion.div>
  )
}