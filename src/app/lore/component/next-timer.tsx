import React, { useEffect, useState } from "react";

const getNextMidnightUTC = (): number => {
  const now = new Date();
  const nextMidnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  return nextMidnight.getTime();
};

const formatTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export function NextHeroTimer() {
  const [timeLeft, setTimeLeft] = useState(getNextMidnightUTC() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getNextMidnightUTC() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4 text-xl font-semibold text-white bg-primary rounded-lg shadow-md">
      Next hero in{" "}
      <span className="text-green-400">{formatTime(timeLeft)}</span> UTC
    </div>
  );
}
