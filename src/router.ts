import { createRouter, createWebHistory } from 'vue-router'
import { hasSeenLanding, markLandingSeen } from '@/lib/landing'
import LandingView from '@/views/LandingView.vue'
import LibraryView from '@/views/LibraryView.vue'
import ReadView from '@/views/ReadView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from) {
    const stay = to.path === from.path ? false : { top: 0 }
    return stay
  },
  routes: [
    { path: '/', name: 'library', component: LibraryView },
    { path: '/landing', name: 'landing', component: LandingView },
    { path: '/read/:showSlug/:episodeSlug', name: 'read', component: ReadView },
  ],
})

router.beforeEach((to) => {
  let next: { name: 'landing'; replace: true } | undefined
  if (to.name === 'library' && !hasSeenLanding()) {
    next = { name: 'landing', replace: true }
  }
  return next
})

router.afterEach((to) => {
  if (to.name === 'landing') {
    markLandingSeen()
  }
})

export default router
