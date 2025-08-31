"use client";

import { motion } from 'framer-motion'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '../shared/ThemeToggle';
import { DataLockerLogo } from '../shared/Logo';

interface NavigationProps {
  onEnterApp: () => void
}

export function Navigation({ onEnterApp }: NavigationProps) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/20 dark:border-slate-700/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <DataLockerLogo 
              size="md" 
              variant="default" 
              animated={true}
              clickable={false}
            />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-4"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <ConnectButton />
            </motion.div>
            
            
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Connect Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="sm:hidden px-4 pb-3"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
        >
          <ConnectButton />
        </motion.div>
      </motion.div>
    </motion.nav>
  )
}