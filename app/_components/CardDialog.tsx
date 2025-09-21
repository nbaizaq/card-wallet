'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CardDialogForm from "./CardDialogForm"
import { useEffect, useState } from "react"
import { Card } from "./types"

export default function CardDialog({ open, setIsOpen, onSave, loading }: { open: boolean, setIsOpen: (open: boolean) => void, onSave: (card: Card) => void, loading: boolean }) {
  const [showFormDelayed, setShowFormDelayed] = useState(false)

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
          <DialogTitle className="mb-2">Add a new card</DialogTitle>
          {showFormDelayed && <CardDialogForm onSave={onSave} loading={loading} />}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}