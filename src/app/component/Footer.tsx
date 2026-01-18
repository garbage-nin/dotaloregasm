export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto">
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-wood/50 to-transparent" />

      {/* Footer content */}
      <div className="bg-leather/60 backdrop-blur-sm px-6 py-4">
        <div className="container mx-auto text-center">
          {/* Decorative elements */}
          <div className="flex justify-center gap-2 mb-2">
            <span className="text-gold-dim text-xs">◈</span>
            <span className="text-gold-dim text-xs">◈</span>
            <span className="text-gold-dim text-xs">◈</span>
          </div>

          {/* Copyright */}
          <p className="text-parchment/60 text-sm font-crimson">
            &copy; {new Date().getFullYear()} dotaloregasm.com
          </p>
          <p className="text-parchment/40 text-xs mt-1">
            All Dota 2 content belongs to Valve Corporation
          </p>
        </div>
      </div>
    </footer>
  );
}
