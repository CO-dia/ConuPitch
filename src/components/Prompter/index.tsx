import React from "react";

type PrompterProps = {
  text: string[];
  actualId: number;
  setActualId: React.Dispatch<React.SetStateAction<number>>;
  timing: any[];
};

const Prompter = ({ text, actualId, setActualId, timing }: PrompterProps): JSX.Element => {
  console.log("timing", timing);
  return (
    <div className="border w-full min-h-[50vh] bg-white">
      {text.map((line, index) => (
        <>
          <div
            className={`flex gap-10 text-4xl ${
              actualId === index ? "bg-yellow-400/80" : ""
            } ${index === actualId + 1 ? "bg-yellow-400/20" : ""} ${
              index < actualId ? "text-gray-400" : ""
            }`}
          >
            <p>{timing[index]?.time}</p>
            <p
              key={index}
              id={index.toString()}
              onClick={() => setActualId(index)}
            >
              {line}
            </p>
          </div>
          <br />
          <br />
          <br />
        </>
      ))}
    </div>
  );
};

export default Prompter;
