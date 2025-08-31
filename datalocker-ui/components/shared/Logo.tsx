"use client";

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DataLockerLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal' | 'icon-only'
  className?: string
  animated?: boolean
  clickable?: boolean
  onClick?: () => void
}

export function DataLockerLogo({ 
  size = 'md', 
  variant = 'default',
  className,
  animated = true,
  clickable = false,
  onClick
}: DataLockerLogoProps) {
  
  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
      iconContainer: 'w-6 h-6'
    },
    md: {
      container: 'h-10',
      icon: 'w-5 h-5',
      text: 'text-xl',
      iconContainer: 'w-8 h-8'
    },
    lg: {
      container: 'h-12',
      icon: 'w-6 h-6',
      text: 'text-2xl',
      iconContainer: 'w-10 h-10'
    },
    xl: {
      container: 'h-16',
      icon: 'w-8 h-8',
      text: 'text-3xl',
      iconContainer: 'w-12 h-12'
    }
  }

  const classes = sizeClasses[size]

  const floatingAnimation = animated ? {
    y: [0, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : undefined

  const hoverAnimation = animated && clickable ? {
    whileHover: { 
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    },
    whileTap: { scale: 0.98 }
  } : {}

  const LogoIcon = () => (
    <motion.div
      animate={floatingAnimation}
      className={cn(
        classes.iconContainer,
        "relative flex items-center justify-center rounded-2xl border-2 border-slate-800 dark:border-slate-200 bg-transparent overflow-hidden"
      )}
    >
      {/* Geometric pattern inside */}
      <svg 
        className={cn(classes.icon, "text-slate-800 dark:text-slate-200")}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main cube structure */}
        <path 
          d="M12 2L4 7V17L12 22L20 17V7L12 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner geometric details */}
        <path 
          d="M12 2V12M12 12L4 7M12 12L20 7M12 12V22" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Lock symbol integration */}
        <circle 
          cx="12" 
          cy="14" 
          r="2" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.8"
        />
        <rect 
          x="10" 
          y="13" 
          width="4" 
          height="3" 
          rx="0.5"
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.8"
        />
      </svg>
      
      {/* Subtle corner accents */}
      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-slate-800 dark:bg-slate-200 rounded-full opacity-60" />
      <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-slate-800 dark:bg-slate-200 rounded-full opacity-40" />
    </motion.div>
  )

  const LogoText = () => (
    <motion.span
      className={cn(
        classes.text,
        "font-bold text-slate-900 dark:text-white tracking-tight select-none",
        "font-mono" // Technical monospace font for sophistication
      )}
    >
      DataLocker
    </motion.span>
  )

  const containerClasses = cn(
    "flex items-center gap-3",
    classes.container,
    clickable && "cursor-pointer",
    className
  )

  if (variant === 'icon-only') {
    return (
      <motion.div 
        className={containerClasses}
        onClick={onClick}
        {...hoverAnimation}
      >
        <LogoIcon />
      </motion.div>
    )
  }

  if (variant === 'minimal') {
    return (
      <motion.div 
        className={containerClasses}
        onClick={onClick}
        {...hoverAnimation}
      >
        <LogoText />
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={containerClasses}
      onClick={onClick}
      {...hoverAnimation}
    >
      <LogoIcon />
      <LogoText />
    </motion.div>
  )
}