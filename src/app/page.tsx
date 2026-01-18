"use client";

import { useRouter } from "next/navigation";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Main Ancient Scroll Container */}
      <div className="ancient-scroll p-8 md:p-12 max-w-2xl w-full text-center animate-fade-in-up">
        {/* Decorative top flourish */}
        <div className="flex justify-center mb-6">
          <span className="text-gold text-2xl animate-float-rune">✦</span>
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-gold animate-golden-pulse mb-2">
          Dotaloregasm
        </h1>

        {/* Subtitle with decorative divider */}
        <div className="ornate-divider">
          <span className="ornate-divider-symbol">◆</span>
        </div>

        <p className="text-ink font-crimson text-lg md:text-xl mb-8">
          Daily Dota 2 Hero Quiz
        </p>

        {/* Description */}
        <p className="text-ink-faded text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Guess the hero based on their lore!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleClick}
            disabled={loading}
            className="mystical-btn min-w-[180px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span className="text-lg">📜</span>
                <span>Hero Lore</span>
              </>
            )}
          </button>

          <button
            disabled
            className="mystical-btn min-w-[180px] flex items-center justify-center gap-2"
          >
            <span className="text-lg">🔮</span>
            <span>Item Lore</span>
          </button>
        </div>

        {/* Coming soon note */}
        <p className="text-ink-faded text-xs mt-4 italic">
          Item Lore — Coming Soon
        </p>

        {/* Bottom decorative flourish */}
        <div className="flex justify-center mt-8 gap-2">
          <span className="text-gold-dim text-sm">◈</span>
          <span className="text-gold-dim text-sm">◈</span>
          <span className="text-gold-dim text-sm">◈</span>
        </div>
      </div>

      {/* Floating rune decorations */}
      <div className="fixed bottom-10 left-10 text-gold opacity-20 text-4xl animate-float-rune pointer-events-none hidden md:block">
        ᚱ
      </div>
      <div className="fixed top-20 right-10 text-gold opacity-20 text-4xl animate-float-rune pointer-events-none hidden md:block" style={{ animationDelay: '1s' }}>
        ᚦ
      </div>
    </div>
  );
}
