export interface DeckCardItem {
  cardId: string
  quantity: number
}

export interface Deck {
  id?: string
  title: string
  cards: DeckCardItem[]
}
