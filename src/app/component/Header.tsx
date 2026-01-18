import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-20">
      {/* Top decorative border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Header content */}
      <div className="bg-leather/80 backdrop-blur-sm border-b border-wood/30 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-gold text-xl group-hover:animate-float-rune">◈</span>
            <span className="font-cinzel text-lg text-parchment group-hover:text-gold transition-colors">
              Dotaloregasm
            </span>
          </Link>

          {/* Optional navigation decorations */}
          <div className="flex items-center gap-4">
            <span className="text-gold-dim text-sm hidden md:block">✦</span>
          </div>
        </div>
      </div>
    </header>
  );
}
