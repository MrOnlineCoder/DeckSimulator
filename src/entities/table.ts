import type { Card } from './card'

export interface TableDeck {
  availableCards: Card[]
  currentCard: Card | null
  discardedCards: Card[]
  title: string
}

export interface TableLog {
  deckIndex: number
  cardTaken: string
  timestamp: Date
}

export interface TableSession {
  decks: TableDeck[]
  log: TableLog[]
  persistent: boolean
  startedAt: Date
}
