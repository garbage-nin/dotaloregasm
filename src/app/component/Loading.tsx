export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-5">
      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-2 border-steel rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-immortal rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-immortal animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <p className="font-rajdhani text-mist text-sm tracking-widest uppercase">
        Loading
      </p>
    </div>
  );
}
