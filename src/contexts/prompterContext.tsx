"use client";

import { ChunkWithTime, estimate } from "@/utils/Estimate";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

// Define the context type
interface PrompterContextType {
  actualIndex: number;
  actualIndexRef: React.MutableRefObject<number>;
  isSpeechRecognitionSupported: boolean;
  loading: boolean;
  prompterText: string[];
  progressText: string;
  recordVoice: boolean;
  router: any;
  startCountdown: boolean;
  timer: string;
  timerCountdown: any;
  timing: any[];
  setActualIndex: React.Dispatch<React.SetStateAction<number>>;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setProgressText: React.Dispatch<React.SetStateAction<string>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setTimer: React.Dispatch<React.SetStateAction<string>>;
  setRecordVoice: React.Dispatch<React.SetStateAction<boolean>>;
  setStartCountdown: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerCountdown: React.Dispatch<React.SetStateAction<any>>;
}

// Declare types for SpeechRecognition if it's not in the global type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Create the context with a default value (optional)
const PrompterContext = createContext<PrompterContextType | undefined>(
  undefined
);

// Provide the context to the application
export const PrompterProvider = ({ children }: { children: ReactNode }) => {
  const [progressText, setProgressText] = useState("");
  const [startCountdown, setStartCountdown] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState();
  const [timing, setTiming] = useState<ChunkWithTime[]>([]);

  // For prompter
  const [prompterText, setPrompterText] = useState<string[]>([]);

  // For line selection
  const [actualIndex, setActualIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  // For recording voice
  const [recordVoice, setRecordVoice] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
    useState(false);

  const [text, setText] = useState("");
  const [confirm, setConfirm] = useState(false);

  // Timer
  const [timer, setTimer] = useState("");

  const router = useRouter();

  const actualIndexRef = useRef(0); // Create a ref to store the latest actualIndex

  // Request microphone access
  const getMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted:", stream);
      return stream;
    } catch (err) {
      console.error("Microphone access denied:", err);
      return null;
    }
  };

  // Start listening to the microphone
  const startListening = () => {
    getMicrophoneAccess().then((stream) => {
      if (stream) {
        setMicStream(stream); // Save the stream to state
        startSpeechRecognition(); // Start speech recognition
      }
    });
  };

  // Stop the microphone stream
  const stopListening = () => {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      setMicStream(null); // Clear the micStream state
    } else {
      console.error("No microphone stream to stop.");
    }
    stopSpeechRecognition(); // Stop speech recognition
  };

  // Define recognition type
  let recognition: any = null;

  // Start speech recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set the desired language
    recognition.interimResults = true; // Capture results as they're recognized
    recognition.continuous = false; // Continue recognition until explicitly stopped

    recognition.onresult = (event: any) => {
      console.log("Speech recognition result:", event.results);
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      const lenghtTranscript = transcript.split(" ").length;
      if (lenghtTranscript > 2) {
        matchSentenceIndex(prompterText, transcript);
      }
    };

    recognition.onstop = (event: any) => {
      console.log("Speech recognition stopped:", event);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      recognition.start();
    };

    recognition.start();
    console.log("Speech recognition started.");
  };

  // Stop speech recognition
  function stopSpeechRecognition() {
    if (recognition) {
      recognition.stop();
      console.log("Speech recognition stopped.");
    }
  }

  const matchSentenceIndex = (sentences: string[], transcript: string) => {
    const onlyNextSentences = sentences.slice(actualIndexRef.current);
    let onlyFiveNextSentences = onlyNextSentences;
    if (onlyNextSentences.length > 5) {
      onlyFiveNextSentences = onlyNextSentences.slice(1, 6); // Limit to 5 chunks to make sure the search is fast and it doesn't go to far ahead
    }

    const fuse = new Fuse(onlyFiveNextSentences, {
      includeScore: true,
      threshold: 0.3, // Adjust this to determine how fuzzy the search can be
    });

    const result = fuse.search(transcript);

    if (result.length > 0) {
      const closestSentence = result[0].item;
      const index = sentences.indexOf(closestSentence);

      setActualIndex((prev) => {
        if (index <= prev) {
          return prev;
        }
        const element = document.getElementById(index.toString());
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 100,
            left: element.offsetLeft,
            behavior: "smooth",
          });
        }
        return index;
      });
    }
  };

  const processText = (text: string) => {
    return text.split(/[,.]/).map((sentence) => sentence.trim());
  };

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }
  }, []);

  // Sync the ref with the state
  useEffect(() => {
    actualIndexRef.current = actualIndex;
  }, [actualIndex]);

  // Handle recording state
  useEffect(() => {
    if (recordVoice) {
      startListening();
    } else {
      stopListening();
    }

    // Cleanup on component unmount
    return () => {
      stopListening();
    };
  }, [recordVoice]);

  // Handle confirmation logic
  useEffect(() => {
    if (confirm) {
      setLoading(true);
      const processedText = processText(text);
      setPrompterText(processedText);
      const nonEmptyChunks = processedText.filter(
        (chunk) => chunk.trim() !== ""
      );
      // Create an object with the chunk and its id
      const chunks = nonEmptyChunks.map((chunk, index) => ({
        id: index,
        chunk,
      }));
      
      const estimatedTiming = estimate({ chunksArray: chunks, time: timer });
      setTiming(estimatedTiming);
      setConfirm(false);
      router.push("/prompter");
    }
  }, [confirm]);

  return (
    <PrompterContext.Provider
      value={{
        actualIndex,
        actualIndexRef,
        isSpeechRecognitionSupported,
        loading,
        prompterText,
        progressText,
        recordVoice,
        router,
        startCountdown,
        timer,
        timerCountdown,
        timing,
        setActualIndex,
        setProgressText,
        setConfirm,
        setText,
        setTimer,
        setRecordVoice,
        setStartCountdown,
        setTimerCountdown,
      }}
    >
      {children}
    </PrompterContext.Provider>
  );
};

// Create a custom hook for using the PrompterContext
export const usePrompter = (): PrompterContextType => {
  const context = useContext(PrompterContext);
  if (!context) {
    throw new Error("usePrompter must be used within a PrompterProvider");
  }
  return context;
};
