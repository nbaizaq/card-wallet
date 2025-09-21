import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Models } from "appwrite";

export default function Header({ className, user }: { className?: string, user: Models.User }) {
  const initials = user.name.split(" ").map((name: string) => name[0]).join("");
  return (
    <div className={className}>
      <div className={`flex justify-between items-center`}>
        <div className="text-xl font-bold">
          Card wallet
        </div>
        <Avatar>
          <AvatarFallback className="text-sm font-bold">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}