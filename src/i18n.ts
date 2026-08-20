import type { Locale } from '@/types/piece'
import type { Theme } from '@/theme'

interface Copy {
  scene: string
  prev: string
  next: string
  imagesOn: string
  imagesOff: string
  language: string
  themeToDark: string
  themeToLight: string
  synthetic: string
  empty: string
}

const copy: Record<Locale, Copy> = {
  tr: {
    scene: 'Sahne',
    prev: 'Önceki',
    next: 'Sonraki',
    imagesOn: 'Görseller açık',
    imagesOff: 'Görseller kapalı',
    language: 'EN',
    themeToDark: 'Koyu tema',
    themeToLight: 'Açık tema',
    synthetic: 'Sentetik demo',
    empty: 'Sahne yok. content/piece.json dosyasını doldur.',
  },
  en: {
    scene: 'Scene',
    prev: 'Previous',
    next: 'Next',
    imagesOn: 'Images on',
    imagesOff: 'Images off',
    language: 'TR',
    themeToDark: 'Dark theme',
    themeToLight: 'Light theme',
    synthetic: 'Synthetic demo',
    empty: 'No scenes. Fill content/piece.json.',
  },
}

export function uiCopy(locale: Locale): Copy {
  return copy[locale]
}

export function themeLabel(locale: Locale, theme: Theme): string {
  const pack = copy[locale]
  const label = theme === 'dark' ? pack.themeToLight : pack.themeToDark
  return label
}
