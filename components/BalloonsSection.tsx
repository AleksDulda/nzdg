'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface BalloonsSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

const defaultBalloonMessages = [
  {
    id: 1,
    message: "Doğum günün kutlu olsun nazlı kızım Naz'ım💞🥳💐 İyi ki doğdunnn ve iyi ki seni tanımışımmmm✨️🥹 İnşallah ömrün boyunca heppp mutlu sevdiklerinle güzel bir hayat yaşarsınnn 🫂 Seni çok seviyorum kiii🙃🌷💐💞🥳",
    author: "Sarenur Unuttum",
    color: "from-pink-400 to-pink-600",
    emoji: "💕"
  },
  {
    id: 2,
    message: "İyi ki doğduun Naz! 🎂🎉\nNaz deyince; yan çar, otogar, Karaburun'un rüzgârı, rakı-balık, sahil yürüyüşleri, yaz akşamları ve öğrenci evi ninjaları geliyor aklıma.\nKısa bir zaman zarfında tanıdığım kadarıyla, enerjinle ve samimiyetinle keyifli anılar bıraktın.\nYeni yaşında da bol kahkaha, keyifli anılar, bol gezi, az stres, ve teyzeden alıntı: askerlere hayır! 😄🍾☀️\n tuttuğun dilek gerçek olsun!!🍀💫",
    author: "Liva",
    color: "from-blue-400 to-blue-600",
    emoji: "🌟"
  },
  {
    id: 3,
    message: "İYİ Kİ DOĞDUN NAZOŞŞŞ SENİ ÇOK SEVİYORUM NİCE MUTLU BİZLİ VE ZEHRALI SENELERE 🥳🥳🥳🥳",
    author: "ruveyda yılmaz",
    color: "from-purple-400 to-purple-600",
    emoji: "💖"
  },
  {
    id: 4,
    message: "Ortaokuldan beri her zaman yanımda olduğun ve en zor senem olan mezuna kaldığım sene yoldaşım olduğun için teşekkür ederim :) Aramıza ne kadar mesafe girerse girsin dostluğumuz hep daha güçlü oldu, bundan sonrası için de öyle olacak biliyorum. Doğum günün kutlu olsun, iyi ki varsın💖",
    author: "Gamze Demirtaş",
    color: "from-orange-400 to-orange-600",
    emoji: "🤗"
  },
  {
    id: 5,
    message: "Ortaokuldan bu yana her şey değişti ama dostluğumuz hiç değişmedi🥰 iyi ki doğdun iyi ki varsın 💫 Yeni yaşın sana tüm güzelleriyle gelsin canım dostum 💖💝🫶🏻🫂",
    author: "Nurgül çetin",
    color: "from-yellow-400 to-yellow-600",
    emoji: "🎂"
  },
  {
    id: 6,
    message: "Doğum günün kutlu olsun birtanem nice musmutlu yıllarımız olsunnn 🤍💞 Seni çok seviyoruuummm iyi ki varsın 💖",
    author: "Hatice Dönmez",
    color: "from-cyan-400 to-cyan-600",
    emoji: "🌸"
  },
  {
    id: 7,
    message: "Canım arkadaşım iyi ki doğdun seni çok seviyorum arkadaşlığımız dostluğumuz ömür boyu sürsün dileklerin her zaman gerçek olsun öpüyorum kocaman💖🫶🏻🌸💐🥹",
    author: "Zeynep beyza",
    color: "from-green-400 to-green-600",
    emoji: "💗"
  },
  {
    id: 8,
    message: "Naaaazz Doğum günün kutlu olsunnn 🥳. Nice musmutlu seneleree. Yeni yaşında tüm güzellikler senin olsunn. Seni tanımak çok çook güzel💛💛💛. Başta ne kadar taş gibi sert olduğunu düşünsem de içten içe çok tatlı biri çıktın AHAHAHAHAH 4.sende artık söylemiş olayım. İyi ki doğdun, iyi ki varsın. 🎂🍰✌🏻çok çok sevgilerlee.\nEFE",
    author: "Tarık Efe Güner",
    color: "from-red-400 to-red-600",
    emoji: "🎈"
  },
  {
    id: 9,
    message: "Hayatımda tanıdığım en anlayışlı en tatlı ve bı o kadarda eğlenceli insanlardansın iyi ki seni tanımışım ve bakış açınla herşeye renk getirdiğin için teşekkürler iyi ki doğdun iyi ki varsınnn ❤️🥳🥳",
    author: "Berat Alaca",
    color: "from-rose-400 to-rose-600",
    emoji: "💐"
  },
  {
    id: 10,
    message: "Birliktee nicee nicee senelere aşkım. İnşallah her günümüz bir öncekinden güzel geçer!! Nice mutlu musmutlu güzell yıllaraa.!!!!",
    author: "Zehra Bozkurt",
    color: "from-indigo-400 to-indigo-600",
    emoji: "✨"
  },
  {
    id: 11,
    message: "Sevgi ve saygı bacı bunlar olunca biz senle torunlarımızın çoçuklarını bile görürüz. Valla çok seviyorum seni. Arada seni dövesim geliyor ama o da tuzu biberi ne olacak kinee. Nazarr valla nazarr",
    author: "Zehra Bozkurt",
    color: "from-teal-400 to-teal-600",
    emoji: "🎁"
  }
]

export default function BalloonsSection({ onNext, triggerConfetti, audioEnabled }: BalloonsSectionProps) {
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([])
  const [showMessages, setShowMessages] = useState<number[]>([])
  const [allPopped, setAllPopped] = useState(false)
  const [showSurprise, setShowSurprise] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<number | null>(null)
  const [balloonMessages, setBalloonMessages] = useState(defaultBalloonMessages)
  const popAudioRef = useRef<HTMLAudioElement>(null)
  const bgMusicRef = useRef<HTMLAudioElement>(null)

  // Load from public/content.json (generated from NAZ DG.xlsx)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/content.json', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (!Array.isArray(json?.balloons) || json.balloons.length === 0) return
        const normalized = json.balloons.map((b: any, idx: number) => ({
          id: b.id ?? idx + 1,
          message: String(b.message ?? '').trim() || '❤',
          author: String(b.author ?? 'Anonim'),
          color: String(b.color ?? 'from-pink-400 to-pink-600'),
          emoji: String(b.emoji ?? '💕'),
          media: b.media && b.media.url ? b.media : undefined,
        }))
        if (!cancelled) setBalloonMessages(normalized)
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
    setShowMessages([...showMessages, balloonId])
    setCurrentMessage(balloonId)
    triggerConfetti()
    
    // Balloon pop sound effect
    if (audioEnabled && popAudioRef.current) {
      popAudioRef.current.currentTime = 0
      popAudioRef.current.play().catch(() => {})
    }

    // Check if all balloons are popped
    if (poppedBalloons.length + 1 === balloonMessages.length) {
      setTimeout(() => {
        setAllPopped(true)
        setTimeout(() => {
          setShowSurprise(true)
        }, 1000)
      }, 500)
    }
  }

  const closeMessage = () => {
    setCurrentMessage(null)
  }

  const handleSurpriseClick = () => {
    triggerConfetti()
    setTimeout(() => onNext(), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
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
            <span className="gradient-text">Arkadaşlarının Mesajları</span>
          </h2>
          <p className="text-xl text-white/80">
            Her balonda arkadaşlarından özel mesajlar var. Patlat ve oku! 🎈💕
          </p>
        </motion.div>

        {/* Balloons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {balloonMessages.map((balloon, index) => (
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

        {/* Message Modal */}
        <AnimatePresence>
          {currentMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={closeMessage}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              >
                {(() => {
                  const balloon = balloonMessages.find(b => b.id === currentMessage)
                  if (!balloon) return null
                  
                  return (
                    <>
                      <button
                        onClick={closeMessage}
                        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl transition-colors z-10"
                      >
                        ✕
                      </button>
                      
                      {/* Message Section */}
                      <div className="text-center">
                        <h4 className="text-yellow-300 text-xs font-medium mb-2 uppercase tracking-wide">
                          Kimden? 💌
                        </h4>
                        <div className="text-white text-lg font-bold mb-4">
                          {balloon.author}
                        </div>
                        <p className="text-white font-semibold text-base md:text-lg leading-relaxed">
                          {balloon.message}
                        </p>
                        {/* Optional media */}
                        {balloon.hasOwnProperty('media') && (balloon as any).media && (
                          <div className="mt-6 pt-6 border-t border-white/20 text-left">
                            <h5 className="text-yellow-300 text-xs font-medium mb-3 uppercase tracking-wide">
                              Gönderenin Medyası
                            </h5>
                            {((balloon as any).media.type === 'image') && (
                              <img src={(balloon as any).media.url} alt="Gönderen medyası" className="w-full rounded-lg" />
                            )}
                            {((balloon as any).media.type === 'video') && (
                              <video src={(balloon as any).media.url} controls className="w-full rounded-lg" />
                            )}
                          </div>
                        )}
                      </div>
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
                  Tüm Mesajlar Okundu! 🎉
                </h3>
                <p className="text-white/80 text-lg">
                  Arkadaşlarının senin için yazdığı tüm özel mesajlar okundu! Şimdi birlikte hatırladığınız anılara bakalım! 💕
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
                  Anıları Görmek İçin Devam Et 💭
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ➡️
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
    </div>
  )
}

