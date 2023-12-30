<template>
  <div class="d-flex justify-space-between">
    <h1>Decks</h1>
    <div class="d-flex top-deck-actions">
      <v-btn prepend-icon="mdi-card-plus" size="large" color="#009688" @click="showAddUI">
        Add deck
      </v-btn>
      <v-btn prepend-icon="mdi-file-export" size="large" color="#673AB7" @click="exportDecks">
        Export
      </v-btn>
    </div>
  </div>

  <br />
  <v-table v-if="decksList.length">
    <thead>
      <tr>
        <th>Deck ID</th>
        <th>Deck Title</th>
        <th>Deck Cards</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="deck in decksList">
        <td>{{ deck.id }}</td>
        <td>{{ deck.title }}</td>
        <td>{{ deck.cards.reduce((acc, entry) => acc + entry.quantity, 0) }} cards</td>
        <td>
          <v-btn-group>
            <v-btn color="#FFC107" size="small" icon="mdi-pencil" @click="showEditUI(deck)"></v-btn>
            <v-btn color="#F44336" size="small">
              <v-icon>mdi-delete</v-icon>
              <v-menu activator="parent">
                <v-btn size="large" color="#F44336" @click="removeDeck(deck.id!)">
                  <v-icon> mdi-delete-alert </v-icon> Confirm deletion of "{{ deck.title }}"</v-btn
                >
              </v-menu>
            </v-btn>
          </v-btn-group>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog
    v-model="deckDialogShown"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card class="deck-dialog-card">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="deckDialogShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Deck management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" @click="saveDeck"> Save </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form class="add-form">
        <v-text-field
          label="Deck title"
          placeholder="Base Wizard Deck"
          v-model="deckTitle"
        ></v-text-field>

        <hr />

        <v-text-field
          label="Search for cards"
          prepend-inner-icon="mdi-note-search"
          placeholder="Fireball"
          v-model="cardsSearch"
          size="small"
        ></v-text-field>

        <h4>
          Total cards selected: {{ deckCards.length }} types,
          {{ deckCards.reduce((acc, entry) => acc + entry.quantity, 0) }} cards
        </h4>
        <br />

        <v-table>
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Card Title</th>
              <th>Card Description</th>
              <th>Card Selected</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in cardsList">
              <td>{{ card.id }}</td>
              <td>{{ card.title }}</td>
              <td>{{ card.description }}</td>
              <td>
                <div class="card-selector">
                  <v-checkbox
                    :modelValue="isCardSelected(card.id!)"
                    @update:modelValue="(v) => toggleCard(card.id!, v as boolean)"
                  ></v-checkbox>
                  <v-text-field
                    type="number"
                    label="Quantity"
                    :model-value="getSelectedCardQuantity(card.id!)"
                    @update:model-value="(v) => setSelectedCardQuantity(card.id!, +v)"
                    v-if="isCardSelected(card.id!)"
                  >
                  </v-text-field>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-form>
    </v-card>

    <v-snackbar :timeout="2000" v-model="errorSnackbarShown">
      {{ errorSnackbarMessage }}
    </v-snackbar>
  </v-dialog>
</template>

<style scoped>
.card-selector {
  display: flex;
  column-gap: 8px;
}

.top-deck-actions {
  column-gap: 8px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { Deck, DeckCardItem } from '@/entities/deck'
import { useDeckStore } from '@/stores/decks'
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'
import { downloadJsonAsFile } from '@/utils'

const decksStore = useDeckStore()
const cardsStore = useCardStore()

const decksList = computed(() => decksStore.decks)

const deckDialogShown = ref(false)
const deckTitle = ref('')
const deckCards = ref<DeckCardItem[]>([])
const cardsSearch = ref('')
const deckId = ref('')

const errorSnackbarShown = ref(false)
const errorSnackbarMessage = ref('')

const saveDeck = async () => {
  if (!deckTitle.value) {
    errorSnackbarMessage.value = 'Deck title is required'
    errorSnackbarShown.value = true
    return
  }

  if (!deckCards.value.length) {
    errorSnackbarMessage.value = 'Deck must have at least one card'
    errorSnackbarShown.value = true
    return
  }

  if (deckId.value) {
    await decksStore.updateDeck({
      id: deckId.value,
      title: deckTitle.value,
      cards: deckCards.value
    })
  } else {
    await decksStore.addDeck({
      title: deckTitle.value,
      cards: deckCards.value
    })
  }

  deckDialogShown.value = false
  deckTitle.value = ''
  deckCards.value = []
}

const cardsList = computed(() => {
  if (!cardsSearch.value) {
    return cardsStore.cards
  }

  return cardsStore.cards.filter((card) => {
    return card.title.toLowerCase().includes(cardsSearch.value.toLowerCase())
  })
})

const isCardSelected = computed(() => {
  return (cardId: string) => {
    return deckCards.value?.some((entry) => entry.cardId === cardId)
  }
})

const getSelectedCardQuantity = computed(() => {
  return (cardId: string) => {
    const entry = deckCards.value?.find((entry) => entry.cardId === cardId)
    return entry?.quantity ?? 1
  }
})

const setSelectedCardQuantity = (cardId: string, quantity: number) => {
  const newQuantity = Math.max(1, quantity)
  deckCards.value = deckCards.value?.map((entry) => {
    if (entry.cardId === cardId) {
      return {
        ...entry,
        quantity: newQuantity
      }
    }

    return entry
  })
}

const toggleCard = (cardId: string, oldValue: boolean) => {
  console.log(`Toggling card ${cardId} from ${oldValue}`)
  const newValue = !oldValue
  if (newValue) {
    deckCards.value = deckCards.value?.filter((entry) => entry.cardId !== cardId)
  } else {
    deckCards.value = [
      ...(deckCards.value ?? []),
      {
        cardId,
        quantity: 1
      }
    ]
  }

  return true
}

const removeDeck = async (id: string) => {
  await decksStore.removeDeck(id)
}

const showAddUI = () => {
  deckDialogShown.value = true
  deckTitle.value = ''
  deckCards.value = []
  deckId.value = ''
}

const showEditUI = (deck: Deck) => {
  deckDialogShown.value = true
  deckTitle.value = deck.title
  deckCards.value = deck.cards
  deckId.value = deck.id!
}

const exportDecks = () => {
  downloadJsonAsFile(decksList.value, 'decks.json')
}
</script>
