'use client'

import { Button } from "@/components/ui/button"
import { InfoIcon, PencilIcon, TrashIcon } from "lucide-react"
import { type CardContent as CardContentType } from "./types"
import { toast } from "sonner"
import { useState } from "react"
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

function InfoDialog({ info, open, setOpen }: { info?: Record<string, unknown>, open: boolean, setOpen: (value: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Info</DialogTitle>
        </DialogHeader>
        <Separator />
        <div>
          {
            info && typeof info === 'object'
              ?
              (
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-gray-500">
                    Bank
                  </div>
                  <div className="col-span-3">
                    {info.bank as string}
                  </div>
                  <div className="text-gray-500">
                    Card
                  </div>
                  <div className="col-span-3">
                    {info.card as string}
                  </div>
                  <div className="text-gray-500">
                    Level
                  </div>
                  <div className="col-span-3">
                    {info.level as string}
                  </div>
                  <div className="text-gray-500">
                    Valid
                  </div>
                  <div className="col-span-3">
                    {(info.valid as string) === "true" ? 'Yes' : 'No'}
                  </div>
                  <div className="text-gray-500">
                    Country
                  </div>
                  <div className="col-span-3">
                    {info.country as string}
                  </div>
                  <div className="text-gray-500">
                    Type
                  </div>
                  <div className="col-span-3">
                    {info.type as string}
                  </div>
                </div>
              )
              : (
                <div>
                  <div className="font-bold">No info</div>
                </div>
              )
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CardBlock({ card, onEdit, onDelete }: { card: CardContentType & { color?: string, binData?: Record<string, unknown> }, onEdit: () => void, onDelete: () => void }) {
  const onCopyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  const [open, setOpen] = useState<boolean>(false)
  function onInfo() {
    setOpen(true)
  }


  return (
    <div className={`relative select-none rounded-lg ${!card.color ? 'border-1 border-gray-200 dark:border-gray-700' : ''} p-4 space-y-4`}>
      {card.color && <div className="absolute top-0 right-0 w-full h-full -z-10 rounded-lg opacity-60 dark:opacity-40" style={{ backgroundColor: card.color }} />}
      <InfoDialog info={card.binData} open={open} setOpen={setOpen} />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="font-light">{card.name}</div>
          <span>·</span>
          <span className="font-bold">{card.currency}</span>
        </div>
        <div className="flex gap-2">
          {
            card.binData && (
              <Button variant="outline" size="icon" className="size-8" onClick={() => onInfo()}>
                <InfoIcon />
              </Button>
            )
          }
          <Button variant="outline" size="icon" className="size-8" onClick={() => onEdit()}>
            <PencilIcon />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => onDelete()}>
            <TrashIcon />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <button className="cursor-pointer block" onClick={() => onCopyValue(card.holder)}>
          {card.holder}
        </button>

        <button className="text-xl font-mono cursor-pointer block" onClick={() => onCopyValue(card.number)}>
          {card.number}
        </button>

        <div className="flex gap-2 justify-between items-center text-gray-700 dark:text-gray-300">
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
    </ div>
  )
}