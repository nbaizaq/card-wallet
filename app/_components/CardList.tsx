'use client'
import React, { useEffect, useState } from "react"
import CardDialog from "./CardDialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AppwriteException } from "appwrite"
import { encrypt, MASTER_KEY } from "@/lib/encrypt"
import MasterKey from "./MasterKey"
import { decrypt } from "@/lib/encrypt"
import { Card, CardContent, Cards } from "./types"
import CardBlock from "./CardBlock"
import ConfirmationDialog from "./ConfirmationDialog"
import DeleteConfirmation from "./DeleteConfirmation"
import { LoaderIcon } from "lucide-react"

export default function CardList(
  { salt, iv }:
    {
      salt?: Uint8Array<ArrayBuffer>, iv?: Uint8Array<ArrayBuffer>
    }
) {
  const [masterKeyComponent, setMasterKeyComponent] = useState<React.ReactNode | null>(null)
  const [masterKey, setMasterKey] = useState<string | null>(null)
  const [cards, setCards] = useState<Cards>({
    total: 0,
    rows: [],
  })
  const [decryptedCards, setDecryptedCards] = useState<Card[]>([])

  function initMasterKey() {
    const _masterKey = window.sessionStorage.getItem(MASTER_KEY);
    if (!_masterKey) {
      setMasterKeyComponent(<MasterKey onSave={() => decryptCards()} />)
    }
    else {
      setMasterKey(_masterKey)
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSave(card: CardContent & { $id?: string }) {
    try {
      if (!salt || !iv) {
        toast.error("Salt and IV are not set")
        return
      }

      setLoading(true)
      const { $id, ...rest } = card
      const content = JSON.stringify({
        ...rest
      });

      if (!masterKey) {
        toast.error("Master key is not set")
        return
      }

      const encryptedCard = await encrypt(masterKey, salt, iv, content)

      if ($id) {
        await fetch("/api", {
          method: "PUT",
          body: JSON.stringify({
            content: encryptedCard,
            rowId: $id,
          })
        })
      }
      else {
        await fetch("/api", {
          method: "POST",
          body: JSON.stringify({
            content: encryptedCard,
          })
        })
      }

      setIsOpen(false)
      fetchCards()
    } catch (error) {
      console.error(error)
      if (error instanceof AppwriteException) {
        toast.error(error.message || "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    }
    finally {
      setLoading(false)
    }
  }

  const [fetchingCards, setFetchingCards] = useState(false)
  async function fetchCards() {
    try {
      setFetchingCards(true)
      const response = await fetch("/api")
      const data = await response.json()
      setCards(data)
    } catch {
      toast.error("Something went wrong while fetching cards. Please try again.")
    }
    finally {
      setFetchingCards(false)
    }
  }

  async function decryptCards() {
    if (!masterKey) {
      toast.error("Master key is not set")
      return
    }

    if (!salt || !iv) {
      toast.error("Salt and IV are not set")
      return
    }

    Promise.all(cards.rows.map(card => {
      return new Promise(async (resolve, reject) => {
        try {
          const content = await decrypt(masterKey, salt, iv, card.content);
          const parsedContent = JSON.parse(content)
          resolve({
            ...card,
            content: parsedContent
          })
        } catch (error) {
          reject(error)
        }
      })
    }))
      .then((parsedCards) => {
        setDecryptedCards(parsedCards as Card[])
      }).catch(() => {
        toast.error("Something went wrong while decrypting cards. Please check your master key and try again.")
        setMasterKeyComponent(<MasterKey onSave={() => decryptCards()} />)
      })
  }

  const [card, setCard] = useState<Card>()

  function onEdit(card: Card) {
    setIsOpen(true)
    setCard(card)
  }

  const [confirmationDialog, setConfirmationDialog] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<Card>()
  function onDelete(card: Card) {
    setConfirmationDialog(true)
    setCardToDelete(card)
  }

  function onDeleted() {
    setConfirmationDialog(false)
    setCardToDelete(undefined)
    fetchCards()
  }

  useEffect(() => {
    if (masterKey) decryptCards()
  }, [masterKey, cards])

  useEffect(() => {
    initMasterKey();
    fetchCards()
  }, [])

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Add a new card
        </Button>
        <CardDialog open={isOpen} setIsOpen={setIsOpen} onSave={onSave} loading={loading} card={card} />
        <ConfirmationDialog open={confirmationDialog} setOpen={setConfirmationDialog}>
          <DeleteConfirmation payload={cardToDelete} onCancel={() => setConfirmationDialog(false)} onDeleted={() => onDeleted()} />
        </ConfirmationDialog>
      </div>

      {
        cards.total === 0 ? (
          <div>
            <div className="text-gray-500 text-center text-sm mt-4">
              No cards found
            </div>
            {fetchingCards && <div className="flex justify-center items-center mt-4"><LoaderIcon className="animate-spin" /></div>}
          </div>
        ) : <div className="mt-4 space-y-4">
          {decryptedCards.map((card) => (
            <CardBlock key={card.$id} card={card} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      }
      {masterKeyComponent}
    </div>
  )
}