import React, { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";

type TimeInputProps = {
  name: string;
  value: string;
  maximum: number;
  setValue: Dispatch<SetStateAction<string>>;
};

const TimeInput: React.FC<TimeInputProps> = ({ name, value, maximum, setValue }) => {
  return (
    <div className="flex flex-col items-center">
      <Input
        className="border w-20 h-12 text-center bg-white/25 text-white"
        value={value}
        type="number"
        min={0}
        max={maximum}
        onChange={(event) => {
          const inputValue = event.currentTarget.value;

          // Remove leading zeros if present
          const sanitizedValue = inputValue.replace(/^0+(?!$)/, "");

          // Ensure the number is within the min and max range
          if (
            Number(sanitizedValue) >= 0 &&
            Number(sanitizedValue) <= maximum
          ) {
            setValue(sanitizedValue);
          }
        }}
        onBlur={() => {
          // Add leading zero if it's a single digit on blur
          if (value.length === 1) {
            setValue(value.padStart(2, "0"));
          }
        }}
      />
      {name}
    </div>
  );
};

export default TimeInput;
