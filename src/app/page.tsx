"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/lore");
  };

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Dotaloregasm</h1>
      <p className="mt-4 text-lg">Your daily Dota 2 lore challenge!</p>
      <div className="flex flex-col w-2/12 items-center justify-center space-y-2 py-2">
        <Button variant="default" className="w-full" onClick={handleClick}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Hero Lore"
          )}
        </Button>
        <Button variant="default" className="w-full" disabled>
          Item Lore
        </Button>
      </div>
    </div>
  );
}
