'use client'

import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"
import { type CardContent as CardContentType } from "./types"
import { toast } from "sonner"

export default function CardBlock({ card, onEdit, onDelete }: { card: CardContentType & { color?: string }, onEdit: () => void, onDelete: () => void }) {
  const onCopyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className={`select-none rounded-lg ${card.color} ${!card.color ? 'border-1 border-gray-200' : ''} p-4 space-y-2`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="font-light">{card.name}</div>
          <span>·</span>
          <span className="font-bold">{card.currency}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit()}>
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onDelete()}>
            <TrashIcon />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <button className="cursor-pointer block" onClick={() => onCopyValue(card.holder)}>
          {card.holder}
        </button>

        <button className="text-xl font-mono cursor-pointer block" onClick={() => onCopyValue(card.number)}>
          {card.number}
        </button>

        <div className="flex gap-2 justify-between items-center text-gray-700">
          <div>
            <div className="text-xs">
              CVV
            </div>
            <button className="font-mono cursor-pointer transition-all duration-100" onClick={() => onCopyValue(card.cvv)}>
              {card.cvv}
            </button>
          </div>
          <div>
            <div className="text-xs">
              Valid thru
            </div>
            <button className="font-mono cursor-pointer" onClick={() => onCopyValue(card.expire)}>
              {card.expire}
            </button>
          </div>
          <div>
            <div className="text-xs">
              PIN
            </div>
            <button className="font-mono cursor-pointer" onClick={() => onCopyValue(card.pin)}>
              {card.pin}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}