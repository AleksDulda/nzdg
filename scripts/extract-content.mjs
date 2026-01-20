import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const xlsxPath = path.join(projectRoot, 'NAZ DG.xlsx')
const publicDir = path.join(projectRoot, 'public')
const imagesDir = path.join(publicDir, 'images')
const outPath = path.join(publicDir, 'content.json')

function readWorkbookSafe(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Excel dosyası bulunamadı:', filePath)
    process.exit(1)
  }
  return xlsx.readFile(filePath)
}

function normalizeHeader(h) {
  return String(h || '')
    .toLowerCase()
    .replaceAll('\n', ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSheet(sheet) {
  let rows = xlsx.utils.sheet_to_json(sheet, { defval: '' })
  // Debug: log actual Excel headers
  if (rows && rows.length > 0) {
    const actualHeaders = Object.keys(rows[0])
    console.log('Excel headers:', actualHeaders)
  }
  
  // If no rows detected (possibly no headers), try headerless mode
  if (!rows || rows.length === 0) {
    const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    rows = (matrix || []).map((arr) => {
      const [c1 = '', c2 = '', c3 = '', c4 = '', c5 = ''] = arr
      return { message: c1, author: c2, memory: c3, media: c4, emoji: c5 }
    })
  }
  return rows.map((row, idx) => {
    const get = (keys, fallback = '') => {
      for (const k of keys) {
        const found = Object.keys(row).find(rk => normalizeHeader(rk) === normalizeHeader(k))
        if (found) return row[found]
      }
      return fallback
    }

    const id = Number(get(['id', 'no', 'sıra'], idx + 1)) || idx + 1

    // Heuristic selection if headers unknown
    const values = Object.values(row).map(v => String(v ?? '').trim()).filter(Boolean)
    let message = get([
      'message', 'mesaj', 'text', 'yazi',
      'Doğum günü mesajın nedi?',
      'doğum günü mesajın nedi?'
    ])
    if (!message) {
      message = values.sort((a, b) => b.length - a.length)[0] || ''
    }

    let author = get(['author', 'yazan', 'isim', 'ad', 'ad soyad', 'Ad Soyad'], '')
    if (!author) {
      author = values.find(v => /[a-zA-ZğüşöçıİĞÜŞÖÇ]+\s+[a-zA-ZğüşöçıİĞÜŞÖÇ]+/.test(v)) || ''
    }
    if (!author) author = 'Anonim'

    const color = get(['color', 'renk'], '')
    const emoji = get(['emoji, ikon', 'ikon', 'emoji'], '')

    const memory = get([
      'memory', 'anı', 'hatıra', 'anilar', 
      'birlikte hatırladığın en komik en tatlı anın', 
      'birlikte hatıraladığın en komik en tatlı anın',
      'Birlikte hatırladığın en komik en tatlı anın? (Nerde? Nasıl? Kimlerle oldu?)'
    ])
    const memoryKeyword = get([
      'memorykeyword', 'anahtar', 'kelime', 
      'anıyı temsil eden 1 kelime', 'anıyı temsil eden kelime',
      'Anıyı temsil eden 1 kelime (kısa; ör: "Gün batımı")'
    ])
    
    // Debug memoryKeyword
    if (idx < 3 && memoryKeyword) {
      console.log('Found memoryKeyword for row', idx + 1, ':', memoryKeyword)
    }

    let mediaUrl = get([
      'media', 'url', 'resim', 'foto', 'video', 'dosya',
      'Foto/Video/Audio yükle (1–5 dosya; tür: Görsel/Video/Ses; ör. max 100 MB; açıklama: "Varsa en sevdiğin kareyi ekleyebilirsin.")'
    ])
    const mediaType = get(['type', 'tip', 'mediatype'], '')

    return {
      id,
      message,
      author,
      color,
      emoji,
      memory,
      memoryKeyword,
      media: mediaUrl ? { type: mediaType || (mediaUrl.match(/\.(mp4|mov)$/i) ? 'video' : 'image'), url: mediaUrl } : undefined,
    }
  })
}

function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function indexPublicImages() {
  const map = new Map()
  if (!fs.existsSync(imagesDir)) return map
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    const base = file.split('.')[0]
    const parts = base.split(' - ')
    // Try to extract author from pattern "<prefix> - <Author>"
    const authorGuess = parts.length >= 2 ? parts.slice(1).join(' - ') : ''
    const key = normalizeName(authorGuess)
    const url = `/images/${file}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(url)
  }
  return map
}

function main() {
  const wb = readWorkbookSafe(xlsxPath)
  const sheets = wb.SheetNames
  const result = { balloons: [], memories: [], letterText: '' }
  const imageIndex = indexPublicImages()

  for (const name of sheets) {
    const sheet = wb.Sheets[name]
    const rows = extractSheet(sheet)
    
    // Debug: log first row to see what we're extracting
    if (rows.length > 0) {
      console.log('First row from sheet "' + name + '":', Object.keys(rows[0]))
      console.log('Sample data:', JSON.stringify(rows[0], null, 2))
      if (rows.length > 1) {
        console.log('Second row memory field:', rows[1].memory)
      }
      if (rows.length > 3) {
        console.log('Fourth row:', JSON.stringify(rows[3], null, 2))
      }
    }

    // Heuristic: if rows mostly have `message`, treat as balloons; if mostly `memory`, treat as memories.
    const withMessage = rows.filter(r => String(r.message || '').trim()).length
    const withMemory = rows.filter(r => String(r.memory || '').trim()).length
    console.log('Sheet "' + name + '":', withMessage, 'messages,', withMemory, 'memories')

    // Process messages for balloons
    if (withMessage > 0) {
      result.balloons.push(
        ...rows
          .filter(r => String(r.message || '').trim())
          .map(r => ({
            id: r.id,
            message: String(r.message),
            author: r.author || 'Anonim',
            color: r.color || 'from-pink-400 to-pink-600',
            emoji: r.emoji || '💕',
          }))
      )
    }
    
    // Process memories separately
    if (withMemory > 0) {
      result.memories.push(
        ...rows
          .filter(r => String(r.memory || '').trim())
          .map(r => ({
            id: result.memories.length + 1,
            memory: String(r.memory),
            memoryKeyword: r.memoryKeyword || undefined,
            author: r.author || 'Anonim',
            color: r.color || 'from-blue-400 to-blue-600',
            emoji: r.emoji || '💖',
            media: r.media,
          }))
      )
    }

    // Optional: capture a `letterText` if a single long "message" cell exists
    const longMessage = rows
      .map(r => String(r.message || ''))
      .sort((a, b) => b.length - a.length)[0]
    if (longMessage && longMessage.length > 200 && !result.letterText) {
      result.letterText = longMessage
    }
  }

  // Attach media from images folder by author name if missing
  for (const b of result.balloons) {
    const key = normalizeName(b.author)
    const urls = imageIndex.get(key)
    if (urls && urls.length > 0) {
      const url = urls.find(u => /\.(mp4|mov)$/i.test(u)) || urls[0]
      b.media = { type: /\.(mp4|mov)$/i.test(url) ? 'video' : 'image', url }
    }
  }

  for (const m of result.memories) {
    if (!m.media) {
      const key = normalizeName(m.author)
      const urls = imageIndex.get(key)
      if (urls && urls.length > 0) {
        const url = urls.find(u => /\.(mp4|mov)$/i.test(u)) || urls[0]
        m.media = { type: /\.(mp4|mov)$/i.test(url) ? 'video' : 'image', url }
      }
    }
  }

  // Write file
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8')
  console.log('İçerik çıkarıldı ->', outPath)
}

main()


