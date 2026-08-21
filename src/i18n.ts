import type { Locale } from '@/types/library'
import type { Theme } from '@/theme'

interface Copy {
  scene: string
  episode: string
  prev: string
  next: string
  prevEpisode: string
  nextEpisode: string
  layout: string
  spread: string
  stack: string
  imagesOn: string
  imagesOff: string
  language: string
  themeToDark: string
  themeToLight: string
  synthetic: string
  empty: string
  library: string
  libraryShows: string
  emptyLibrary: string
  missingEpisode: string
  inspect: string
  close: string
  textSmaller: string
  textBigger: string
  readFont: string
  edit: string
}

const copy: Record<Locale, Copy> = {
  tr: {
    scene: 'Sahne',
    episode: 'Bölüm',
    prev: 'Önceki',
    next: 'Sonraki',
    prevEpisode: 'Önceki bölüm',
    nextEpisode: 'Sonraki bölüm',
    layout: 'Yerleşim',
    spread: 'Yan yana',
    stack: 'Üst üste',
    imagesOn: 'Görseller açık',
    imagesOff: 'Görseller kapalı',
    language: 'EN',
    themeToDark: 'Koyu tema',
    themeToLight: 'Açık tema',
    synthetic: 'Sentetik demo',
    empty: 'Bu bölümde sahne yok. source.md dosyasını parse et veya episode.json doldur.',
    library: 'Ne okuyorsun?',
    libraryShows: 'Parçalar',
    emptyLibrary: 'Henüz yayında bir parça yok.',
    missingEpisode: 'Bölüm bulunamadı.',
    inspect: 'Görseli incele',
    close: 'Kapat',
    textSmaller: 'Yazıyı küçült',
    textBigger: 'Yazıyı büyüt',
    readFont: 'Yazı tipi',
    edit: 'Düzenle',
  },
  en: {
    scene: 'Scene',
    episode: 'Episode',
    prev: 'Previous',
    next: 'Next',
    prevEpisode: 'Previous Episode',
    nextEpisode: 'Next Episode',
    layout: 'Layout',
    spread: 'Spread',
    stack: 'Stack',
    imagesOn: 'Images on',
    imagesOff: 'Images off',
    language: 'TR',
    themeToDark: 'Dark theme',
    themeToLight: 'Light theme',
    synthetic: 'Synthetic demo',
    empty: 'No scenes in this episode. Parse source.md or fill episode.json.',
    library: 'What are you reading?',
    libraryShows: 'Pieces',
    emptyLibrary: 'No published pieces yet.',
    missingEpisode: 'Episode not found.',
    inspect: 'Inspect image',
    close: 'Close',
    textSmaller: 'Decrease text size',
    textBigger: 'Increase text size',
    readFont: 'Typeface',
    edit: 'Edit',
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
