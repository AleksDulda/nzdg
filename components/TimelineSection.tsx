'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface TimelineSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

const timelineData = [
  {
    id: 1,
    date: "İlk Tanışma",
    title: "O Büyülü An",
    description: "İlk kez göz göze geldiğimiz o an... Kalp atışlarımızın senkronize olduğu o büyülü anı hiç unutmayacağım.",
    image: "/images/timeline-1.jpg",
    emoji: "💕",
    video: "https://www.youtube.com/embed/r1r8tlW2xbM",
    isYouTube: true
  },
  {
    id: 2,
    date: "İlk Buluşma",
    title: "Kahve ve Konuşma",
    description: "İlk buluşmamızda saatlerce konuştuk. O gün senin ne kadar özel bir insan olduğunu anladım.",
    image: "/images/timeline-2.jpg",
    emoji: "☕",
    video: "https://www.youtube.com/embed/7cah0uVPHms",
    isYouTube: true
  },
  {
    id: 3,
    date: "İlk Öpücük",
    title: "Aşkın Başlangıcı",
    description: "O gece ay ışığında... İlk öpücüğümüzün o büyülü anını hala kalbimde taşıyorum.",
    image: "/images/timeline-3.jpg",
    emoji: "💋",
    video: "https://www.youtube.com/embed/JdiJiMKcTYM",
    isYouTube: true
  },
  {
    id: 4,
    date: "İlk Kavgamız",
    title: "Kıyamet Günü",
    description: "Her kavgadan sonra birbirimizi daha iyi anlıyoruz. O gün öğrendik ki sevgi bazen zorlu anlardan geçer.",
    image: "/images/timeline-4.jpg",
    emoji: "💔",
    video: "https://www.youtube.com/embed/sgu5jNejoV4",
    isYouTube: true
  },
  {
    id: 5,
    date: "Birbirimizin Gönlünü Alma",
    title: "Barışma Anı",
    description: "Kavgadan sonra birbirimizin gönlünü almak... O an bizi birbirimize bağlayan sevginin ne kadar güçlü olduğunu anladık.",
    image: "/images/timeline-5.jpg",
    emoji: "💗",
    video: "https://www.youtube.com/embed/-4w6ccZYy6s",
    isYouTube: true
  },
  {
    id: 6,
    date: "Bugün",
    title: "Doğum Günün",
    description: "Ve bugün... Senin özel günün! Seni ne kadar sevdiğimi ve ne kadar şanslı olduğumu hatırlatmak istiyorum.",
    image: "/images/timeline-6.jpg",
    emoji: "🎂",
    video: "https://www.youtube.com/embed/jaz1YuCvlcQ",
    isYouTube: true
  }
]

export default function TimelineSection({ onNext, triggerConfetti }: TimelineSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [showNextButton, setShowNextButton] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const handleItemClick = (itemId: number) => {
    const item = timelineData.find(data => data.id === itemId)
    
    if (item?.video) {
      setSelectedVideo(item.video)
      setShowVideoModal(true)
    }
    
    if (itemId === timelineData.length) {
      triggerConfetti()
      setTimeout(() => setShowNextButton(true), 1000)
    }
  }

  const closeVideoModal = () => {
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Zaman Tüneli</span>
          </h2>
          <p className="text-xl text-white/80">
            Birlikte yaşadığımız güzel anıların yolculuğu
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>

          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-pink-500 z-10"></div>

              {/* Content Card */}
              <motion.div
                className="ml-20 glass-effect rounded-2xl p-6 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji */}
                  <motion.div
                    className="text-4xl"
                    animate={hoveredItem === item.id ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.emoji}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-pink-300 font-medium">{item.date}</span>
                      <span className="text-2xl">•</span>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      {item.video && (
                        <motion.div
                          className="text-yellow-400 text-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🎬
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-white/80 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Hover Effect - Additional Info */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredItem === item.id ? 1 : 0,
                        height: hoveredItem === item.id ? "auto" : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/10 rounded-lg p-3 mt-3">
                        <p className="text-sm text-white/70 italic">
                          💭 "Bu anı hiç unutmayacağım..."
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Next Section Button */}
        {showNextButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
            >
              <span className="flex items-center gap-2">
                Bir Sonraki Sürpriz İçin Kaydır
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⬇️
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        )}

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

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full h-full max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeVideoModal}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-yellow-400 transition-colors z-10"
              >
                ✕
              </button>
              
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden w-full h-full">
                {timelineData.find(item => item.video === selectedVideo)?.isYouTube ? (
                  <iframe
                    src={`${selectedVideo}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    onEnded={closeVideoModal}
                  >
                    <source src={selectedVideo} type="video/quicktime" />
                    <source src={selectedVideo} type="video/mp4" />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                )}
              </div>
              
              {/* Video Info */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">
                  Video izlemek için tıklayın ve tam ekran yapabilirsiniz
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

