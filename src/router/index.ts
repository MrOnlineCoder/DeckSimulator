import { createRouter, createWebHistory } from 'vue-router'

import CardsView from '@/views/CardsView.vue'
import DecksView from '@/views/DecksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cards',
      name: 'cards',
      component: CardsView
    },
    {
      path: '/decks',
      name: 'decks',
      component: DecksView
    },
    {
      path: '/',
      redirect: '/cards'
    }
  ]
})

export default router
