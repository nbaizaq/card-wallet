'use client'

import { JSX } from "react";
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon, CopyIcon } from "lucide-react"
import { type CardContent as CardContentType } from "./types"

function CardField({ label, value }: { label: string, value: string }): JSX.Element {
  const onCopyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="space-y-1">
      <div className="card-field">{label}</div>
      <div className="flex gap-2">
        <div className="card-field-value select-none flex-grow">{value}</div>
        <button className="p-2 rounded-md" onClick={() => onCopyValue(value)}>
          <CopyIcon size={16} />
        </button>
      </div>
    </div>
  )
}

export default function CardBlock({ card, onEdit, onDelete }: { card: CardContentType, onEdit: () => void, onDelete: () => void }) {
  const cardFields = [
    {
      label: "Holder",
      value: card.holder,
    },
    {
      label: "Number",
      value: card.number,
    },
    {
      label: "CCV",
      value: card.cvv,
    },
    {
      label: "Expire",
      value: card.expire,
    },
    {
      label: "PIN",
      value: card.pin,
    },
  ]

  return (
    <Card className="gap-2 py-4">
      <div className="flex justify-between gap-2 items-center px-4">
        <CardTitle>{card.name} <Badge variant="outline">{card.currency}</Badge></CardTitle>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" className="size-8" onClick={() => onEdit()}>
            <PencilIcon />
          </Button>
          <Button variant="destructive" size="icon" className="size-8" onClick={() => onDelete()}>
            <TrashIcon />
          </Button>
        </div>
      </div>
      <Separator />
      <CardContent className="px-4">
        <div className="space-y-4">
          {cardFields.map(field => (
            <CardField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </CardContent>
    </Card >
  )
}