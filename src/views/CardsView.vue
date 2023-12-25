<template>
  <h1>Cards</h1>
  <div class="search-container">
    <v-text-field
      prepend-inner-icon="mdi-note-search"
      label="Search cards"
      v-model="search"
    ></v-text-field>
    <v-btn
      prepend-icon="mdi-card-plus"
      size="x-large"
      color="#009688"
      @click="cardDialogShown = true"
    >
      Add card
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
            <!-- <v-btn color="#FFC107" size="small" icon="mdi-pencil"></v-btn> -->
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
        <v-toolbar-title>New card</v-toolbar-title>
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

    <v-snackbar :timeout="2000" v-model="errorSnackbarShown">
      {{ errorSnackbarMessage }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCardStore } from '@/stores/cards'
import { computed } from 'vue'

const search = ref('')
const cardTitle = ref('')
const cardDescription = ref('')

const errorSnackbarShown = ref(false)
const errorSnackbarMessage = ref('')

const cardDialogShown = ref(false)

const cardsStore = useCardStore()

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
    errorSnackbarMessage.value = 'Card title is required'
    errorSnackbarShown.value = true
    return
  }

  await cardsStore.addCard({
    title: cardTitle.value,
    description: cardDescription.value
  })
  cardDialogShown.value = false
  cardTitle.value = ''
  cardDescription.value = ''
}

const removeCard = async (id: string) => {
  await cardsStore.removeCard(id)
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
