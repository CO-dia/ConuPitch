import React from "react";

type PrompterProps = {
  text: string[];
  actualId: number;
  setActualId: React.Dispatch<React.SetStateAction<number>>;
};

const Prompter = ({ text, actualId, setActualId }: PrompterProps): JSX.Element => {
  return (
    <div className="border w-[90vw] min-h-[50vh]">
      {text.map((line, index) => (
        <>
          <p
            key={index}
            id={index.toString()}
            className={`${actualId === index ? "bg-red-500" : ""}`}
            onClick={() => setActualId(index)}
          >
            {line}
          </p>
          <br />
        </>
      ))}
    </div>
  );
};

export default Prompter;
