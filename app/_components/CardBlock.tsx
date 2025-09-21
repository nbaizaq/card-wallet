'use client'

import { type Card as CardType } from "./types"
import CardBlockItem from "./CardBlockItem"

export default function CardBlock({ card, onEdit, onDelete }: { card: CardType, onEdit: (card: CardType) => void, onDelete: (card: CardType) => void }) {

  return (
    <CardBlockItem card={card.content} onEdit={() => onEdit(card)} onDelete={() => onDelete(card)} />
  )
}