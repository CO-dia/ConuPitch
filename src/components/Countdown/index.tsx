import React, { useEffect } from "react";

type TimerProps = {
  elapsedTime: number; // Elapsed time in seconds
  actualIdRef: React.MutableRefObject<number>; // Current index of the prompter text
  start: boolean; // Whether to start the timer
  timing: any[];
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>; // Function to update the elapsed time
  setProgressText: React.Dispatch<React.SetStateAction<string>>; // Function to update the progress text
};

const Timer: React.FC<TimerProps> = ({
  elapsedTime,
  actualIdRef,
  start,
  timing,
  setElapsedTime,
  setProgressText,
}) => {
  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        console.log("timing", timing);
        console.log("actualId", actualIdRef.current);
        if (timing[actualIdRef.current].time === elapsedTime) {
          setProgressText("On time");
        } else if (timing[actualIdRef.current].time < elapsedTime) {
          setProgressText("Late");
        } else {
          setProgressText("Early");
        }
        setElapsedTime((time) => time + 1); // Increment time by 1 second
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
