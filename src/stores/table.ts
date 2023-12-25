import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Card } from '@/entities/card'
import { generateShortId, shuffleArrayInPlace } from '@/utils'
import type { TableDeck, TableSession } from '@/entities/table'
import { useDeckStore } from './decks'
import { useCardStore } from './cards'
import type { Deck } from '@/entities/deck'

export const useTableStore = defineStore('table', () => {
  const decksStore = useDeckStore()
  const decks = decksStore.decks

  const session = ref<TableSession | null>(null)

  const persist = () => {
    window.localStorage.setItem('decksim_table', JSON.stringify(session.value))
  }

  const load = () => {
    const persisted = window.localStorage.getItem('decksim_table')
    if (persisted) {
      session.value = JSON.parse(persisted)
    }
  }

  const findCard = computed(() => (id: string): Card => {
    const cardsStore = useCardStore()
    const allCards = cardsStore.cards
    const card = allCards.find((c) => c.id === id)
    if (!card) {
      throw new Error(`Card with id ${id} not found`)
    }
    return card
  })

  const fillDeck = computed(() => (deck: Deck): TableDeck => {
    const cards: Card[] = []
    for (const deckItem of deck.cards) {
      const foundCard = findCard.value(deckItem.cardId)

      if (foundCard) {
        for (let i = 0; i < deckItem.quantity; i++) {
          cards.push(foundCard)
        }
      }
    }
    shuffleArrayInPlace(cards)

    return {
      availableCards: cards,
      currentCard: null,
      discardedCards: [],
      title: deck.title
    }
  })

  const startNewSession = (deckIds: string[], mixAll: boolean, persistent: boolean) => {
    const newSession: TableSession = {
      decks: [],
      log: [],
      persistent,
      startedAt: new Date()
    }

    const tableDecks: TableDeck[] = []

    for (const deckId of deckIds) {
      const deck = decksStore.decks.find((d) => d.id === deckId)
      if (deck) {
        tableDecks.push(fillDeck.value(deck))
      }
    }

    if (mixAll) {
      newSession.decks = [
        {
          title: 'Mixed',
          availableCards: tableDecks.map((d) => d.availableCards).flat(),
          currentCard: null,
          discardedCards: []
        }
      ]

      shuffleArrayInPlace(newSession.decks[0].availableCards)
    } else {
      newSession.decks = tableDecks
    }

    session.value = newSession

    if (persistent) {
      persist()
    } else {
      clearPersistent()
    }
  }

  const clearPersistent = () => {
    window.localStorage.removeItem('decksim_table')
  }

  const isInSession = computed(() => {
    return !!session.value
  })

  const drawNextCard = (deckIndex: number) => {
    const deck = session.value?.decks[deckIndex]
    if (!deck) {
      return
    }

    const nextCard = deck.availableCards.shift()
    if (nextCard) {
      if (deck.currentCard) {
        deck.discardedCards.push(deck.currentCard)
      }
      deck.currentCard = nextCard
      session.value?.log.push({
        deckIndex,
        cardTaken: nextCard.title,
        timestamp: new Date()
      })
    }

    const newSession: TableSession = {
      ...session.value!
    }

    newSession.decks[deckIndex] = deck

    session.value = newSession

    if (session.value.persistent) {
      persist()
    }
  }

  const terminateSession = () => {
    session.value = null
    clearPersistent()
  }

  return {
    load,
    startNewSession,
    isInSession,
    session,
    terminateSession,
    drawNextCard
  }
})
