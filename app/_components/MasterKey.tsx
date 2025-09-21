'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon } from "lucide-react"
import { FormEvent, useState } from "react"
import { MASTER_KEY } from "@/lib/encrypt"
import { z } from "zod"
import { cloudStorage } from '@telegram-apps/sdk-react';

const MasterKeySchema = z.object({
  masterKey: z.string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    }),
})

export default function MasterKey({ onSave, onCancel }: { onSave: (masterKey: string) => void, onCancel?: () => void }) {
  const [masterKey, setMasterKey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [open, setOpen] = useState(true)

  function validate() {
    setErrors({})
    const validatedFields = MasterKeySchema.safeParse({
      masterKey,
    });
    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors)
      return false;
    }
    return true;
  }

  async function saveMasterKey(masterKey: string) {
    if (cloudStorage.isSupported()) {
      await cloudStorage.setItem(MASTER_KEY, masterKey)
    }
    else {
      window.localStorage.setItem(MASTER_KEY, masterKey)
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    await saveMasterKey(masterKey);
    if (typeof onSave === 'function') {
      onSave(masterKey);
    }
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide a master key</DialogTitle>
            <form className="space-y-4 mt-4" onSubmit={onSubmit}>
              <div className="flex gap-2">
                <Input
                  placeholder="Master key"
                  type={showPassword ? "text" : "password"}
                  value={masterKey}
                  onInput={() => validate()}
                  onChange={(e) => setMasterKey(e.target.value)}
                  onBlur={() => validate()}
                  onFocus={() => validate()}
                  required
                  autoComplete={showPassword ? "off" : "new-password"}
                />
                <Button variant="outline" type="button" onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon />
                </Button>
              </div>
              {errors?.masterKey && errors.masterKey.length > 0 && <div className="form-error">{errors.masterKey?.at(0)}</div>}
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}