'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import HeroSection from '@/components/HeroSection'
import TimelineSection from '@/components/TimelineSection'
import QuizSection from '@/components/QuizSection'
import LetterSection from '@/components/LetterSection'
import BalloonsSection from '@/components/BalloonsSection'
import MemoriesSection from '@/components/MemoriesSection'
import VideoSection from '@/components/VideoSection'

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const sections = [
    { id: 'hero', component: HeroSection },
    { id: 'timeline', component: TimelineSection },
    { id: 'quiz', component: QuizSection },
    { id: 'letter', component: LetterSection },
    { id: 'balloons', component: BalloonsSection },
    { id: 'memories', component: MemoriesSection },
    { id: 'video', component: VideoSection },
  ]

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d946ef', '#0ea5e9', '#f59e0b', '#10b981']
    })
  }

  const nextSection = () => {
    console.log('nextSection çağrıldı, currentSection:', currentSection, 'sections.length:', sections.length)
    if (currentSection < sections.length - 1) {
      console.log('Bir sonraki section\'a geçiliyor:', currentSection + 1)
      setCurrentSection(currentSection + 1)
      triggerConfetti()
    } else {
      console.log('Zaten son section, devam edilemiyor')
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause()
        setAudioEnabled(false)
      } else {
        audioRef.current.play()
        setAudioEnabled(true)
      }
    }
  }

  useEffect(() => {
    // İlk yüklemede konfeti
    setTimeout(() => {
      triggerConfetti()
    }, 1000)
  }, [])

  const CurrentComponent = sections[currentSection].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/birthday-music.mp3"
      />
      
      {/* Audio Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-3 glass-effect rounded-full hover:scale-110 transition-all duration-300"
      >
        {audioEnabled ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.5l2.883-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.5l2.883-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </motion.button>


      {/* Navigation Arrows */}
      {currentSection > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={prevSection}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 p-3 glass-effect rounded-full hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {currentSection < sections.length - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={nextSection}
          className="fixed right-4 bottom-4 z-40 p-3 glass-effect rounded-full hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <CurrentComponent 
            onNext={nextSection}
            onPrev={prevSection}
            triggerConfetti={triggerConfetti}
            audioEnabled={audioEnabled}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-slate-600 to-slate-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

