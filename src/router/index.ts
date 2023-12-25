import { createRouter, createWebHistory } from 'vue-router'

import CardsView from '@/views/CardsView.vue'
import DecksView from '@/views/DecksView.vue'
import TableView from '@/views/TableView.vue'
import HomeView from '@/views/HomeView.vue'

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
      path: '/table',
      name: 'table',
      component: TableView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})

export default router
