"use client";

import { useEffect, useState } from "react";

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function useElapsedTime(since: string) {
  const [label, setLabel] = useState(() => formatElapsed(Date.now() - new Date(since).getTime()));

  useEffect(() => {
    const id = setInterval(() => {
      setLabel(formatElapsed(Date.now() - new Date(since).getTime()));
    }, 1000);
    return () => clearInterval(id);
  }, [since]);

  return label;
}
