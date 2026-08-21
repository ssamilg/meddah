import { createRouter, createWebHistory } from 'vue-router'
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
    { path: '/read/:showSlug/:episodeSlug', name: 'read', component: ReadView },
  ],
})

export default router
