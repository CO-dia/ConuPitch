import React, { useEffect, useState } from "react";

type CountdownProps = {
  initialTime: string;
  start: boolean;
};

const Countdown: React.FC<CountdownProps> = ({ initialTime, start }) => {
  const parseTime = (time: string) => {
    const [minutes, seconds] = time.split(":").map(Number);
    console.log("minutes : seconds", minutes, seconds);
    return minutes * 60 + seconds;
  };

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setTime((time) => {
          if (time === 0) {
            clearInterval(timer); // Stop the timer
            return 0;
          }
          return time - 1; // Decrease time by 1 second
        });
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

  useEffect(() => {
    if (initialTime.includes(":")) {
      console.log("initialTime", initialTime);
      setTime(parseTime(initialTime));
    }
  }, [initialTime]);

  return (
    <div>
      <p>Time left: {formatTime(time)}</p>
    </div>
  );
};

export default Countdown;
