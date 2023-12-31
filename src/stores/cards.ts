import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Card } from '@/entities/card'
import { generateShortId } from '@/utils'

export const useCardStore = defineStore('cards', () => {
  const cards = ref<Card[]>([])

  const persist = () => {
    window.localStorage.setItem('decksim_cards', JSON.stringify(cards.value))
  }

  const load = () => {
    const persisted = window.localStorage.getItem('decksim_cards')
    if (persisted) {
      cards.value = JSON.parse(persisted)
    }
  }

  const addCard = async (card: Card) => {
    cards.value.push({
      ...card,
      id: generateShortId()
    })
    persist()
  }

  const removeCard = async (id: string) => {
    cards.value = cards.value.filter((card) => card.id !== id)
    persist()
  }

  const updateCard = async (card: Card) => {
    cards.value = cards.value.map((c) => {
      if (c.id === card.id) {
        return card
      }
      return c
    })
    persist()
  }

  const reset = () => {
    cards.value = []
    persist()
  }

  const importCards = (data: Card[]) => {
    cards.value = data
    persist()
  }

  return {
    cards,
    addCard,
    load,
    removeCard,
    updateCard,
    importCards,
    reset
  }
})
