"use client";

export function RadarAnimation() {
  return (
    <div className="relative w-full h-full opacity-15 pointer-events-none">
      {/* Outer circle with scanning line */}
      <div className="absolute inset-0 rounded-full border border-primary/20">
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite]">
          <div className="absolute h-1/2 w-1 left-1/2 -translate-x-1/2 origin-bottom bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </div>

      {/* Inner circles */}
      <div className="absolute inset-[25%] rounded-full border border-primary/20" />
      <div className="absolute inset-[50%] rounded-full border border-primary/20" />
      <div className="absolute inset-[75%] rounded-full border border-primary/20" />

      {/* Grid lines - only vertical and horizontal */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute left-1/2 top-0 h-full w-px bg-primary/20" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20" />
      </div>

      {/* Blinking dots */}
      <div className="absolute left-[30%] top-[45%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
      <div className="absolute left-[70%] top-[60%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
      <div className="absolute left-[55%] top-[25%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
    </div>
  );
} 