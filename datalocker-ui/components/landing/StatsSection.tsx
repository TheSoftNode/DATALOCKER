import { motion } from 'framer-motion'

const stats = [
  { 
    value: '10k+', 
    label: 'Files Stored',
    gradient: 'from-teal-400 to-cyan-500',
    glowColor: 'teal-400/30'
  },
  { 
    value: '99.9%', 
    label: 'Uptime',
    gradient: 'from-green-400 to-emerald-500', 
    glowColor: 'green-400/30'
  },
  { 
    value: '50TB+', 
    label: 'Data Secured',
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'blue-400/30'
  },
  { 
    value: '24/7', 
    label: 'Support',
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'violet-400/30'
  },
]

export function StatsSection() {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ultra-subtle background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900/50"></div>
      
      {/* Minimal geometric accent */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="statsPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#statsPattern)" className="text-slate-400 dark:text-slate-600"/>
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Trusted by the Community
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.3 + index * 0.1, 
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative"
            >
              {/* Advanced glow effect */}
              <div className={`absolute -inset-2 bg-${stat.glowColor} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
              
              {/* Main container */}
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90 group-hover:border-slate-300/60 dark:group-hover:border-slate-600/60 group-hover:shadow-2xl">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-slate-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Animated number */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`relative text-3xl sm:text-4xl font-black mb-2 ${
                    index === 0 ? 'text-teal-500' :
                    index === 1 ? 'text-green-500' :
                    index === 2 ? 'text-blue-600' :
                    'text-violet-600'
                  }`}
                >
                  <span className="relative">
                    {stat.value}
                  </span>
                </motion.div>
                
                {/* Label */}
                <div className="relative text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {stat.label}
                </div>

                {/* Subtle accent line */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${stat.gradient} group-hover:w-8 transition-all duration-500 ease-out rounded-full`}></div>
              </div>

              {/* Floating micro-dot */}
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute -top-1 right-2 w-1.5 h-1.5 bg-gradient-to-r ${stat.gradient} rounded-full opacity-0 group-hover:opacity-70`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}