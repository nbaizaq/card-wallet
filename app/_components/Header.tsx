"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Models } from "appwrite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoaderIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { toast } from "sonner";

export default function Header({ className, user }: { className?: string, user?: Models.User }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signout() {
    try {
      setLoading(true);
      await fetch("/auth/sign-out", {
        method: "POST",
      });

      router.push("/auth/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while signing out. Please try again.")
    }
    finally {
      setLoading(false);
    }
  }

  const initials = user?.name?.split(" ")?.map((name: string) => name[0])?.join("") ?? "";
  return (
    <div className={className}>
      <div className={`flex justify-between items-center`}>
        <div className="text-xl font-bold">
          Card wallet
        </div>
        {user &&
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="text-sm font-bold">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signout()} disabled={loading}>{
                loading ? <LoaderIcon className="animate-spin" /> : <LogOutIcon className="w-4 h-4" />} Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </div>
  )
}