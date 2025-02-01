"use client";

import Prompter from "@/components/Prompter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useHome from "@/hooks/useHome";

export default function Home() {
  const {
    actualIndex,
    prompterText,
    recordVoice,
    setText,
    setConfirm,
    setRecordVoice,
  } = useHome();

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex gap-3 items-center w-[80vw]">
        <Textarea
          className="h-[20vh]"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            setConfirm(true);
          }}
        >
          Confirm
        </Button>
      </div>

      <div className="mt-16">
        <Button
          className="bg-red-500 w-10 h-10 rounded-full"
          onClick={() => {
            setRecordVoice(!recordVoice);
          }}
        >
          <div
            className={`w-2 h-2 bg-white ${recordVoice ? "" : "rounded-full"}`}
          />
        </Button>
        <Prompter text={prompterText} actualId={actualIndex} />
      </div>
    </div>
  );
}
