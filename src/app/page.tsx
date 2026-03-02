"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/lore");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      {/* Main Panel */}
      <div className="aegis-panel p-8 md:p-14 max-w-xl w-full text-center animate-fade-in-up">
        {/* Arcane accent line */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-arcane to-transparent opacity-60" />
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-immortal text-glow-immortal tracking-wide mb-3">
          Dotaloregasm
        </h1>

        {/* Subtitle divider */}
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-steel" />
          <span className="text-mist text-xs tracking-[0.3em] uppercase font-rajdhani font-medium">
            Daily Lore Challenge
          </span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-steel" />
        </div>

        {/* Description */}
        <p className="text-silver text-base md:text-lg mb-10 max-w-sm mx-auto leading-relaxed font-light">
          Can you identify the Dota 2 hero from their lore alone?
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={handleClick}
            disabled={loading}
            className="aegis-btn flex items-center justify-center gap-3 w-full py-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading</span>
              </>
            ) : (
              <>
                <span>Hero Lore</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            disabled
            className="aegis-btn aegis-btn-secondary flex items-center justify-center gap-3 w-full py-4"
          >
            <span>Item Lore</span>
            <span className="text-[10px] tracking-wider opacity-60 ml-1">SOON</span>
          </button>
        </div>

        {/* Bottom accent */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-steel" />
            <div className="w-1.5 h-1.5 rounded-full bg-immortal-dim opacity-60" />
            <div className="w-1 h-1 rounded-full bg-steel" />
          </div>
        </div>
      </div>
    </div>
  );
}
