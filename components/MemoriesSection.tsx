'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface MemoriesSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

const defaultMemoryBalloons = [
  {
    id: 1,
    memory: "Berna ben ve Naz bowlinge gitmiştik orada çok eğlenmistikk🙂 ben kaybederken cok eğlenmistim Naz da kazanmaya başladığını anlayınca shqbqhahwh",
    memoryKeyword: "Gerçek eğlenceee",
    author: "Sarenur",
    color: "from-blue-400 to-blue-600",
    emoji: "🎳",
    media: {
      type: "image",
      url: "/images/sarenur-bowling.jpg"
    }
  },
  {
    id: 2,
    memory: "Rümeysa ağlarken Zehra'nın götünü ısırmam için zorladığın zaman glemylwlyöwltlellgle",
    memoryKeyword: "GÖTTTTT",
    author: "Ruveyda",
    color: "from-green-400 to-green-600",
    emoji: "😄"
  }
]

export default function MemoriesSection({ onNext, triggerConfetti, audioEnabled }: MemoriesSectionProps) {
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([])
  const [allPopped, setAllPopped] = useState(false)
  const [showSurprise, setShowSurprise] = useState(false)
  const [currentMemory, setCurrentMemory] = useState<number | null>(null)
  const [memoryBalloons, setMemoryBalloons] = useState(defaultMemoryBalloons)
  const popAudioRef = useRef<HTMLAudioElement>(null)
  const bgMusicRef = useRef<HTMLAudioElement>(null)

  // Fetch overrides from /content.json on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/content.json', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (!Array.isArray(json?.memories) || json.memories.length === 0) return
        const normalized = json.memories.map((m: any, idx: number) => ({
          id: m.id ?? idx + 1,
          memory: String(m.memory ?? '').trim() || '💭',
          memoryKeyword: m.memoryKeyword ? String(m.memoryKeyword) : undefined,
          author: m.author ? String(m.author) : 'Anonim',
          color: String(m.color ?? 'from-blue-400 to-blue-600'),
          emoji: m.media?.type === 'video' ? '🎥' : m.media?.type === 'image' ? '📸' : String(m.emoji ?? '💖'),
          media: m.media && m.media.url ? { type: m.media.type ?? 'image', url: String(m.media.url) } : undefined
        }))
        if (!cancelled) setMemoryBalloons(normalized)
      } catch {}
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (audioEnabled && bgMusicRef.current) {
      bgMusicRef.current.play().catch(() => {})
    } else if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }
  }, [audioEnabled])

  const handleBalloonClick = (balloonId: number) => {
    if (poppedBalloons.includes(balloonId)) return

    setPoppedBalloons([...poppedBalloons, balloonId])
    setCurrentMemory(balloonId)
    triggerConfetti()
    
    // Balloon pop sound effect
    if (audioEnabled && popAudioRef.current) {
      popAudioRef.current.currentTime = 0
      popAudioRef.current.play().catch(() => {})
    }

    // Check if all balloons are popped
    if (poppedBalloons.length + 1 === memoryBalloons.length) {
      setTimeout(() => {
        setAllPopped(true)
        setTimeout(() => {
          setShowSurprise(true)
        }, 1000)
      }, 500)
    }
  }

  const closeMemory = () => {
    setCurrentMemory(null)
  }

  const handleSurpriseClick = () => {
    triggerConfetti()
    setTimeout(() => onNext(), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* BG Music */}
      <audio ref={bgMusicRef} loop preload="auto" src="/music/bg-music.mp3" />
      {/* Balloon Pop Sound */}
      <audio ref={popAudioRef} preload="auto" src="/music/Baloon-pop.mp3" />
      
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Birlikte Hatırladığımız Anılar</span>
          </h2>
          <p className="text-xl text-white/80">
            Her balonda birlikte yaşadığınız güzel anılar var. Patlat ve keşfet! 💭🎈
          </p>
        </motion.div>

        {/* Balloons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {memoryBalloons.map((balloon, index) => (
            <motion.div
              key={balloon.id}
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ 
                opacity: 1, 
                scale: poppedBalloons.includes(balloon.id) ? 0 : 1,
                y: poppedBalloons.includes(balloon.id) ? -200 : 0
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                bounce: 0.6
              }}
              className="relative"
            >
              {/* Balloon */}
              <motion.div
                whileHover={{ scale: 1.1, y: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBalloonClick(balloon.id)}
                className={`relative cursor-pointer ${poppedBalloons.includes(balloon.id) ? 'pointer-events-none' : ''}`}
              >
                {/* Balloon Body */}
                <motion.div
                  className={`w-24 h-32 md:w-28 md:h-36 rounded-full bg-gradient-to-b ${balloon.color} shadow-lg relative`}
                  animate={poppedBalloons.includes(balloon.id) ? {} : {
                    y: [0, -10, 0],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Balloon String */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-white/60"></div>
                  
                  {/* Balloon Emoji */}
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    {balloon.emoji}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Memory Modal */}
        <AnimatePresence>
          {currentMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={closeMemory}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              >
                {(() => {
                  const memory = memoryBalloons.find(m => m.id === currentMemory)
                  if (!memory) return null
                  
                  return (
                    <>
                      <button
                        onClick={closeMemory}
                        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl transition-colors z-10"
                      >
                        ✕
                      </button>
                      
                      {/* Author Section */}
                      <div className="text-center mb-6">
                        <h4 className="text-yellow-300 text-xs font-medium mb-2 uppercase tracking-wide">
                          Kimden? 💭
                        </h4>
                        <div className="text-white text-lg font-bold mb-4">
                          {memory.author}
                        </div>
                      </div>

                      {/* Memory Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                      >
                        <h4 className="text-yellow-300 text-xs font-medium mb-3 text-left uppercase tracking-wide">
                          Birlikte Hatırladığımız Anı 💭
                        </h4>
                        <p className="text-white/90 text-sm md:text-base leading-relaxed text-left mb-3">
                          {memory.memory}
                        </p>
                        {memory.memoryKeyword && (
                          <div className="mt-4">
                            <h5 className="text-yellow-300/80 text-xs font-medium mb-2 text-left uppercase tracking-wide">
                              Anıyı Temsil Eden Kelime
                            </h5>
                            <div className="text-center">
                              <span className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-2 rounded-full text-white/80 text-sm font-medium border border-white/20">
                                {memory.memoryKeyword}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Media Section */}
                      {memory.media && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="pt-6 border-t border-white/20"
                        >
                          <h4 className="text-yellow-300 text-xs font-medium mb-3 text-left uppercase tracking-wide">
                            {memory.media.type === 'image' ? 'O Güne Ait Bir Fotoğraf 📸' : memory.media.type === 'video' ? 'O Güne Ait Bir Video 🎥' : 'O Güne Ait Bir Ses Kaydı 🎵'}
                          </h4>
                          
                          {memory.media.type === 'image' && (
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={memory.media.url}
                                alt="Anı fotoğrafı"
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<p class="text-white/60 text-sm">Fotoğraf yüklenemedi. Bağlantıyı kontrol edin.</p>';
                                  }
                                }}
                              />
                            </div>
                          )}
                          
                          {memory.media.type === 'video' && (
                            <div className="relative rounded-lg overflow-hidden">
                              <video
                                controls
                                className="w-full h-auto rounded-lg"
                                src={memory.media.url}
                              >
                                Tarayıcınız video oynatmayı desteklemiyor.
                              </video>
                            </div>
                          )}
                          
                          {memory.media.type === 'audio' && (
                            <div className="bg-white/5 rounded-lg p-4">
                              <audio
                                controls
                                className="w-full"
                                src={memory.media.url}
                              >
                                Tarayıcınız ses oynatmayı desteklemiyor.
                              </audio>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Balloons Popped Message */}
        <AnimatePresence>
          {allPopped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Tüm Anılar Açıldı! 🎉
                </h3>
                <p className="text-white/80 text-lg">
                  Birlikte yaşadığınız tüm özel anılar görüntülendi! Şimdi son sürprize hazır mısın? 💕
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Surprise Button */}
        <AnimatePresence>
          {showSurprise && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSurpriseClick}
                className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
              >
                <span className="flex items-center gap-2">
                  Son Sürpriz İçin Tıkla! 🎁
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    🎁
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Hearts & Cakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => {
            const emoji = i % 3 === 0 ? '🎂' : '💖';
            const leftPos = ((i * 7 + 13) % 100);
            const topPos = ((i * 11 + 17) % 100);
            const delay = (i * 0.2) % 3;
            
            return (
              <motion.div
                key={`floating-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
