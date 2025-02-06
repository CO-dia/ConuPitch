"use client";

import TimePicker from "@/components/TimePicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePrompter } from "@/contexts/prompterContext";
import { RotatingLines } from "react-loader-spinner";

export default function Home() {
  const { timer, loading, setConfirm, setText, setTimer, setTimerCountdown } =
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
          {loading ? (
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </div>
  );
}
