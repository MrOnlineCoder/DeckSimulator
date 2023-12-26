<template>
  <h1>Cards ({{ cardsList.length }})</h1>
  <div class="search-container">
    <v-text-field
      prepend-inner-icon="mdi-note-search"
      label="Search cards"
      v-model="search"
    ></v-text-field>
    <v-btn prepend-icon="mdi-card-plus" size="x-large" color="#009688" @click="showAddUI">
      Add card
    </v-btn>
    <v-btn prepend-icon="mdi-file-export" size="x-large" color="#673AB7" @click="exportCards">
      Export
    </v-btn>
    <v-btn
      prepend-icon="mdi-file-import"
      size="x-large"
      color="#FFC107"
      @click="importDialogShown = true"
    >
      Import
    </v-btn>
  </div>

  <v-table v-if="cardsList.length">
    <thead>
      <tr>
        <th>Card ID</th>
        <th>Card Title</th>
        <th>Card Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="card in cardsList">
        <td>{{ card.id }}</td>
        <td>{{ card.title }}</td>
        <td>{{ card.description }}</td>
        <td>
          <v-btn-group>
            <v-btn color="#FFC107" size="small" icon="mdi-pencil" @click="showEditUI(card)"></v-btn>
            <v-btn color="#F44336" size="small">
              <v-icon>mdi-delete</v-icon>
              <v-menu activator="parent">
                <v-btn size="large" color="#F44336" @click="removeCard(card.id!)">
                  <v-icon> mdi-delete-alert </v-icon> Confirm deletion of "{{ card.title }}"</v-btn
                >
              </v-menu>
            </v-btn>
          </v-btn-group>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog
    v-model="cardDialogShown"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="cardDialogShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ cardId ? 'Edit card' : 'Add card' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" @click="saveCard"> Save </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form class="add-form">
        <v-text-field label="Card title" placeholder="Fire Ball" v-model="cardTitle"></v-text-field>
        <v-textarea label="Card description (optional)" v-model="cardDescription"></v-textarea>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="importDialogShown" width="450">
    <v-card title="Import cards">
      <v-card-text>
        <v-file-input
          v-model="importFile"
          accept=".json"
          label="Select JSON file for import"
        ></v-file-input>
        <v-radio-group v-model="importMode">
          <v-radio label="Add imported cards to the list" value="add"></v-radio>
          <v-radio label="Replace existing cards" color="red" value="replace"></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          prepend-icon="mdi-file-import"
          size="large"
          variant="elevated"
          :disabled="!importFile"
          color="#FFC107"
          @click="importCards"
        >
          Import cards
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar :timeout="2000" v-model="errorSnackbarShown">
    {{ errorSnackbarMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'
import { useDeckStore } from '@/stores/decks'

import { downloadJsonAsFile } from '@/utils'
import type { Card } from '@/entities/card'

const search = ref('')
const cardId = ref<string | null>(null)
const cardTitle = ref('')
const cardDescription = ref('')

const errorSnackbarShown = ref(false)
const errorSnackbarMessage = ref('')

const cardDialogShown = ref(false)

const importDialogShown = ref(false)

const importFile = ref<File[]>([])
const importMode = ref('add')

const cardsStore = useCardStore()
const decksStore = useDeckStore()

const cardsList = computed(() => {
  if (!search.value) {
    return cardsStore.cards
  }

  return cardsStore.cards.filter((card) => {
    return card.title.toLowerCase().includes(search.value.toLowerCase())
  })
})

const saveCard = async () => {
  if (!cardTitle.value) {
    showErrorMessage('Card title is required')
    return
  }

  if (cardId.value) {
    await cardsStore.updateCard({
      id: cardId.value,
      description: cardDescription.value,
      title: cardTitle.value.trim()
    })
  } else {
    await cardsStore.addCard({
      title: cardTitle.value.trim(),
      description: cardDescription.value
    })
  }

  cardDialogShown.value = false
  cardTitle.value = ''
  cardDescription.value = ''
}

const removeCard = async (id: string) => {
  await cardsStore.removeCard(id)
  await decksStore.onCardRemoved(id)
}

const showEditUI = (card: Card) => {
  cardId.value = card.id!
  cardTitle.value = card.title
  cardDescription.value = card.description || ''
  cardDialogShown.value = true
}

const showAddUI = () => {
  cardId.value = null
  cardTitle.value = ''
  cardDescription.value = ''
  cardDialogShown.value = true
}

const exportCards = () => {
  downloadJsonAsFile(cardsStore.cards, 'cards.json')
}

const showErrorMessage = (msg: string) => {
  errorSnackbarShown.value = true
  errorSnackbarMessage.value = msg
}

const importCards = async () => {
  const file = importFile.value[0]

  if (!file) {
    return
  }

  const data = await file.text()

  if (!data) {
    showErrorMessage('File must not be empty')
    return
  }

  let cardsToImport: Card[] = []

  try {
    cardsToImport = JSON.parse(data)
  } catch (err: any) {
    showErrorMessage('Invalid JSON file: ' + err.message)
    return
  }

  if (!Array.isArray(cardsToImport)) {
    showErrorMessage('Invalid JSON file: must be an array')
    return
  }

  for (const card of cardsToImport) {
    if (!card.title) {
      showErrorMessage('Invalid file: every must have a title')
      return
    }

    if (!card.id) {
      showErrorMessage('Invalid file: every card must have an ID')
      return
    }
  }

  if (importMode.value === 'replace') {
    await cardsStore.reset()
  }

  await cardsStore.importCards(cardsToImport)
  importDialogShown.value = false
}
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: row;
  column-gap: 8px;
}
.add-form {
  padding: 16px;
}
</style>
