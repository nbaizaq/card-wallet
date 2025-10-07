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
import { LoaderIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function initTheme() {
  const theme = window.document.body.classList.contains("dark") ? "dark" : "light";
  window.cookieStore.set("theme", theme);
  return theme;
}

function setThemeCookie(theme: "light" | "dark") {
  window.document.body.classList.toggle("dark", theme === "dark");
  window.cookieStore.set("theme", theme);
}

export default function Header({ className, user }: { className?: string, user?: Models.User }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [theme, setTheme] = useState<"light" | "dark">();

  useEffect(() => {
    const _theme = initTheme();
    setTheme(_theme);
  }, []);

  const toggleTheme = () => {
    const _theme = theme === "light" ? "dark" : "light";
    setThemeCookie(_theme);
    setTheme(_theme);
  }

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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </Button>
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
    </div>
  )
}