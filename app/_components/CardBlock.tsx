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
import { PencilIcon, TrashIcon } from "lucide-react"
import { type Card as CardType } from "./types"

function CardField({ label, value }: { label: string, value: string }): JSX.Element {
  const onCopyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      <div className="card-field">{label}:</div>
      <div className="card-field-value" onClick={() => onCopyValue(value)}>{value}</div>
    </div>
  )
}

export default function CardBlock({ card }: { card: CardType }) {
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
          <Button variant="secondary" size="icon" className="size-8">
            <PencilIcon />
          </Button>
          <Button variant="destructive" size="icon" className="size-8">
            <TrashIcon />
          </Button>
        </div>
      </div>
      <Separator />
      <CardContent>
        <div className="space-y-2">
          {cardFields.map(field => (
            <CardField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}