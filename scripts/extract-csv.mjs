import fs from 'fs'
import path from 'path'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const csvPath = path.join(projectRoot, 'NAZ DG - Form Yanıtları 1.csv')
const outPath = path.join(projectRoot, 'public', 'content.json')

function parseCSV(content) {
  // Use proper CSV parsing that handles multi-line quoted fields
  const lines = []
  let currentLine = ''
  let inQuotes = false
  let inField = false
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
      currentLine += char
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine)
      currentLine = ''
    } else {
      currentLine += char
    }
  }
  if (currentLine) lines.push(currentLine)
  
  const headers = lines[0].split(',')
  
  const data = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    
    const fields = []
    let currentField = ''
    inQuotes = false
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j]
      
      if (char === '"') {
        if (inQuotes && lines[i][j + 1] === '"') {
          // Escaped quote
          currentField += '"'
          j++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim())
        currentField = ''
      } else {
        currentField += char
      }
    }
    fields.push(currentField.trim())
    
    const row = {}
    headers.forEach((header, idx) => {
      row[header] = fields[idx] || ''
    })
    data.push(row)
  }
  
  return data
}

function indexPublicImages() {
  const imagesDir = path.join(projectRoot, 'public', 'images')
  const map = new Map()
  if (!fs.existsSync(imagesDir)) return map
  
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    const base = file.split('.')[0]
    const parts = base.split(' - ')
    const authorGuess = parts.length >= 2 ? parts.slice(1).join(' - ') : ''
    const key = authorGuess.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
    const url = `/images/${file}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(url)
  }
  return map
}

function main() {
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(csvContent)
  const imageIndex = indexPublicImages()
  
  console.log('Parsed', rows.length, 'rows')
  console.log('Headers:', Object.keys(rows[0]))
  if (rows.length > 0) {
    const fieldName = 'Anıyı temsil eden 1 kelime (kısa; ör: "Gün batımı")'
    console.log('First row memoryKeyword field:', rows[0][fieldName])
    console.log('First row all values:', Object.values(rows[0]))
    console.log('First row fields 9:', Object.values(rows[0])[9])
  }
  
  const result = { balloons: [], memories: [], letterText: '' }
  
  const colors = [
    'from-pink-400 to-pink-600',
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-cyan-400 to-cyan-600',
    'from-green-400 to-green-600',
    'from-red-400 to-red-600',
    'from-rose-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600'
  ]
  
  rows.forEach((row, idx) => {
    const authorName = row['Ad Soyad'] || 'Anonim'
    let authorDisplay = row['Adım nasıl gözüksün?'] || authorName
    // Clean up author display - if user selected generic option, use actual name
    if (authorDisplay.match(/^(Sadece adım|Tam Ad|Anonim)/)) {
      authorDisplay = authorName
    }
    
    // Balloon (message)
    const message = row['Doğum günü mesajın nedi?']
    if (message) {
      result.balloons.push({
        id: result.balloons.length + 1,
        message: message,
        author: authorDisplay,
        color: colors[idx % colors.length],
        emoji: '💕'
      })
    }
    
    // Memory
    const memory = row['Birlikte hatırladığın en komik en tatlı anın? (Nerde? Nasıl? Kimlerle oldu?)']
    if (memory) {
      const memoryKeyword = row['Anıyı temsil eden 1 kelime (kısa; ör: "Gün batımı")']
      if (idx < 3) console.log('Memory keyword for row', idx, ':', memoryKeyword)
      
      const imageKey = authorName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
      const urls = imageIndex.get(imageKey)
      let media = undefined
      if (urls && urls.length > 0) {
        const url = urls.find(u => /\.(mp4|mov)$/i.test(u)) || urls[0]
        media = {
          type: /\.(mp4|mov)$/i.test(url) ? 'video' : 'image',
          url: url
        }
      }
      
      result.memories.push({
        id: result.memories.length + 1,
        memory: memory,
        memoryKeyword: memoryKeyword || undefined,
        author: authorDisplay,
        color: colors[idx % colors.length],
        emoji: '💖',
        media: media
      })
    }
  })
  
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8')
  console.log('İçerik çıkarıldı ->', outPath)
  console.log('Balloons:', result.balloons.length)
  console.log('Memories:', result.memories.length)
}

main()

