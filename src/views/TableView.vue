<template>
  <div class="d-flex justify-space-between">
    <h1>Table</h1>
    <v-btn
      color="#EF9A9A"
      v-if="isInTableSession"
      prepend-icon="mdi-fire"
      @click="terminateSession"
    >
      Terminate table
    </v-btn>
  </div>

  <v-form class="config-form" v-if="!isInTableSession">
    <h3>Configure your table session</h3>
    <v-divider></v-divider>
    <br />
    <label> Select decks that will be a part of the game: </label>
    <v-checkbox
      :label="deck.title"
      v-model="selectedDecks"
      :value="deck.id!"
      v-for="deck in decksList"
    >
    </v-checkbox>
    <br />
    <label>Choose settings:</label>
    <v-checkbox
      v-model="persistSetting"
      label="Autosave table progress (will not work with multiple tabs)"
    ></v-checkbox>
    <v-checkbox
      v-model="mixAllDecksIntoOneSetting"
      label="Mix all decks into one big deck"
    ></v-checkbox>
    <v-btn
      prepend-icon="mdi-play-box-multiple"
      size="large"
      color="#009688"
      @click="start"
      :disabled="!selectedDecks.length"
    >
      Play
    </v-btn>
  </v-form>
  <div v-else>
    <small>In-progress since {{ startedAtFormatted }}</small>
    <v-divider></v-divider>
    <TableDeck :deckIndex="idx" :deck="deck" v-for="(deck, idx) in tableSession!.decks">
    </TableDeck>
  </div>
</template>

<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import TableDeck from '@/components/TableDeck.vue'
import { useDeckStore } from '@/stores/decks'
import { useTableStore } from '@/stores/table'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { computed } from 'vue'

const decksStore = useDeckStore()
const tableStore = useTableStore()

const decksList = computed(() => decksStore.decks)
const persistSetting = ref(true)
const mixAllDecksIntoOneSetting = ref(false)

const selectedDecks = ref<string[]>([])

const tableSession = computed(() => tableStore.session)

const startedAtFormatted = computed(() => {
  if (!tableSession.value) {
    return ''
  }

  return new Date(tableSession.value.startedAt).toLocaleString()
})

const start = async () => {
  await tableStore.startNewSession(
    selectedDecks.value,
    mixAllDecksIntoOneSetting.value,
    persistSetting.value
  )
}

const terminateSession = async () => {
  await tableStore.terminateSession()
}

const isInTableSession = computed(() => tableStore.isInSession)
</script>

<style scoped>
.config-form {
  /* padding: 0 16px; */
}
</style>
