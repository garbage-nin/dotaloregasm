export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto">
      {/* Top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-steel/30 to-transparent" />

      {/* Footer content */}
      <div className="bg-void/60 backdrop-blur-sm px-6 py-4">
        <div className="container mx-auto text-center">
          <p className="text-mist/50 text-sm font-rajdhani">
            &copy; {new Date().getFullYear()} dotaloregasm.com
          </p>
          <p className="text-mist/30 text-xs mt-0.5">
            Dota 2 is a registered trademark of Valve Corporation
          </p>
        </div>
      </div>
    </footer>
  );
}
