// import { motion } from 'framer-motion'
// import { LockClosedIcon, ShieldCheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// const features = [
//   {
//     title: 'Automated Escrow',
//     description: 'Smart contract manages storage payments automatically with built-in renewal mechanisms and USDFC integration.',
//     icon: LockClosedIcon,
//   },
//   {
//     title: 'Perpetual Storage',
//     description: 'Your data remains accessible forever with our innovative funding and renewal system powered by SynapseSDK.',
//     icon: ShieldCheckIcon,
//   },
//   {
//     title: 'Filecoin Integration',
//     description: 'Native integration with Filecoin network for decentralized, secure, and cost-effective storage solutions.',
//     icon: CloudArrowUpIcon,
//   },
// ]

// export function FeatureCards() {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.8, duration: 0.8 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20"
//         >
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
//               style={{ animationDelay: `${index * 0.2}s` }}
//             >
//               <Card className="group border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-float h-full">
//                 <CardHeader className="pb-4">
//                   <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 ${
//                     index === 0 ? 'bg-green-500' : 
//                     index === 1 ? 'bg-blue-800' : 
//                     'bg-teal-500'
//                   }`}>
//                     <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                   </div>
//                   <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-white">
//                     {feature.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
//                     {feature.description}
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

import { motion } from 'framer-motion'
import { LockClosedIcon, ShieldCheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    title: 'Automated Escrow',
    description: 'Smart contract manages storage payments automatically with built-in renewal mechanisms and USDFC integration.',
    icon: LockClosedIcon,
    gradient: 'from-green-400 to-emerald-600',
    glowColor: 'green-400/20',
    ringColor: 'green-500/10'
  },
  {
    title: 'Perpetual Storage',
    description: 'Your data remains accessible forever with our innovative funding and renewal system powered by SynapseSDK.',
    icon: ShieldCheckIcon,
    gradient: 'from-blue-600 to-blue-800',
    glowColor: 'blue-400/20',
    ringColor: 'blue-500/10'
  },
  {
    title: 'Filecoin Integration',
    description: 'Native integration with Filecoin network for decentralized, secure, and cost-effective storage solutions.',
    icon: CloudArrowUpIcon,
    gradient: 'from-teal-400 to-cyan-600',
    glowColor: 'teal-400/20',
    ringColor: 'teal-500/10'
  },
]

export function FeatureCards() {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1)_0%,transparent_50%)]"></div>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="featureGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#featureGrid)" className="text-slate-400 dark:text-slate-600"/>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.7 + index * 0.15, 
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative"
            >
              {/* Advanced glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl`}></div>
              
              {/* Floating ring effect */}
              <div className={`absolute -inset-2 bg-${feature.ringColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse`}></div>

              <Card className="relative border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg hover:bg-white/95 dark:hover:bg-slate-800/95 transition-all duration-500 h-full shadow-lg hover:shadow-2xl group-hover:border-slate-300/80 dark:group-hover:border-slate-600/80">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-slate-700/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative pb-3 pt-6">
                  {/* Advanced icon container */}
                  <div className="relative mb-4">
                    <motion.div
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        scale: 1.15
                      }}
                      transition={{ 
                        rotate: { duration: 0.6, ease: "easeInOut" },
                        scale: { type: "spring", stiffness: 300, damping: 15 }
                      }}
                      className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      {/* Icon glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-110`}></div>
                      
                      <feature.icon className="relative w-7 h-7 text-white" />
                      
                      {/* Floating particles */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute -top-1 -right-1 w-3 h-3 bg-${feature.glowColor.split('/')[0].replace('-400', '-300')} rounded-full opacity-0 group-hover:opacity-70`}
                      />
                    </motion.div>
                  </div>
                  
                  <CardTitle className="relative text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Subtle bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-lg`}></div>
              </Card>

              {/* Floating micro-interactions */}
              <motion.div
                animate={{ 
                  y: [0, -2, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute -top-2 right-4 w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-60`}
              />
              
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ 
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className={`absolute top-6 -left-1 w-1.5 h-1.5 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-40`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}