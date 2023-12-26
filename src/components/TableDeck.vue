<template>
  <div class="table-deck">
    <div class="table-deck-row">
      <div class="table-deck-info">
        <h3>Deck "{{ deck.title }}"</h3>
        <v-divider></v-divider>
        <!-- <ul>
          <li><v-icon>mdi-cards</v-icon> Cards left: {{ deck.availableCards.length }}</li>
          <li>
            <v-icon>mdi-card-remove</v-icon> Cards discarded: {{ deck.discardedCards.length }}
          </li>
        </ul> -->
        <v-btn
          color="#B3E5FC"
          size="large"
          @click="drawNextCard"
          prepend-icon="mdi-page-next"
          :disabled="!deck.availableCards.length"
        >
          Draw card
        </v-btn>
      </div>
      <div class="deck-cards-column">
        <h3>
          <v-icon>mdi-cards</v-icon>
          <v-badge :content="deck.availableCards.length" floating> Available cards </v-badge>
        </h3>

        <v-divider></v-divider>
        <GameCard
          :index="deck.currentCard ? deck.discardedCards.length + 2 : 1"
          :card="deck.availableCards[0]"
          covered
          v-if="deck.availableCards.length"
        />
      </div>
      <div class="deck-cards-column">
        <h3><v-icon>mdi-card</v-icon> Current card</h3>
        <v-divider></v-divider>
        <Transition name="fade-slide" mode="out-in">
          <GameCard
            :card="deck.currentCard"
            v-if="deck.currentCard"
            :key="deck.currentCard.title + deck.availableCards.length"
          />
          <div class="placeholder-card" v-else></div>
        </Transition>
      </div>
      <div class="deck-cards-column">
        <h3>
          <v-icon>mdi-card-remove</v-icon>
          <v-badge :content="deck.discardedCards.length" floating> Discarded cards </v-badge>
        </h3>
        <v-divider></v-divider>
        <GameCard
          :index="deck.discardedCards.length"
          :card="deck.discardedCards[deck.discardedCards.length - 1]"
          :covered="!tableSession!.topDiscardShown"
          @click="discardPileShown = true"
          v-if="deck.discardedCards.length"
        />
        <div class="placeholder-card" v-else></div>
      </div>
    </div>

    <v-bottom-sheet v-model="discardPileShown">
      <v-card title="Discard pile (from newest to oldest)">
        <div class="history-area">
          <div class="discard-item" v-for="(card, index) in discardPileList">
            <GameCard :card="card"></GameCard>
            <h4>№ {{ deck.discardedCards.length - index }}</h4>
          </div>
        </div>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import type { TableDeck } from '@/entities/table'

import GameCard from '@/components/GameCard.vue'
import { useTableStore } from '@/stores/table'
import { ref } from 'vue'
import { computed } from 'vue'

const tableStore = useTableStore()

const tableSession = computed(() => tableStore.session)

const discardPileShown = ref(false)

const props = defineProps<{
  deck: TableDeck
  deckIndex: number
}>()

const drawNextCard = async () => {
  await tableStore.drawNextCard(props.deckIndex)
}

const discardPileList = computed(() => {
  return props.deck.discardedCards.slice().reverse()
})
</script>
<style scoped>
.table-deck {
  display: flex;
  flex-direction: column;

  margin-top: 16px;
}

.table-deck-row {
  display: flex;
  flex-direction: row;
  column-gap: 8px;
}

.table-deck-info {
  width: 200px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.deck-cards-column {
  width: 33%;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.placeholder-card {
  width: 256px;
  height: calc(256px * 1.33);
  border: 2px dashed #607d8b;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
}

.fade-slide-enter-active {
  transition: all 0.5s ease;
  transform: translateX(-100%);
  opacity: 0;
}

.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  transform: translateX(100%);
  opacity: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.history-area {
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: scroll;
}

.discard-item {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
</style>
