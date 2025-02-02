"use client";

import Countdown from "@/components/Countdown";
import Prompter from "@/components/Prompter";
import TimePicker from "@/components/TimePicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useHome from "@/hooks/useHome";
import { useEffect } from "react";

export default function Home() {
  const {
    actualIndex,
    prompterText,
    recordVoice,
    startCountdown,
    timer,
    timerCountdown,
    setActualIndex,
    setConfirm,
    setRecordVoice,
    setStartCountdown,
    setText,
    setTimer,
    setTimerCountdown,
  } = useHome();

  useEffect(() => {
    console.log("timer", timer)
  }, [timer]);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex gap-3 items-center w-[80vw]">
        <Textarea
          className="h-[20vh]"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <div className="flex flex-col gap-5">
          <TimePicker setTimer={setTimer} />
          <Button
            onClick={() => {
              setTimerCountdown(timer);
              setConfirm(true);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <Countdown initialTime={timerCountdown} start={startCountdown} />
        <Button
          className="ml-5 bg-red-500 w-10 h-10 rounded-full"
          onClick={() => {
            setRecordVoice(!recordVoice);
            setStartCountdown(!startCountdown);
          }}
        >
          <div
            className={`w-2 h-2 bg-white ${recordVoice ? "" : "rounded-full"}`}
          />
        </Button>
        <Prompter text={prompterText} actualId={actualIndex} setActualId={setActualIndex} />
      </div>
    </div>
  );
}
