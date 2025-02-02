import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import TimeInput from "../TimeInput";

type TimePickerProps = {
  setTimer: Dispatch<SetStateAction<string>>;
};

const TimePicker: React.FC<TimePickerProps> = ({ setTimer }) => {
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    setTimer(minutes + ":" + seconds);
  }, [minutes, seconds]);

  return (
    <div className="flex flex-col text-white">
      <h4>Time </h4>
      <div className="flex gap-2">
        <TimeInput
          name="Minutes"
          value={minutes}
          maximum={99}
          setValue={setMinutes}
        />
        <span className="mt-3">:</span>
        <TimeInput
          name="Seconds"
          value={seconds}
          maximum={60}
          setValue={setSeconds}
        />
      </div>
    </div>
  );
};

export default TimePicker;
