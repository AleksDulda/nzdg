'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'

// YouTube video ID'sini URL'den çıkar
const YOUTUBE_VIDEO_ID = '16pTwNEuNZc'

interface VideoSectionProps {
  onNext: () => void
  onPrev: () => void
  triggerConfetti: () => void
  audioEnabled?: boolean
}

export default function VideoSection({ onNext, triggerConfetti, audioEnabled }: VideoSectionProps) {
  const [showMessage, setShowMessage] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [showPostMessage, setShowPostMessage] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const letterAudioRef = useRef<HTMLAudioElement>(null)
  const waitingAudioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const videoEndedRef = useRef(false)

  // Letter müziği kontrolü - video bittikten sonra çalar
  useEffect(() => {
    // Only pause if audio is disabled and video has ended
    if (!audioEnabled && videoEnded && letterAudioRef.current) {
      letterAudioRef.current.pause()
    }
    // videoEndedRef'i senkronize et
    videoEndedRef.current = videoEnded
  }, [audioEnabled, videoEnded])

  // handleVideoEnd fonksiyonunu önce tanımla
  const handleVideoEnd = useCallback(() => {
    // Zaten bitmişse tekrar çalıştırma (ref kullanarak kontrol et)
    if (videoEndedRef.current) {
      return
    }
    
    videoEndedRef.current = true
    setVideoEnded(true)
    
    // Video bitti - state'leri güncelle
    setShowFinalMessage(true)
    setShowPostMessage(true)
    triggerConfetti()
    
    // Start letter music when video ends
    if (letterAudioRef.current) {
      letterAudioRef.current.currentTime = 0
      letterAudioRef.current.play().catch(() => {})
    }
  }, [triggerConfetti])
  
  // Manuel geçiş fonksiyonu
  const handleContinue = () => {
    if (videoEndedRef.current) {
      onNext()
    }
  }

  // Video bitişini algıla (YouTube API)
  useEffect(() => {
    if (!showVideo || videoEnded) {
      return
    }

    // YouTube iframe postMessage'larını dinle
    const handleMessage = (event: MessageEvent) => {
      // Sadece YouTube'dan gelen mesajları işle
      if (!event.origin.includes('youtube.com') && !event.origin.includes('youtu.be')) {
        return
      }

      try {
        let data = event.data
        
        // String ise parse et
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch {
            // JSON değilse olduğu gibi kullan
          }
        }

        // YouTube Player API state değişiklikleri
        // State 0 = ENDED (video bitti)
        const state = data?.info?.playerState || data?.data?.playerState || data?.playerState || data?.state || data?.data?.state || data?.info
        
        // Video bitiş kontrolü
        const isVideoEnded = (
          (data?.event === 'onStateChange' || data?.event === 'onPlayerStateChange' || data?.event === 'video-ended') && 
          state === 0
        ) || (
          data?.info?.videoData?.video_id && state === 0
        ) || (
          data?.data?.playerState === 0
        )
        
        if (isVideoEnded && !videoEndedRef.current && showVideo) {
          handleVideoEnd()
        }
      } catch (e) {
        // Hata olursa görmezden gel
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [showVideo, videoEnded, handleVideoEnd])

  // Waiting (supriz-waiting) müziği kontrolü - izleme tuşuna basılana kadar çalar
  useEffect(() => {
    const shouldPlayWaiting = audioEnabled && showMessage && !showVideo && !videoEnded
    if (waitingAudioRef.current) {
      if (shouldPlayWaiting) {
        waitingAudioRef.current.play().catch(() => {})
      } else {
        waitingAudioRef.current.pause()
        waitingAudioRef.current.currentTime = 0
      }
    }
  }, [audioEnabled, showMessage, showVideo, videoEnded])

  useEffect(() => {
    return () => {
      if (letterAudioRef.current) {
        letterAudioRef.current.pause()
      }
      if (waitingAudioRef.current) {
        waitingAudioRef.current.pause()
      }
    }
  }, [])

  // Video bitince veya mesaj görününce letter music'i başlat
  useEffect(() => {
    if (videoEnded && letterAudioRef.current) {
      letterAudioRef.current.currentTime = 0
      letterAudioRef.current.play().catch(() => {})
    }
  }, [videoEnded])

  const handleShowVideo = () => {
    setShowMessage(false)
    setShowVideo(true)
    triggerConfetti()
    // Stop waiting audio
    if (waitingAudioRef.current) {
      waitingAudioRef.current.pause()
      waitingAudioRef.current.currentTime = 0
    }
  }

  const handleRestart = () => {
    triggerConfetti()
    setTimeout(() => {
      // In a real app, you might want to restart the entire experience
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Letter Music */}
      <audio ref={letterAudioRef} loop preload="auto" src="/music/Letter-music.mp3" />
      {/* Waiting Music (before play) */}
      <audio ref={waitingAudioRef} loop preload="auto" src="/music/supriz-waiting.mp3" />
      
      {/* Background Images - shown when video ends */}
      {videoEnded ? (
        <>
          <div className="absolute inset-0 opacity-80">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/OUTTER.png)' }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/OUTTER2.png)' }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-purple-900/40 to-slate-800/40" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 opacity-60">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/OUTTER.png)', filter: (!videoEnded && showMessage && !showVideo) ? 'blur(20px)' : 'blur(1.5px)' }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/OUTTER2.png)', filter: (!videoEnded && showMessage && !showVideo) ? 'blur(20px)' : 'blur(1.5px)' }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/60 to-slate-800/60" />
        </>
      )}
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Son Sürpriz</span>
          </h2>
        </motion.div>

        {/* Video Container - hidden when video ends */}
        {!videoEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect rounded-2xl p-8 text-center mb-8"
          >
            {showMessage && !showVideo ? (
              /* Özel Mesaj */
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  <span className="gradient-text">Son ve Önemli Bir Sürpriz...</span>
                </h3>
                
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-4">
                    Senin için çok özel birini buldum. Biliyorum ki o da seni çok özlemiş...
                  </p>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-4">
                    O senin eski dostun, senin en sadık arkadaşın. Ve bugün, senin doğum gününü kutlamak için burada.
                  </p>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    <span className="gradient-text font-semibold">Seni çok seviyor ve bugün senin için özel bir şey hazırladı...</span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowVideo}
                  className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
                >
                  <span className="flex items-center gap-2">
                    Onun Mesajını İzle
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </span>
                </motion.button>
              </motion.div>
            ) : !showVideo ? (
            /* Video Preview/Thumbnail */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {/* Video Thumbnail */}
              <div className="relative bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl p-12 mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-8xl mb-4"
                >
                  🎬
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Özel Video Montajı
                </h3>
                <p className="text-white/80">
                  Birlikte yaşadığımız güzel anların derlemesi
                </p>
              </div>

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowVideo}
                className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30"
              >
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▶️
                  </motion.span>
                  Videoyu İzle
                </span>
              </motion.button>
            </motion.div>
          ) : (
            /* Video Player */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-6 w-full aspect-video">
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&enablejsapi=1&playsinline=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Sürpriz Video"
                  onLoad={() => {
                    // Video yüklendiğinde YouTube Player API ile bağlantı kur
                    setTimeout(() => {
                      if (iframeRef.current?.contentWindow) {
                        try {
                          // YouTube iframe'e listening mesajı gönder
                          iframeRef.current.contentWindow.postMessage(
                            JSON.stringify({ 
                              event: 'listening',
                              id: 'video-player'
                            }),
                            'https://www.youtube.com'
                          )
                        } catch (e) {
                          // Cross-origin hatası normal
                        }
                      }
                    }, 1500)
                  }}
                />
              </div>

              {/* Video Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  <span className="gradient-text">Özel Doğum Günü Kutlaması</span>
                </h3>
                <p className="text-white/80 mb-4">
                  Seni çok seven birinin özel mesajı ✨
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
        )}

        {/* Sonraki Adıma Geç Butonu - Sadece video oynatıldığında görünür */}
        {!videoEnded && showVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8 relative z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setVideoEnded(true)
                videoEndedRef.current = true
                setShowPostMessage(true)
                triggerConfetti()
                // Letter music'i başlat
                if (letterAudioRef.current) {
                  letterAudioRef.current.currentTime = 0
                  letterAudioRef.current.play().catch(() => {})
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              Sonraki Adıma Geç
            </motion.button>
          </motion.div>
        )}

        {/* Sakızın Mesajı - Video kaybolunca görünür */}
        <AnimatePresence>
          {videoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center mt-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <div className="relative max-w-2xl mx-auto mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  <span className="gradient-text">İyi Ki Doğdun NAZ!</span>
                </h3>
                <div className="glass-effect rounded-xl p-8">
                  <p className="text-white/90 text-lg leading-relaxed mb-4">
                    Sen benim hayatımın en güzel hediyesisin.
                  </p>
                  <p className="text-white/90 text-lg leading-relaxed mb-4">
                    Her gün seninle geçirdiğim anlar, benim için en değerli zamanlardı.
                  </p>
                  <p className="text-xl font-semibold text-white mb-4">
                    Seni sonsuza kadar seveceğim! 💕
                  </p>
                  <div className="mt-6 text-right font-serif text-white text-lg italic">
                    -Sakız
                  </div>
                </div>
              </div>
              
              {/* Baştan Başlat butonu */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 border border-slate-500/30 mt-6"
              >
                <span className="flex items-center gap-2">
                  Baştan Başlat
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🔄
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Message - Only shown inside video container */}
        <AnimatePresence>
            {showFinalMessage && !videoEnded && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="mt-8"
              >
                <div className="glass-effect rounded-xl p-6 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    İyi Ki Doğdun!
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Sen benim hayatımın en güzel hediyesisin. Her gün seninle geçirdiğim anlar, benim için en değerli zamanlardı. Seni sonsuza kadar seveceğim! 💕
                  </p>
                </div>
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

