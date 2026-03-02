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

const formatTime = (ms: number): { hours: string; minutes: string; seconds: string } => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
  };
};

export function NextHeroTimer() {
  const [timeLeft, setTimeLeft] = useState(getNextMidnightUTC() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getNextMidnightUTC() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="aegis-timer">
      <p className="text-mist text-sm font-rajdhani tracking-wide uppercase mb-3">
        Next hero in
      </p>
      <div className="flex items-center justify-center gap-1">
        {/* Hours */}
        <div className="timer-digit-group">
          <span className="timer-digit">{hours[0]}</span>
          <span className="timer-digit">{hours[1]}</span>
        </div>
        <span className="timer-separator">:</span>
        {/* Minutes */}
        <div className="timer-digit-group">
          <span className="timer-digit">{minutes[0]}</span>
          <span className="timer-digit">{minutes[1]}</span>
        </div>
        <span className="timer-separator">:</span>
        {/* Seconds */}
        <div className="timer-digit-group">
          <span className="timer-digit">{seconds[0]}</span>
          <span className="timer-digit">{seconds[1]}</span>
        </div>
      </div>
      <p className="text-mist/40 text-xs mt-2 tracking-wider">UTC</p>
    </div>
  );
}
