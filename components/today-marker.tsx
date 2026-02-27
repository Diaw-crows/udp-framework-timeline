"use client";

import { useEffect, useState } from "react";

export function TodayMarker() {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();
    const halfMonth = day <= daysInMonth / 2 ? 0 : 1;
    const col = month * 2 + halfMonth;
    setPosition((col / 24) * 100);
  }, []);

  if (position === null) return null;

  return (
    <div
      className="pointer-events-none absolute top-0 bottom-0 z-10 flex flex-col items-center"
      style={{
        left: `calc(14rem + (100% - 14rem) * ${position / 100})`,
      }}
    >
      <div className="relative -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-red-50 shadow-lg shadow-red-500/20">
        TODAY
      </div>
      <div className="h-full w-px bg-red-500/50" />
    </div>
  );
}
