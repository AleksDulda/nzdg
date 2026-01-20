#!/usr/bin/env python3
import csv
import json
import os

project_root = os.path.dirname(os.path.dirname(__file__))
csv_path = os.path.join(project_root, 'NAZ DG - Form Yanıtları 1.csv')
out_path = os.path.join(project_root, 'public', 'content.json')
images_dir = os.path.join(project_root, 'public', 'images')

def normalize_name(name):
    """Normalize Turkish characters and spaces for matching"""
    import unicodedata
    
    # First convert to lowercase
    name_lower = name.lower()
    
    # Turkish character replacements
    replacements = {
        'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c', 'ı': 'i', 'İ': 'i'
    }
    for tr_char, en_char in replacements.items():
        name_lower = name_lower.replace(tr_char, en_char)
    
    # Normalize to NFD (decompose) then remove combining marks
    normalized = unicodedata.normalize('NFD', name_lower)
    # Remove combining marks (diacritics)
    normalized = ''.join(c for c in normalized if unicodedata.category(c) != 'Mn')
    
    # Remove spaces and special chars
    normalized = normalized.replace(' ', '').replace('-', '').replace('_', '').replace('.', '')
    
    return normalized

# Index images  
image_index = {}
if os.path.exists(images_dir):
    for file in os.listdir(images_dir):
        base = file.split('.')[0]
        
        # Try to extract author name from filename
        # Pattern 1: "something - Author Name.ext"
        if ' - ' in base:
            parts = base.split(' - ')
            author_guess = ' - '.join(parts[1:])
        else:
            # Pattern 2: "author-name.ext" or just author name
            author_guess = base.replace('_', ' ').replace('-', ' ').strip()
        
        if author_guess:
            # Index with multiple variations
            key1 = normalize_name(author_guess)
            
            # Also extract first name for easier matching
            first_name = author_guess.split()[0] if author_guess.split() else ''
            key2 = normalize_name(first_name) if first_name else ''
            
            url = f"/images/{file}"
            for key in [key1, key2]:
                if key:
                    if key not in image_index:
                        image_index[key] = []
                    image_index[key].append(url)
def get_image_for_author(author_name):
    # Try multiple matching strategies
    full_name_key = normalize_name(author_name)
    urls = image_index.get(full_name_key, [])
    
    if not urls:
        # Try with first name only
        first_name = author_name.split()[0] if author_name.split() else ''
        if first_name:
            first_name_key = normalize_name(first_name)
            urls = image_index.get(first_name_key, [])
    
    if urls:
        # Prefer video, otherwise first image
        for url in urls:
            if url.endswith('.mp4') or url.endswith('.mov'):
                return {'type': 'video', 'url': url}
        # Return first matching image
        return {'type': 'image', 'url': urls[0]}
    return None

result = {'balloons': [], 'memories': [], 'letterText': ''}

colors = [
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

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for idx, row in enumerate(reader):
        author_name = row.get('Ad Soyad', 'Anonim')
        author_display = row.get('Adım nasıl gözüksün?', author_name)
        
        # Clean up author display
        if any(author_display.startswith(x) for x in ('Sadece adım', 'Tam Ad', 'Anonim')):
            author_display = author_name
        
        # Balloon (message)
        message = row.get('Doğum günü mesajın nedi?', '').strip()
        if message:
            result['balloons'].append({
                'id': len(result['balloons']) + 1,
                'message': message,
                'author': author_display,
                'color': colors[idx % len(colors)],
                'emoji': '💕'
            })
        
        # Memory
        memory = row.get('Birlikte hatırladığın en komik en tatlı anın? (Nerde? Nasıl? Kimlerle oldu?)', '').strip()
        if memory:
            # Get all possible keyword column variations
            keyword_key = None
            for k in row.keys():
                if 'kelime' in k.lower() and 'anı' in k.lower():
                    keyword_key = k
                    break
            
            memory_keyword = ''
            if keyword_key:
                memory_keyword = row.get(keyword_key, '').strip()
            
            media = get_image_for_author(author_name)
            
            result['memories'].append({
                'id': len(result['memories']) + 1,
                'memory': memory,
                'memoryKeyword': memory_keyword if memory_keyword else None,
                'author': author_display,
                'color': colors[idx % len(colors)],
                'emoji': '💖',
                'media': media
            })

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print('İçerik çıkarıldı ->', out_path)
print('Balloons:', len(result['balloons']))
print('Memories:', len(result['memories']))

