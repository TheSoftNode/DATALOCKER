import { motion } from 'framer-motion'
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CTASectionProps {
  onEnterApp: () => void
}

export function CTASection({ onEnterApp }: CTASectionProps) {
  const benefits = [
    { icon: ShieldCheckIcon, text: "Enterprise-grade security" },
    { icon: ClockIcon, text: "Deploy in under 5 minutes" },
    { icon: CurrencyDollarIcon, text: "Pay only for what you store" }
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Advanced background with geometric patterns */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        
        {/* Animated mesh overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-blue-500/5 to-cyan-500/10"></div>
        </div>
        

        {/* Floating animated shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/6 w-32 h-32 border border-teal-400/20 rounded-3xl transform rotate-12"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-2xl transform -rotate-12"
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Premium badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex mb-6"
          >
            <Badge className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-300 border border-teal-400/30 px-4 py-2 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 bg-teal-400 rounded-full mr-2"
              />
              Ready to Deploy
            </Badge>
          </motion.div>

          {/* Compelling headline */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Start Securing Your Data{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Today
              </span>
              <motion.div
                animate={{
                  scaleX: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.7, 1]
                }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 origin-left"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Join thousands of users who trust DataLocker for their most critical data. 
            Experience the future of decentralized storage with zero setup complexity.
          </motion.p>

          {/* Benefit highlights */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center">
                  <benefit.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Primary CTA button */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                onClick={onEnterApp}
                size="lg"
                className="group relative bg-gradient-to-r from-teal-500 via-blue-500 to-cyan-500 hover:from-teal-400 hover:via-blue-400 hover:to-cyan-400 text-white text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
              >
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/50 via-blue-400/50 to-cyan-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 -z-10"></div>
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-700 ease-out"></div>
                
                <div className="relative flex items-center gap-3">
                  <span className="font-semibold">Launch DataLocker</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm text-slate-400"
          >
            No credit card required • Free tier available • Enterprise support
          </motion.p>
        </motion.div>

        {/* Floating micro-elements */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-1/4 w-2 h-2 bg-teal-400 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-1/4 w-3 h-3 bg-blue-400 rounded-full"
        />
      </div>
    </section>
  )
}