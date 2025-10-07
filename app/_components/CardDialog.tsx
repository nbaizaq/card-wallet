'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CardDialogForm from "./CardDialogForm"
import { useEffect, useState } from "react"
import { Card, CardContent } from "./types"

export default function CardDialog({ open, setIsOpen, onSave, loading, card }: { open: boolean, setIsOpen: (open: boolean) => void, onSave: (card: CardContent & { $id?: string }) => void, loading: boolean, card?: Card }) {
  const [showFormDelayed, setShowFormDelayed] = useState(false)
  const title = card ? "Edit card" : "Add a new card"

  useEffect(() => {
    if (open) {
      setShowFormDelayed(true)
    }
    else {
      setTimeout(() => {
        setShowFormDelayed(false)
      }, 150)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">{title}</DialogTitle>
          {showFormDelayed && <CardDialogForm onSave={onSave} loading={loading} card={card} />}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}