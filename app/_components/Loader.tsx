import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin">
        <LoaderIcon className="size-6" />
      </div>
    </div>
  )
}