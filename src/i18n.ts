import type { Locale } from '@/types/piece'

interface Copy {
  scene: string
  prev: string
  next: string
  imagesOn: string
  imagesOff: string
  language: string
  synthetic: string
  empty: string
  shortcut: string
}

const copy: Record<Locale, Copy> = {
  tr: {
    scene: 'Sahne',
    prev: 'Önceki',
    next: 'Sonraki',
    imagesOn: 'Görseller açık',
    imagesOff: 'Görseller kapalı',
    language: 'EN',
    synthetic: 'Sentetik demo',
    empty: 'Sahne yok. content/piece.json dosyasını doldur.',
    shortcut: '← → veya J K',
  },
  en: {
    scene: 'Scene',
    prev: 'Previous',
    next: 'Next',
    imagesOn: 'Images on',
    imagesOff: 'Images off',
    language: 'TR',
    synthetic: 'Synthetic demo',
    empty: 'No scenes. Fill content/piece.json.',
    shortcut: '← → or J K',
  },
}

export function uiCopy(locale: Locale): Copy {
  return copy[locale]
}
