'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { FormEvent } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { maskitoTransform } from "@maskito/core"
import { z } from "zod";
import { LoaderIcon } from "lucide-react";
import { Card, CardContent } from "./types";
import { colorList } from "@/lib/utils";

const CURRENCIES = ["KGS", "USD", "AED"]

function ColorListButtons({ color, setColor }: { color: string, setColor: (color: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-1 text-gray-500 font-semibold">Color</legend>
      <div className="flex gap-2 flex-wrap">
        {colorList.map((_color) => (
          <button type="button" key={_color}
            className={`cursor-pointer w-10 h-10 rounded-md border-4 border-accent ${color === _color ? 'transform scale-120 duration-100' : ''}`} onClick={() => _color === color ? setColor("") : setColor(_color)}
            style={{ backgroundColor: _color }}
          ></button>
        ))}
      </div>
    </fieldset>
  )
}

export const CardFormSchema = z.object({
  name: z.string().trim().regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters" }),
  currency: z.enum(CURRENCIES, { message: "Currency is required" }),
  holder: z.string().trim().regex(/^([A-Z]+)\s([A-Z]+)$/, { message: "Holder must contain only uppercase letters" }),
  number: z.string().trim().regex(/^([0-9]+\s?){4}$/, { message: "Number must be 16 digits" }),
  cvv: z.string().trim().regex(/^([0-9]+){3}$/, { message: "CVV must be 3 digits" }),
  expire: z.string().trim().regex(/^[0-9]{2}\/[0-9]{4}$/, { message: "Expire must be in format MM/YYYY" }),
  pin: z.string().trim().min(4, { message: "PIN must be 4 digits" }),
});

export default function CardDialogForm({ onSave, loading, card }: { onSave: (card: CardContent & { $id?: string, color?: string, binData?: Record<string, unknown> }) => void, loading: boolean, card?: Card }) {
  const [name, setName] = useState(card?.content?.name || "")
  const [currency, setCurrency] = useState(card?.content?.currency || "")
  const [holder, setHolder] = useState(card?.content?.holder || "")
  const [number, setNumber] = useState(card?.content?.number ? transformCardNumber(card?.content?.number) : "")
  const [cvv, setCvv] = useState(card?.content?.cvv || "")
  const [expire, setExpire] = useState(card?.content?.expire || "")
  const [pin, setPin] = useState(card?.content?.pin || "")
  const [color, setColor] = useState(card?.content?.color || "")

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  function onAddCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({})

    const validatedFields = CardFormSchema.safeParse({
      name,
      currency,
      holder,
      number,
      cvv,
      expire,
      pin,
    })
    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors)
      return
    }

    if (typeof onSave === 'function') {
      onSave({
        $id: card?.$id,
        name,
        currency,
        holder,
        number,
        cvv,
        expire,
        pin,
        color,
        binData: card?.content?.binData,
      })
    }
  }

  function transformCardNumber(value: string) {
    const transformedValue = value.replace(/[^0-9]/g, '')
    return maskitoTransform(transformedValue, {
      mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    })
  }

  function transformCvv(value: string) {
    const transformedValue = value.replace(/[^0-9]/g, '')
    return maskitoTransform(transformedValue, {
      mask: [/\d/, /\d/, /\d/],
    })
  }

  function transformExpire(value: string) {
    const transformedValue = value.replace(/[^0-9]/g, '')
    return maskitoTransform(transformedValue, {
      mask: [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    })
  }

  function transformPin(value: string) {
    const transformedValue = value.replace(/[^0-9]/g, '')
    return maskitoTransform(transformedValue, {
      mask: [/\d/, /\d/, /\d/, /\d/],
    })
  }

  return (
    <form className="space-y-4" onSubmit={onAddCard}>
      <fieldset>
        <legend className="mb-1 text-gray-500 font-semibold">Bank & Currency</legend>
        <div className="flex gap-2">
          <Input placeholder="Bank" value={name} onChange={(e) => setName(e.target.value?.toUpperCase())} type="text" required name="name" disabled={loading} autoComplete="off" />
          <Select value={currency} onValueChange={(value) => setCurrency(value)} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors?.name && <div className="form-error">{errors.name}</div>}
        {errors?.currency && <div className="form-error">{errors.currency}</div>}
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-gray-500 font-semibold">Card holder</legend>
        <div>
          <Input placeholder="Holder" value={holder} onChange={e => setHolder(e.target.value?.toUpperCase())} type="text" required name="holder" disabled={loading} autoComplete="off" />
          {errors?.holder && <div className="form-error">{errors.holder}</div>}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-gray-500 font-semibold">Card number</legend>
        <Input placeholder="Number" value={number} onChange={e => setNumber(transformCardNumber(e.target.value))} type="text" required name="number" disabled={loading} autoComplete="off" />
        {errors?.number && <div className="form-error">{errors.number}</div>}
      </fieldset>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <fieldset>
          <legend className="mb-1 text-gray-500 font-semibold">CVV</legend>
          <Input placeholder="CVV" value={cvv} onChange={(e) => setCvv(transformCvv(e.target.value))} type="text" required name="cvv" disabled={loading} autoComplete="off" />
        </fieldset>
        <fieldset>
          <legend className="mb-1 text-gray-500 font-semibold">Expire</legend>
          <Input placeholder="Expire" value={expire} onChange={(e) => setExpire(transformExpire(e.target.value))} type="text" required name="expire" disabled={loading} autoComplete="off" />
        </fieldset>
        <fieldset>
          <legend className="mb-1 text-gray-500 font-semibold">PIN</legend>
          <Input placeholder="PIN" value={pin} onChange={(e) => setPin(transformPin(e.target.value))} type="text" required name="pin" disabled={loading} autoComplete="off" />
        </fieldset>
        {errors?.cvv && <div className="form-error">{errors.cvv}</div>}
        {errors?.expire && <div className="form-error">{errors.expire}</div>}
        {errors?.pin && <div className="form-error">{errors.pin}</div>}
      </div>
      <ColorListButtons color={color} setColor={setColor} />

      <Button className="w-full" type="submit" disabled={loading}>
        {loading && <LoaderIcon className="animate-spin" />}
        Save</Button>
    </form >
  )
}