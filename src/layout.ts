export const MOBILE_MAX_WIDTH = 767
export const HD_MIN_HEIGHT = 1080

export const mobileQuery = `(max-width: ${MOBILE_MAX_WIDTH}px)`
export const tallQuery = `(min-height: ${HD_MIN_HEIGHT}px)`

export type StageLayout = 'mobile' | 'spread' | 'stack'
