type EstimateProps = {
  chunksArray: { id: number; chunk: string }[];
  time: string;
};

export type ChunkWithTime = {
  id: number;
  text: string;
  timeDisplay: string; // Format: "mm:ss"
  timeSeconds: number; // Decimal seconds (string)
};

export const estimate = ({
  chunksArray,
  time,
}: EstimateProps): ChunkWithTime[] => {
  const totalSeconds = convertToSeconds(time);
  const dividedTime = totalSeconds / chunksArray.length;
  let currentTime = 0;
  const chunksWithTime = chunksArray.map((chunk) => {
    currentTime += dividedTime;
    return {
      id: chunk.id,
      text: chunk.chunk,
      timeDisplay: `${Math.round(currentTime / 60)
        .toString()
        .padStart(2, "0")}:${Math.round(currentTime % 60)
        .toString()
        .padStart(2, "0")}`,
      timeSeconds: parseFloat(currentTime.toFixed(2)),
    };
  });

  return chunksWithTime;
};

const convertToSeconds = (time: string) => {
  const [minutes, seconds] = time.split(":").map(Number); // Split into parts and convert to numbers
  return minutes * 60 + seconds; // Calculate total seconds
};
