import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '@/views/LibraryView.vue'
import ReadView from '@/views/ReadView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'library', component: LibraryView },
    { path: '/read/:showSlug/:episodeSlug', name: 'read', component: ReadView },
  ],
})

export default router
