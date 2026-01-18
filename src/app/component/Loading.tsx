export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
      {/* Loading animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gold/20 rounded-full" />
        {/* Spinning ring */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-gold rounded-full animate-spin" />
        {/* Center symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gold text-xl animate-pulse">◈</span>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="font-cinzel text-gold text-lg animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
