"use client";

import TimePicker from "@/components/TimePicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePrompter } from "@/contexts/prompterContext";

export default function Home() {
  const { timer, setConfirm, setText, setTimer, setTimerCountdown } =
    usePrompter();

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-10">
      <h1 className="text-7xl text-[#000957]">
        CON<span className="text-8xl text-[#EBE645]">U</span>PITCH ?
      </h1>
      <Textarea
        className="h-[40vh] w-[80vw] bg-white"
        placeholder="Enter your text here"
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <div className="flex flex-col gap-5">
        <TimePicker setTimer={setTimer} />
        <Button
          className="rounded bg-[#000957]"
          onClick={() => {
            setTimerCountdown(timer);
            setConfirm(true);
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
