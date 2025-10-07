import { Suspense } from "react";
import Cards from "./_components/Cards";
import Loader from "./_components/Loader";

export default async function Home() {
  return (
    <div className="p-4 py-8">
      <Suspense fallback={<Loader />}>
        <Cards />
      </Suspense>
    </div>
  );
}
