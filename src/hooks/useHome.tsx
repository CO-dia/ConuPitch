import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";

// Declare types for SpeechRecognition if it's not in the global type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const useHome = () => {
  const [text, setText] = useState("");
  const [recordVoice, setRecordVoice] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [prompterText, setPrompterText] = useState<string[]>([]);

  // Timer
  const [timer, setTimer] = useState("");
  const [timerCountdown, setTimerCountdown] = useState("");
  const [startCountdown, setStartCountdown] = useState(false);

  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
    useState(false);

  const [actualIndex, setActualIndex] = useState(0);
  const actualIndexRef = useRef(0); // Create a ref to store the latest actualIndex

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
        onlyFiveNextSentences = onlyNextSentences.slice(0, 5); // Limit to 5 chunks to make sure the search is fast and it doesn't go to far ahead
    }

    console.log("onlyFiveNextSentences:", onlyFiveNextSentences);
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
            top: element.offsetTop,
            left: element.offsetLeft,
            behavior: "smooth",
          });
        }
        return index;
      });
    }
  };

  const processText = (text: string) => {
    const sentences = text.split(/[,.]/).map((sentence) => sentence.trim());
/* 
    // Further split sentences into chunks of 5 words if they're too long
    const processedChunks: string[] = [];
    sentences.forEach((sentence) => {
      const words = sentence.split(/\s+/).filter((word) => word.trim() !== "");

      // If the sentence has more than 5 words, split into 5-word chunks
      if (words.length > 8) {
        for (let i = 0; i < words.length; i += 8) {
          processedChunks.push(words.slice(i, i + 8).join(" "));
        }
      } else {
        // Otherwise, keep the sentence as is
        processedChunks.push(sentence);
      }
    }); */

    return sentences;
  };

  // Sync the ref with the state
  useEffect(() => {
    actualIndexRef.current = actualIndex;
  }, [actualIndex]);

  // Handle recording state
  useEffect(() => {
    console.log("recordVoice:", recordVoice);

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
      const processedText = processText(text);
      setPrompterText(processedText);
      setConfirm(false);
    }
  }, [confirm]);

  return {
    actualIndex,
    isSpeechRecognitionSupported,
    prompterText,
    recordVoice,
    startCountdown,
    timer,
    timerCountdown,
    setActualIndex,
    setConfirm,
    setText,
    setTimer,
    setRecordVoice,
    setStartCountdown,
    setTimerCountdown
  };
};

export default useHome;
