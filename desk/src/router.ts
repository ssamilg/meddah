import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@desk/views/HomeView.vue'
import NewShowView from '@desk/views/NewShowView.vue'
import ShowReviewView from '@desk/views/ShowReviewView.vue'
import ShowView from '@desk/views/ShowView.vue'
import EpisodeView from '@desk/views/EpisodeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/new', name: 'new', component: NewShowView },
    { path: '/shows/:slug/review', name: 'review', component: ShowReviewView },
    { path: '/shows/:slug', name: 'show', component: ShowView },
    { path: '/shows/:slug/episodes/:episodeSlug', name: 'episode', component: EpisodeView },
  ],
})

export default router
