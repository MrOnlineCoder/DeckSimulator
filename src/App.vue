<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useCardStore } from './stores/cards'
import { onMounted } from 'vue'
import { useDeckStore } from './stores/decks'
import { useTableStore } from './stores/table'

const cardsStore = useCardStore()
const decksStore = useDeckStore()
const tableStore = useTableStore()

const router = useRouter()

const drawerShown = ref(false)

const links = [
  {
    title: 'Home',
    value: 'home'
  },
  {
    title: 'Cards Editor',
    value: 'cards'
  },
  {
    title: 'Decks Editor',
    value: 'decks'
  },
  {
    title: 'Table',
    value: 'table'
  }
]

const changePage = ({ id }: { id: unknown; value: boolean; path: unknown[] }) => {
  router.push({
    name: id as string
  })
}

onMounted(() => {
  cardsStore.load()
  decksStore.load()
  tableStore.load()
})
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawerShown = !drawerShown"></v-app-bar-nav-icon>
      <v-app-bar-title> Deck Simulator </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawerShown" location="left" temporary>
      <v-list @click:select="changePage" :items="links"></v-list>
    </v-navigation-drawer>
    <v-main>
      <div class="main-container">
        <RouterView />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-container {
  padding: 16px;
}
</style>
