import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LoaderIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Card } from "./types"

export default function DeleteConfirmation({ payload, onCancel, onDeleted }: { payload?: Card, onCancel?: () => void, onDeleted?: () => void }) {
  const [loading, setLoading] = useState(false)

  async function onDeleteConfirmation() {
    if (!payload || !payload.$id) {
      toast.error("Something went wrong while deleting the card. Please try again.")
      return
    }
    try {
      setLoading(true)

      await fetch("/api", {
        method: "DELETE",
        body: JSON.stringify({
          rowId: payload?.$id,
        })
      })
      onCancel?.()
      onDeleted?.()
    } catch {
      setLoading(false)
      toast.error("Something went wrong while deleting the card. Please try again.")
    }
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>Delete card</AlertTitle>
      <AlertDescription>
        <div>
          Are you sure you want to delete this card?
        </div>
        <div className="flex justify-end w-full gap-2">
          <Button variant="outline" onClick={() => onCancel?.()}>Cancel</Button>
          <Button variant="destructive" onClick={() => onDeleteConfirmation()} disabled={loading}>
            {loading && <LoaderIcon className="animate-spin" />}
            Delete</Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}