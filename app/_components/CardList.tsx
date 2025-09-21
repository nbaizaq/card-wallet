'use client'
import React, { useEffect, useState } from "react"
import CardDialog from "./CardDialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AppwriteException } from "appwrite"
import { encrypt, MASTER_KEY } from "@/lib/encrypt"
import MasterKey from "./MasterKey"
import { decrypt } from "@/lib/encrypt"
import { Card, Cards } from "./types"
import CardBlock from "./CardBlock"

export default function CardList(
  { salt, iv }:
    {
      salt: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer>
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

  async function onSave(card: Card) {
    try {
      setLoading(true)
      const content = JSON.stringify({
        ...card
      });

      if (!masterKey) {
        toast.error("Master key is not set")
        return
      }

      const encryptedCard = await encrypt(masterKey, salt, iv, content)

      await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          content: encryptedCard,
        })
      })
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

  async function fetchCards() {
    const response = await fetch("/api")
    const data = await response.json()
    setCards(data)
  }

  async function decryptCards() {
    if (!masterKey) {
      toast.error("Master key is not set")
      return
    }

    const decryptedCards = await Promise.all(cards.rows.map(async (card: Card) => {
      const result = await decrypt(masterKey, salt, iv, card.content);
      return JSON.parse(result as string)
    }))
    setDecryptedCards(decryptedCards as Card[])
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
        <CardDialog open={isOpen} setIsOpen={setIsOpen} onSave={onSave} loading={loading} />
      </div>

      {
        cards.total === 0 ? (
          <div>
            <div className="text-gray-500 text-center text-sm mt-4">
              No cards found
            </div>
          </div>
        ) : <div className="mt-4 space-y-4">
          {decryptedCards.map((card) => (
            <CardBlock key={card.$id} card={card} />
          ))}
        </div>
      }
      {masterKeyComponent}
    </div>
  )
}