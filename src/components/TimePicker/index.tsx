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
    <div className="flex items-center gap-2">
      <TimeInput value={minutes} maximum={99} setValue={setMinutes} />
      :
      <TimeInput value={seconds} maximum={60} setValue={setSeconds} />
    </div>
  );
};

export default TimePicker;
