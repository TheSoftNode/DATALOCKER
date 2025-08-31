import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Filecoin from "../ui/icons/Filecoin";
import Github from "../ui/icons/Github";
import { DataLockerLogo } from "../shared/Logo";

export function Footer() {
  const footerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const heartAnimation = {
    scale: [1, 1.15, 1],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative border-t border-slate-200/60 dark:border-slate-700/60 py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-900 backdrop-blur-lg overflow-hidden"
    >
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerPattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerPattern)" className="text-slate-400 dark:text-slate-600"/>
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={footerVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
        >
          {/* Brand section */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <DataLockerLogo 
              size="md" 
              variant="default" 
              animated={true}
              clickable={false}
            />
          </motion.div>

          {/* Links section */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                className="group flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-950/30"
                href="https://github.com/FIL-Builders/fs-upload-dapp"
                target="_blank"
              >
                <div className="group-hover:rotate-3 transition-transform duration-300">
                  <Github />
                </div>
                <span className="font-medium text-sm">GitHub</span>
              </Link>
            </motion.div>

            <motion.p 
              variants={itemVariants} 
              className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300"
            >
              <span>Built with</span>
              <motion.span
                animate={heartAnimation}
                className="inline-block text-red-500"
              >
                ❤️
              </motion.span>
              <span>for Filecoin</span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Minimal copyright line */}
        <motion.div
          variants={itemVariants}
          className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-700/40 text-center"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            © 2024 DataLocker. Powered by the decentralized web.
          </p>
        </motion.div>
      </div>

      {/* Subtle floating elements */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full"
      />
      <motion.div
        animate={{
          y: [0, -4, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-6 left-1/3 w-1 h-1 bg-blue-400 rounded-full"
      />
    </motion.footer>
  )
}