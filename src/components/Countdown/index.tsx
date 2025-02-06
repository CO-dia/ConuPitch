import { ChunkWithTime } from "@/utils/Estimate";
import React, { useEffect, useState } from "react";

type TimerProps = {
  actualIdRef: React.MutableRefObject<number>; // Current index of the prompter text
  start: boolean; // Whether to start the timer
  timing: ChunkWithTime[];
  setProgressText: React.Dispatch<React.SetStateAction<string>>; // Function to update the progress text
};

const Timer: React.FC<TimerProps> = ({
  actualIdRef,
  start,
  timing,
  setProgressText,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (elapsedTime === 0) return;

    if (
      (elapsedTime <= timing[actualIdRef.current].timeSeconds &&
        elapsedTime >= timing[actualIdRef.current].timeSeconds - 3) ||
      (elapsedTime >= timing[actualIdRef.current].timeSeconds &&
        elapsedTime <= timing[actualIdRef.current].timeSeconds + 3)
    ) {
      setProgressText("On time");
    } else if (timing[actualIdRef.current].timeSeconds < elapsedTime) {
      setProgressText("Late");
    } else {
      setProgressText("Early");
    }
  }, [elapsedTime]);

  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // Increment time by 1 second
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [start]);

  // Format total seconds back to "mm:ss"
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <div className="bg-white/25 p-2 pr-3 text-xl rounded">
      <p>Time: {formatTime(elapsedTime)}</p>
    </div>
  );
};

export default Timer;
