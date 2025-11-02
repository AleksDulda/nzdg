'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface HeroSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

export default function HeroSection({ onNext, triggerConfetti, audioEnabled }: HeroSectionProps) {
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500)
    const timer2 = setTimeout(() => setShowButton(true), 2000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Müzik çalma kontrolü
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [audioEnabled])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handleStart = () => {
    triggerConfetti()
    setTimeout(() => onNext(), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Hero Background Music */}
      <audio ref={audioRef} loop preload="auto" src="/music/Hero-music.mp3" />

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          filter: 'brightness(0.4) blur(0.5px)',
          backgroundSize: 'contain',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Content */}
      <div className="text-center z-20 px-4 max-w-4xl mx-auto">

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          <span className="gradient-text">Merhaba, Sevgilimmmmmmm!!!</span>
        </motion.h1>

        {/* Birthday Message */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-2xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <p className="text-lg text-white/90 leading-relaxed">
              "Bugün senin özel günün ve ben de senin için 
              küçük bir sürpriz hazırladım! 🎁"
            </p>
          </motion.div>
        )}

        {/* Start Button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
          >
            <span className="flex items-center gap-2">
              Sürprize Başla! 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </span>
          </motion.button>
        )}

        {/* Floating Hearts & Cakes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => {
            const emoji = i % 3 === 0 ? '🎂' : '💖';
            return (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Arrow Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/70"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
