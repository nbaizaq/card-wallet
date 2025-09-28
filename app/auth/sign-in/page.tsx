'use client'

import { useActionState, useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, LoaderIcon } from "lucide-react"
import { signin } from '@/app/lib/actions/auth'

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [state, action, pending] = useActionState(signin, undefined)

  return (
    <div className="flex justify-between items-center h-screen p-4">
      <div className="space-y-4 mobile-container">
        <div className="text-center text-2xl font-bold">
          Card wallet
        </div>

        <Card className="w-full">
          <div className="px-4">
            <div className="font-bold text-center">
              Sign in
            </div>
          </div>
          <Separator />
          <CardContent>
            <form className="space-y-4" action={action}>
              <div>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required name="email" disabled={pending} />
                {state?.errors && <p className="form-error">{state.errors.email}</p>}
              </div>

              <div className="flex w-full max-w-sm items-center gap-2">
                <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} required name="password" disabled={pending} />
                <Button size="icon" className="size-8" variant="ghost" onClick={() => setShowPassword(!showPassword)} type="button">
                  <EyeIcon />
                </Button>
              </div>
              {state?.errors?.password && (
                <div>
                  <p>Password must:</p>
                  <ul className="list-disc list-inside">
                    {state.errors.password.map((error) => (
                      <li key={error} className="form-error">- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {state?.error && <p className="form-error">{state.error}</p>}
              <Button className="w-full" type="submit" disabled={pending}>{pending && <LoaderIcon className="animate-spin" />}Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
