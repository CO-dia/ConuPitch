import React from "react";

type PrompterProps = {
  text: string[];
  actualId: number;
  setActualId: React.Dispatch<React.SetStateAction<number>>;
};

const Prompter = ({ text, actualId, setActualId }: PrompterProps): JSX.Element => {
  return (
    <div className="border w-full min-h-[50vh] bg-white">
      {text.map((line, index) => (
        <>
          <p
            key={index}
            id={index.toString()}
            className={`text-4xl ${
              actualId === index ? "bg-yellow-400/80" : ""
            } ${index === actualId + 1 ? "bg-yellow-400/20" : ""} ${index < actualId ? "text-gray-400" : ""}`}
            onClick={() => setActualId(index)}
          >
            {line}
          </p>
          <br />
          <br />
          <br />
        </>
      ))}
    </div>
  );
};

export default Prompter;
