export const STARTING_CHIPS = 1000

export const createDeck = () => {
  const suits = ['H', 'D', 'C', 'S']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const deck = []
  for (const s of suits) {
    for (const v of values) deck.push(`${v}${s}`)
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

/** Convert internal card format (10H) to pokertools format (Th) */
export const toEvaluatorCard = (card) => {
  const suit = card.slice(-1).toLowerCase()
  let value = card.slice(0, -1)
  if (value === '10') value = 'T'
  return `${value}${suit}`
}

export const formatCardForDisplay = (card) => {
  if (!card || card === 'hidden') return card
  const suit = card.slice(-1)
  const val = card.slice(0, -1)
  const suitChar = suit === 'H' ? '♥' : suit === 'D' ? '♦' : suit === 'C' ? '♣' : '♠'
  return { val, suit, suitChar, isRed: suit === 'H' || suit === 'D' }
}
