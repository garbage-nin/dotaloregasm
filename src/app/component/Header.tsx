import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-20">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-immortal-dim/40 to-transparent" />

      {/* Header content */}
      <div className="bg-obsidian/60 backdrop-blur-md border-b border-steel/40 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-immortal to-immortal-dim flex items-center justify-center transition-all group-hover:shadow-[0_0_16px_rgba(219,181,78,0.3)]">
              <span className="text-void text-xs font-bold font-rajdhani">D</span>
            </div>
            <span className="font-cinzel text-base text-frost/90 group-hover:text-immortal transition-colors tracking-wide">
              Dotaloregasm
            </span>
          </Link>

          {/* Minimal nav accent */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-arcane/40 animate-glow-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
