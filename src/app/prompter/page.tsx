"use client";

import Countdown from "@/components/Countdown";
import React from "react";
import { Button } from "@/components/ui/button";
import Prompter from "@/components/Prompter";
import { usePrompter } from "@/contexts/prompterContext";

const PrompterPage = () => {
  const {
    actualIndex,
    prompterText,
    recordVoice,
    startCountdown,
    timerCountdown,
    setActualIndex,
    setRecordVoice,
    setStartCountdown,
  } = usePrompter();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-[90vw] gap-10">
        <h1 className="text-5xl text-[#000957] mt-10">
          CON<span className="text-6xl text-[#EBE645]">U</span>PITCH ?
        </h1>
        <div className="flex w-full justify-between">
          <Button
            className="bg-[#EBE645] text-black text-4xl p-6 rounded-full place-items-end"
            onClick={() => {
              setRecordVoice(!recordVoice);
              setStartCountdown(!startCountdown);
            }}
          >
            {recordVoice ? "Stop" : "Start"}
          </Button>
          <Countdown initialTime={timerCountdown} start={startCountdown} />
        </div>
        <Prompter
          text={prompterText}
          actualId={actualIndex}
          setActualId={setActualIndex}
        />
      </div>
    </div>
  );
};

export default PrompterPage;
