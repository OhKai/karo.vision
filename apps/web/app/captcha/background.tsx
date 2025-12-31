"use client";

export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 top-0 h-96 w-96 animate-float rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -right-70 top-1/4 h-96 w-96 animate-float-delayed rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-float-slow rounded-full bg-pink-500/20 blur-3xl" />
      <svg
        className="absolute inset-0 h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r="1"
              fill="currentColor"
              className="text-muted-slate-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
