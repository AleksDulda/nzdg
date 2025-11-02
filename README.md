# 🎉 Doğum Günü Sürprizi

Kişiye özel, interaktif doğum günü websitesi. Mini oyunlar, anılar ve sürprizlerle dolu tek sayfalık deneyim.

## ✨ Özellikler

### 🎯 6 Ana Modül

1. **Açılış (Hero)** - Kişisel selamlama + konfeti animasyonu
2. **Zaman Tüneli** - Anılar ve dönüm noktaları timeline'ı
3. **Mini Quiz** - "Beni Ne Kadar Tanıyorsun?" interaktif testi
4. **Mektup Makinesi** - Daktilo efektiyle yazılan kişisel mektup
5. **Dilek Balonları** - Patlatılabilir balonlar ve gizli mesajlar
6. **Video Sürprizi** - Son kapanış videosu

### 🎨 Teknik Özellikler

- **Next.js 14** - Modern React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animasyonlar
- **Canvas Confetti** - Konfeti efektleri
- **Responsive Design** - Tüm cihazlarda mükemmel görünüm

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlat:**
```bash
npm run dev
```

3. **Tarayıcıda aç:**
```
http://localhost:3000
```

## 🎨 Özelleştirme

### Kişiselleştirme

1. **İsim değiştirme:** `components/HeroSection.tsx` dosyasında "Sevgili" yerine gerçek ismi yazın
2. **Timeline verileri:** `components/TimelineSection.tsx` dosyasındaki `timelineData` array'ini düzenleyin
3. **Quiz soruları:** `components/QuizSection.tsx` dosyasındaki `quizQuestions` array'ini güncelleyin
4. **Mektup metni:** `components/LetterSection.tsx` dosyasındaki `letterText` değişkenini düzenleyin
5. **Balon mesajları:** `components/BalloonsSection.tsx` dosyasındaki `balloonMessages` array'ini özelleştirin

### Görsel Özelleştirme

1. **Renkler:** `tailwind.config.js` dosyasındaki renk paletini değiştirin
2. **Fontlar:** `app/globals.css` dosyasında font ailelerini güncelleyin
3. **Animasyonlar:** Her component'teki Framer Motion animasyonlarını özelleştirin

### Medya Dosyaları

1. **Görseller:** `public/images/` klasörüne fotoğrafları ekleyin
2. **Ses:** `public/audio/` klasörüne müzik dosyalarını ekleyin
3. **Video:** `public/video/` klasörüne video dosyalarını ekleyin

## 📱 Responsive Tasarım

- **Mobile First** yaklaşımı
- **Tablet** ve **Desktop** optimizasyonu
- **Touch** ve **Mouse** etkileşimleri
- **Accessibility** standartları

## 🎵 Ses ve Müzik

- **Opsiyonel ses** kontrolü
- **Background müzik** desteği
- **Sesli okuma** özelliği (Letter Section)
- **Konfeti sesleri** ve efektler

## 🚀 Deployment

### Vercel (Önerilen)

1. **Vercel hesabı oluştur:** [vercel.com](https://vercel.com)
2. **GitHub'a push et:** Projeyi GitHub repository'sine yükle
3. **Vercel'e bağla:** GitHub repository'sini Vercel'e import et
4. **Otomatik deploy:** Her push'ta otomatik güncelleme

### Diğer Platformlar

- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

## 🎨 Tema Özelleştirme

### Renk Paletleri

```javascript
// Pink-Purple (Varsayılan)
primary: '#d946ef'
secondary: '#0ea5e9'

// Blue-Green
primary: '#0ea5e9'
secondary: '#10b981'

// Sunset
primary: '#f59e0b'
secondary: '#ef4444'
```

### Animasyon Hızları

```javascript
// Hızlı animasyonlar
duration: 0.3

// Normal animasyonlar  
duration: 0.6

// Yavaş animasyonlar
duration: 1.2
```

## 🔧 Geliştirme

### Scripts

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run start    # Production sunucusu
npm run lint     # Code linting
```

### Klasör Yapısı

```
├── app/                 # Next.js App Router
├── components/          # React Components
├── public/             # Static dosyalar
├── styles/             # CSS dosyaları
└── README.md           # Bu dosya
```

## 💡 İpuçları

1. **Performans:** Görselleri optimize edin (WebP formatı önerilir)
2. **SEO:** `app/layout.tsx` dosyasında meta tag'leri güncelleyin
3. **Analytics:** Google Analytics ekleyin
4. **Backup:** Düzenli olarak yedek alın

## 🎁 Ek Özellikler

- **Parola koruması** eklenebilir
- **Çoklu dil** desteği
- **Sosyal medya** paylaşımı
- **Email** bildirimleri
- **SMS** entegrasyonu

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. **GitHub Issues** açın
2. **Documentation** kontrol edin
3. **Community** forumlarını kullanın

---

**🎉 İyi ki doğdun! Bu sürpriz websitesi ile sevdiklerinizi mutlu edin! 🎉**


