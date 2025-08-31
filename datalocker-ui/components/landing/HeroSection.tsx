import { motion } from 'framer-motion'
import { ChevronRightIcon, PlayIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onEnterApp: () => void
}

export function HeroSection({ onEnterApp }: HeroSectionProps) {
  return (
    <section className="relative pt-16 sm:pt-32 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Advanced curved bottom border - Fixed visibility issue */}
      <div className="absolute -bottom-px left-0 right-0 z-20">
        <svg 
          className="relative block w-full h-20 sm:h-24 lg:h-32" 
          preserveAspectRatio="none" 
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,1)" className="dark:[stop-color:rgb(15,23,42)]" />
              <stop offset="50%" stopColor="rgba(248,250,252,1)" className="dark:[stop-color:rgb(30,41,59)]" />
              <stop offset="100%" stopColor="rgba(255,255,255,1)" className="dark:[stop-color:rgb(15,23,42)]" />
            </linearGradient>
            <linearGradient id="curveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(241,245,249,0.8)" className="dark:[stop-color:rgba(51,65,85,0.8)]" />
              <stop offset="50%" stopColor="rgba(226,232,240,0.9)" className="dark:[stop-color:rgba(71,85,105,0.9)]" />
              <stop offset="100%" stopColor="rgba(241,245,249,0.8)" className="dark:[stop-color:rgba(51,65,85,0.8)]" />
            </linearGradient>
          </defs>
          
          {/* Primary sophisticated curve */}
          <path 
            d="M0,20 C300,100 900,100 1200,20 L1200,120 L0,120 Z" 
            fill="url(#curveGradient1)"
          />
          
          {/* Secondary curve for depth */}
          <path 
            d="M0,40 C400,90 800,90 1200,40 L1200,120 L0,120 Z" 
            fill="url(#curveGradient2)"
          />
        </svg>
      </div>

      {/* Advanced background with mesh gradient and geometric patterns */}
      <div className="absolute inset-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/30"></div>
        

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-teal-200/20 dark:border-teal-600/20 rounded-3xl transform rotate-12"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-100/10 to-teal-100/10 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl transform -rotate-12"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/3 left-1/6 w-6 h-6 bg-teal-300/30 dark:bg-teal-400/20 rounded-full"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            {/* Advanced typography with sophisticated effects */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-[0.85] tracking-tight px-2"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <span className="block mb-1 sm:mb-2">Secure Your Data with{' '}</span>
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-black">
                  Filecoin
                </span>
                {/* Advanced glow effects */}
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 blur-2xl scale-110 -z-10"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 blur-3xl scale-150 -z-20"></span>
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Revolutionary decentralized storage solution with automated escrow management, 
              perpetual storage funding, and seamless Filecoin integration.
            </motion.p>
          </motion.div>

          {/* Advanced button section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                onClick={onEnterApp}
                size="lg"
                className="group relative bg-teal-500  hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0"
              >
                {/* Advanced button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/50 to-blue-500/50 blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10 scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Get Started
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full border-slate-300 dark:border-slate-600 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 w-full sm:w-auto backdrop-blur-sm bg-white/60 dark:bg-slate-900/60 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Documentation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


// import { motion } from 'framer-motion'
// import { ChevronRightIcon, PlayIcon, DocumentIcon } from '@heroicons/react/24/outline'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'

// interface HeroSectionProps {
//   onEnterApp: () => void
// }

// export function HeroSection({ onEnterApp }: HeroSectionProps) {
//   return (
//     <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center">
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.8 }}
//             className="mb-6 sm:mb-8"
//           >
//             <div className="flex justify-center mb-4 sm:mb-6">
//               <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800 text-sm sm:text-base px-3 py-1">
//                 🚀 Powered by Filecoin
//               </Badge>
//             </div>
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
//               Secure Your Data with{' '}
//               <span className="text-teal-500">
//                 Filecoin
//               </span>
//             </h1>
//             <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
//               Revolutionary decentralized storage solution with automated escrow management, 
//               perpetual storage funding, and seamless Filecoin integration.
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//             className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
//           >
//             <Button
//               onClick={onEnterApp}
//               size="lg"
//               className="group bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full w-full sm:w-auto"
//             >
//               <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//               Get Started
//               <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
//             </Button>
            
//             <Button 
//               variant="outline" 
//               size="lg"
//               className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full border-slate-300 dark:border-slate-600 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 w-full sm:w-auto"
//             >
//               <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//               Documentation
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }