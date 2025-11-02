'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface QuizSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

const quizQuestions = [
  {
    id: 1,
    question: "İlk buluşmamızda ne içmiştik?",
    options: ["Kahve", "Çay", "Smoothie", "Su"],
    correct: 0,
    explanation: "Doğru! O güzel kahve dükkanında saatlerce konuştuk ☕"
  },
  {
    id: 2,
    question: "En sevdiğim renk hangisi?",
    options: ["Mavi", "Pembe", "Mor", "Yeşil"],
    correct: 3,
    explanation: "Aynen! Yeşil rengi çok seviyorum, sen de biliyorsun 💚"
  },
  {
    id: 3,
    question: "Aleks beni hiç üzmez hep yanımda olur o dünyanın en tatlı insanı ve ben onu çok seviyorum..",
    options: ["kısmen", "kesinlikle", "alakası yok", "Bazen beni üzer"],
    correct: 1,
    explanation: "Evet aşkım ben de öyle düşünmüştüm 💚",
    special: true // Özel interaktif soru
  },
  {
    id: 4,
    question: "Aleks tok olsa bile benim rızkıma göz dikmesi normal midir?",
    options: ["kısmen", "kesinlikle normal", "alakası yok", "normal değil"],
    correct: 1,
    explanation: "paylaşmak + rızık = aşk! 💚",
    special: true // Özel interaktif soru
  },
  {
    id: 5,
    question: "Küçük bir atışmayı bitirmenin en iyi yolu?",
    options: ["Sarılmaca", "Sopayla Vurmaca", "Keşke Seni Tanımasaydım videosu", "Hepsi"],
    correct: 3,
    explanation: "Doğru 💚",
    special: true
  }
]

export default function QuizSection({ onNext, triggerConfetti, audioEnabled }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [optionPositions, setOptionPositions] = useState<{ [key: number]: { x: number; y: number } }>({})
  
  const backgroundAudioRef = useRef<HTMLAudioElement>(null)
  const correctAudioRef = useRef<HTMLAudioElement>(null)
  const wrongAudioRef = useRef<HTMLAudioElement>(null)

  // Quiz müziği kontrolü
  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (audioEnabled) {
        backgroundAudioRef.current.play().catch(() => {})
      } else {
        backgroundAudioRef.current.pause()
      }
    }
  }, [audioEnabled])

  useEffect(() => {
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
      }
    }
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQ = quizQuestions[currentQuestion]
    
    if (selectedAnswer !== null) return
    
    // Özel soru için doğru cevap dışındaki şıklara basıldığında ışınlan
    if (currentQ.special && answerIndex !== currentQ.correct) {
      // Şık genişliğini hesaba katarak görünür alan içinde rastgele pozisyon hesapla
      const buttonWidth = 250 // Yaklaşık buton genişliği
      const buttonHeight = 60 // Yaklaşık buton yüksekliği
      
      // Container'ın görünür alanını hesapla (padding ve margin'leri de hesaba kat)
      const containerMaxWidth = 800 // glass-effect container'ın max-width'i
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768
      
      // Container içinde rastgele pozisyon (min 20px padding ile)
      const minX = 20
      const maxX = Math.min(containerMaxWidth - buttonWidth - 20, viewportWidth - buttonWidth - 40)
      const minY = 20
      const maxY = Math.min(600 - buttonHeight - 20, viewportHeight - buttonHeight - 200)
      
      setOptionPositions(prev => ({
        ...prev,
        [answerIndex]: {
          x: Math.random() * (maxX - minX) + minX,
          y: Math.random() * (maxY - minY) + minY
        }
      }))
      
      // Yanlış cevap ses efekti
      if (audioEnabled && wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0
        wrongAudioRef.current.play().catch(() => {})
      }
      return // Diğer şıklara basıldığında sadece ışınlan, cevap seçme
    }
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1)
      triggerConfetti()
      // Doğru cevap ses efekti
      if (audioEnabled && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0
        correctAudioRef.current.play().catch(() => {})
      }
    } else {
      // Yanlış cevap ses efekti
      if (audioEnabled && wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0
        wrongAudioRef.current.play().catch(() => {})
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setOptionPositions({}) // Pozisyonları sıfırla
    } else {
      setQuizCompleted(true)
      triggerConfetti()
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 80) return "Mükemmel! Sen beni çok iyi tanıyorsun! 💫"
    if (percentage >= 60) return "Harika! Beni oldukça iyi tanıyorsun! 🌟"
    if (percentage >= 40) return "İyi! Beni tanımaya devam ediyorsun! ✨"
    return "Biraz daha zaman geçirelim, daha iyi tanıyacaksın! 💕"
  }

  const getScoreEmoji = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 80) return "🏆"
    if (percentage >= 60) return "🥇"
    if (percentage >= 40) return "🥈"
    return "💝"
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {/* Audio Elements */}
        <audio ref={backgroundAudioRef} loop preload="auto" src="/music/Quiz-bf-sound.mp3" />
        <audio ref={correctAudioRef} preload="auto" src="/music/Correct-answer.mp3" />
        <audio ref={wrongAudioRef} preload="auto" src="/music/wrong-answer.mp3" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Score Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="text-8xl mb-6"
          >
            {getScoreEmoji()}
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Quiz Tamamlandı!</span>
          </h2>

          <div className="glass-effect rounded-2xl p-8 mb-8">
            <div className="text-6xl font-bold text-white mb-4">
              {score}/{quizQuestions.length}
            </div>
            <div className="text-2xl text-white/90 mb-4">
              {getScoreMessage()}
            </div>
            
            {/* Score Bar */}
            <div className="w-full bg-white/20 rounded-full h-4 mb-6">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(score / quizQuestions.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            <p className="text-white/80 text-lg">
              Kalbin doğru cevap, gerisi detay. Seni seviyorum! 💕
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
          >
            <span className="flex items-center gap-2">
              Devam Et
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ➡️
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const isCorrect = selectedAnswer === currentQ.correct

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Audio Elements */}
      <audio ref={backgroundAudioRef} loop preload="auto" src="/music/Quiz-bf-sound.mp3" />
      <audio ref={correctAudioRef} preload="auto" src="/music/Correct-answer.mp3" />
      <audio ref={wrongAudioRef} preload="auto" src="/music/wrong-answer.mp3" />
      
      <div className="max-w-3xl mx-auto w-full">
        {/* Progress */}
        <div className="text-center mb-8">
          <div className="text-white/70 mb-2">
            Soru {currentQuestion + 1} / {quizQuestions.length}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-slate-600 to-slate-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            {currentQ.question}
          </h2>

          <div className={`space-y-4 ${currentQ.special ? 'relative min-h-[400px]' : ''}`}>
            {currentQ.options.map((option, index) => {
              const position = optionPositions[index]
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  animate={position ? { 
                    x: position.x, 
                    y: position.y,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : { x: 0, y: 0 }}
                  className={`${currentQ.special && position ? 'absolute w-auto min-w-[200px]' : 'w-full'} p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-100'
                        : 'bg-red-500/20 border-2 border-red-400 text-red-100'
                      : selectedAnswer !== null && index === currentQ.correct
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-100'
                      : 'bg-white/5 hover:bg-white/10 text-white border-2 border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? isCorrect
                          ? 'border-green-400 bg-green-400'
                          : 'border-red-400 bg-red-400'
                        : selectedAnswer !== null && index === currentQ.correct
                        ? 'border-green-400 bg-green-400'
                        : 'border-white/50'
                    }`}>
                      {selectedAnswer === index && (
                        <span className="text-white text-sm">
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                      {selectedAnswer !== null && index === currentQ.correct && selectedAnswer !== index && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Result Message */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 p-4 rounded-xl ${
                  isCorrect 
                    ? 'bg-green-500/20 border border-green-400' 
                    : 'bg-red-500/20 border border-red-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {isCorrect ? '🎉' : '💔'}
                  </span>
                  <div>
                    <p className={`font-semibold ${
                      isCorrect ? 'text-green-100' : 'text-red-100'
                    }`}>
                      {isCorrect ? 'Doğru!' : 'Yanlış!'}
                    </p>
                    {currentQ.special && isCorrect && (
                      <p className={`text-sm mt-1 ${
                        isCorrect ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {currentQ.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Next Button */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
            >
              {currentQuestion < quizQuestions.length - 1 ? 'Sonraki Soru' : 'Sonucu Gör'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

