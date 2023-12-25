import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Card } from '@/entities/card'
import { generateShortId } from '@/utils'
import type { Deck } from '@/entities/deck'

export const useDeckStore = defineStore('decks', () => {
  const decks = ref<Deck[]>([])

  const persist = () => {
    window.localStorage.setItem('decksim_decks', JSON.stringify(decks.value))
  }

  const load = () => {
    const persisted = window.localStorage.getItem('decksim_decks')
    if (persisted) {
      decks.value = JSON.parse(persisted)
    }
  }

  const addDeck = async (deck: Deck) => {
    decks.value.push({
      ...deck,
      id: generateShortId()
    })
    persist()
  }

  const updateDeck = async (deck: Deck) => {
    decks.value = decks.value.map((d) => {
      if (d.id === deck.id) {
        return deck
      }
      return d
    })
    persist()
  }

  const onCardRemoved = (cardId: string) => {
    for (const deck of decks.value) {
      deck.cards = deck.cards.filter((deckCard) => deckCard.cardId !== cardId)
    }
  }

  const removeDeck = async (id: string) => {
    decks.value = decks.value.filter((deck) => deck.id !== id)
    persist()
  }

  return {
    decks,
    addDeck,
    load,
    removeDeck,
    updateDeck,
    onCardRemoved
  }
})
