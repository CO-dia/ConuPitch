"use client";

import Countdown from "@/components/Countdown";
import React from "react";
import { Button } from "@/components/ui/button";
import Prompter from "@/components/Prompter";
import { usePrompter } from "@/contexts/prompterContext";

const PrompterPage = () => {
  const {
    actualIndex,
    actualIndexRef,
    elapsedTime,
    prompterText,
    progressText,
    recordVoice,
    startCountdown,
    timing,
    setActualIndex,
    setElapsedTime,
    setRecordVoice,
    setStartCountdown,
    setProgressText,
  } = usePrompter();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-[90vw] gap-10">
        <div className="flex w-full justify-between py-4 fixed bg-white/90">
          <Button
            className="bg-[#EBE645] text-black text-4xl ml-3 p-6 rounded-full place-items-end"
            onClick={() => {
              setRecordVoice(!recordVoice);
              setStartCountdown(!startCountdown);
            }}
          >
            {recordVoice ? "Stop" : "Start"}
          </Button>
          <div className="text-4xl">{progressText}</div>
          <Countdown actualIdRef={actualIndexRef}  timing={timing} setProgressText={setProgressText} elapsedTime={elapsedTime} start={startCountdown} setElapsedTime={setElapsedTime} />
        </div>
        <div className="mt-40">
          <Prompter
            text={prompterText}
            actualId={actualIndex}
            setActualId={setActualIndex}
            timing={timing}
          />
        </div>
      </div>
    </div>
  );
};

export default PrompterPage;
