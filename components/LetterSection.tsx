'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface LetterSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

const letterText = `Sen ki, gönüller ülkesinin sultanı, tebessümler vilayetinin şahı, gözlerinin nuruyla geceleri bayram eyleyen, yorgun günlerimin baharı, sırlar diyarımın mihmandarı Aysegul Naz Kuru'sun.

Anılarımızın Rumelisi, kahkahalarımızın Anadolusu; kalbimin Akdeniz'i ile Karadeniz'ini aynı haritada buluşturan kudretsin.

Sözlerinle gamları sürgün eder, gülüşünle şehirleri aydınlatırsın; bir bakışınla sükûnu ferman, bir dokunuşunla huzuru divan edersin.

Ben ki, senin muhabbetine baş eğmiş, kapında bekleyen bir kul; adı var, tahtı yok; gönlü var, sâdece sana ayarlı Aleks Duldayım.

Hükmün kalbimde, nişanın zihnimde; bugünün doğum günün, her günüm bayramındır. Nice yılların şerefine: "Emrin aşk olsun, yüreğim yoldaş olsun." 💕`

export default function LetterSection({ onNext, triggerConfetti, audioEnabled }: LetterSectionProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const letterMusicRef = useRef<HTMLAudioElement>(null)

  // Letter müziği kontrolü
  useEffect(() => {
    if (audioEnabled && letterMusicRef.current) {
      letterMusicRef.current.play().catch(() => {})
    } else if (letterMusicRef.current) {
      letterMusicRef.current.pause()
    }
  }, [audioEnabled])

  useEffect(() => {
    return () => {
      if (letterMusicRef.current) {
        letterMusicRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        const nextChar = letterText[displayedText.length]
        if (nextChar) {
          setDisplayedText(displayedText + nextChar)
        } else {
          setIsTyping(false)
          setShowContinueButton(true)
          triggerConfetti()
        }
      }, 50) // Typing speed

      return () => clearTimeout(timer)
    }
  }, [displayedText, isTyping, triggerConfetti])

  const handleContinue = () => {
    triggerConfetti()
    setTimeout(() => onNext(), 1000)
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative" 
         style={{
           background: '#000000',
           backgroundImage: `
             radial-gradient(circle at 50% 30%, rgba(255, 140, 0, 0.12) 0%, transparent 40%),
             radial-gradient(circle at 30% 70%, rgba(255, 165, 0, 0.08) 0%, transparent 35%),
             radial-gradient(circle at 70% 60%, rgba(255, 140, 0, 0.1) 0%, transparent 38%)
           `
         }}>
      {/* Letter Music */}
      <audio ref={letterMusicRef} loop preload="auto" src="/music/Letter-music.mp3" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Osmanlı Temalı Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          {/* Osmanlı köşe süslemeleri */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl" style={{ 
                color: '#d4a574', 
                opacity: 0.7,
                textShadow: '0 0 10px rgba(255, 140, 0, 0.6)'
              }}>❋</div>
              <div className="text-3xl" style={{ 
                color: '#d4a574', 
                opacity: 0.7,
                textShadow: '0 0 10px rgba(255, 140, 0, 0.6)'
              }}>❋</div>
            </div>
          </div>

          <motion.h1
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-5xl md:text-7xl font-bold mb-4 relative"
            style={{ 
              fontFamily: 'serif',
              color: '#d4a574',
              textShadow: '0 0 20px rgba(255, 140, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5), 4px 4px 10px rgba(0,0,0,0.8)',
              letterSpacing: '0.15em',
              fontWeight: 'bold'
            }}
          >
            Mektubi Mecmua
          </motion.h1>
          
          {/* Osmanlı süsleme çizgileri */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mx-auto mb-3"
            style={{
              width: '250px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #8b6f47, #a0824d, #8b6f47, transparent)',
              boxShadow: '0 2px 4px rgba(139, 111, 71, 0.5)'
            }}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl italic"
            style={{ 
              fontFamily: 'serif',
              color: '#d4a574',
              textShadow: '0 0 15px rgba(255, 140, 0, 0.7), 0 0 30px rgba(255, 165, 0, 0.4), 2px 2px 6px rgba(0,0,0,0.6)',
              fontWeight: '500',
              letterSpacing: '0.05em'
            }}
          >
            Kalbimden dökülen sözler
          </motion.p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-3"
            style={{
              width: '180px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #8b6f47, transparent)',
              boxShadow: '0 2px 4px rgba(139, 111, 71, 0.5)'
            }}
          />
          
          {/* Alt köşe süslemeleri */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl" style={{ 
                color: '#d4a574', 
                opacity: 0.7,
                textShadow: '0 0 10px rgba(255, 140, 0, 0.6)'
              }}>❋</div>
              <div className="text-3xl" style={{ 
                color: '#d4a574', 
                opacity: 0.7,
                textShadow: '0 0 10px rgba(255, 140, 0, 0.6)'
              }}>❋</div>
            </div>
          </div>
        </motion.div>

        {/* Parşömen Mektup Kağıdı */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
          }}
        >
          {/* Parşömen Ana Kağıt - Yanık/Antik Görünüm */}
          <div className="relative rounded-lg p-8 md:p-16 mb-8"
               style={{
                 background: 'linear-gradient(to bottom, #d4b896 0%, #c9a882 20%, #b8956a 40%, #a0825a 60%, #8b6f4a 80%, #7a5f3a 100%)',
                 backgroundImage: `
                   radial-gradient(ellipse at 25% 30%, rgba(180, 140, 90, 0.45) 0%, transparent 55%),
                   radial-gradient(ellipse at 75% 70%, rgba(160, 120, 70, 0.4) 0%, transparent 55%),
                   radial-gradient(circle at 50% 50%, rgba(139, 111, 71, 0.25) 0%, transparent 75%),
                   radial-gradient(circle at 20% 80%, rgba(107, 78, 55, 0.3) 0%, transparent 45%),
                   radial-gradient(circle at 80% 20%, rgba(122, 95, 63, 0.35) 0%, transparent 45%),
                   radial-gradient(ellipse at 60% 40%, rgba(107, 78, 55, 0.2) 0%, transparent 60%)
                 `,
                 boxShadow: 'inset 0 0 100px rgba(107, 78, 55, 0.2), 0 20px 70px rgba(0,0,0,0.5), 0 0 30px rgba(139, 111, 71, 0.3)',
                 border: '4px solid rgba(107, 78, 55, 0.5)',
                 minHeight: '500px',
                 position: 'relative'
               }}>
            
            {/* Parşömen kenar yırtığı efekti - eski görünüm */}
            <div className="absolute top-0 left-0 w-12 h-12 opacity-70" 
                 style={{ 
                   background: 'radial-gradient(circle at 0% 0%, rgba(139, 111, 71, 0.6) 0%, transparent 70%)',
                   clipPath: 'polygon(0 0, 40% 0, 0 40%)'
                 }}></div>
            <div className="absolute top-0 right-0 w-12 h-12 opacity-70" 
                 style={{ 
                   background: 'radial-gradient(circle at 100% 0%, rgba(139, 111, 71, 0.6) 0%, transparent 70%)',
                   clipPath: 'polygon(60% 0, 100% 0, 100% 40%)'
                 }}></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 opacity-70" 
                 style={{ 
                   background: 'radial-gradient(circle at 0% 100%, rgba(139, 111, 71, 0.6) 0%, transparent 70%)',
                   clipPath: 'polygon(0 60%, 0 100%, 40% 100%)'
                 }}></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 opacity-70" 
                 style={{ 
                   background: 'radial-gradient(circle at 100% 100%, rgba(139, 111, 71, 0.6) 0%, transparent 70%)',
                   clipPath: 'polygon(60% 100%, 100% 100%, 100% 60%)'
                 }}></div>
            
            {/* Parşömen üzerinde yanık lekeler - antik görünüm */}
            <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full opacity-15" 
                 style={{ background: 'radial-gradient(circle, rgba(107, 78, 55, 0.4) 0%, rgba(139, 111, 71, 0.2) 40%, transparent 70%)' }}></div>
            <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full opacity-12" 
                 style={{ background: 'radial-gradient(circle, rgba(122, 95, 63, 0.35) 0%, rgba(160, 130, 77, 0.15) 50%, transparent 70%)' }}></div>
            <div className="absolute top-1/2 left-1/5 w-28 h-28 rounded-full opacity-10" 
                 style={{ background: 'radial-gradient(circle, rgba(107, 78, 55, 0.3) 0%, transparent 60%)' }}></div>
            <div className="absolute bottom-1/4 right-1/5 w-36 h-36 rounded-full opacity-13" 
                 style={{ background: 'radial-gradient(ellipse, rgba(122, 95, 63, 0.3) 0%, transparent 65%)' }}></div>

            {/* Mektup içeriği */}
            <div className="relative z-10 pb-12">

              {/* Letter Content - Osmanlı Mürekkep Rengi - Mum Işığı Efekti */}
              <div className="text-lg leading-relaxed min-h-[400px] font-serif"
                   style={{ 
                     fontSize: '1.2rem',
                     lineHeight: '2.3',
                     color: '#d4a574',
                     paddingLeft: '50px',
                     paddingRight: '30px',
                     paddingTop: '20px',
                     textShadow: '0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.5), 2px 2px 4px rgba(0,0,0,0.8)',
                     fontWeight: '500'
                   }}>
                <div className="whitespace-pre-wrap">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ 
                        color: '#ff8c00',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        textShadow: '0 0 15px rgba(255, 140, 0, 1), 0 0 30px rgba(255, 165, 0, 0.6)'
                      }}
                    >
                      |
                    </motion.span>
                  )}
                </div>
              </div>


              {/* Typing Indicator - Parşömenin dışında, altta */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-8 flex items-center justify-center gap-2 font-serif"
                  style={{ 
                    color: '#d4a574',
                    textShadow: '0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.5)',
                    fontWeight: '500',
                    fontSize: '1.1rem'
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full"
                    style={{ 
                      borderColor: '#ff8c00',
                      boxShadow: '0 0 8px rgba(255, 140, 0, 0.6)'
                    }}
                  />
                  Yazıyor...
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <AnimatePresence>
          {showContinueButton && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="px-10 py-5 text-xl font-semibold font-serif transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #8b6f47 0%, #a0824d 50%, #8b6f47 100%)',
                  color: '#f5e6d3',
                  boxShadow: '0 15px 40px rgba(139, 111, 71, 0.7), inset 0 2px 10px rgba(255,255,255,0.2)',
                  border: '2px solid rgba(107, 78, 55, 0.6)',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                  borderRadius: '8px'
                }}
              >
                Devam Et
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
