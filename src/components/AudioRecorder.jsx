import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Ready to record");
  const [silenceTimer, setSilenceTimer] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceThreshold = useRef(10); // 10 seconds of silence
  const volumeThreshold = useRef(0.05); // Adjust based on testing

  // Initialize audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio context for volume analysis
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Configure analyser
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        sendAudioToServer(audioBlob);
        audioChunksRef.current = [];
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setStatusMessage("Recording...");

      // Start volume monitoring
      monitorVolume(dataArray);
    } catch (error) {
      console.error("Error starting recording:", error);
      setStatusMessage("Error: Could not access microphone");
    }
  };

  // Monitor audio volume to detect silence
  const monitorVolume = (dataArray) => {
    if (!isRecording) return;

    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length / 255; // Normalize to 0-1

    // Check if audio is silent
    if (average < volumeThreshold.current) {
      if (!silenceTimer.current) {
        setStatusMessage("Silence detected...");
        silenceTimer.current = setTimeout(() => {
          stopRecording();
          setStatusMessage("Recording stopped due to silence");
          setSilenceTimer(null);

          // Set up listener to restart on new sound
          setupSoundDetection(dataArray);
        }, silenceThreshold.current * 1000);
      }
    } else {
      // If there's sound, clear the silence timer
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
        setStatusMessage("Recording...");
      }
    }

    // Continue monitoring
    requestAnimationFrame(() => monitorVolume(dataArray));
  };

  // Set up listener to restart recording when sound is detected
  const setupSoundDetection = (dataArray) => {
    const checkForSound = () => {
      if (isRecording) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length / 255;

      // If sound detected, restart recording
      if (average > volumeThreshold.current) {
        setStatusMessage("Sound detected, restarting recording");
        startRecording();
        return;
      }

      // Continue checking
      requestAnimationFrame(checkForSound);
    };

    requestAnimationFrame(checkForSound);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(true);

      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    }
  };

  // Send audio to server
  const sendAudioToServer = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      setStatusMessage("Sending audio to server...");

      const response = await axios.post(
        "http://localhost:5000/api/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatusMessage("Audio sent successfully. Waiting for sound...");
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error sending audio to server:", error);
      setStatusMessage("Error sending audio to server");
    }
  };

  // Manual controls
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Voice Recorder with Silence Detection
      </h2>

      <div className="mb-4">
        <p className="text-gray-600">{statusMessage}</p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleToggleRecording}
          className={`px-4 py-2 rounded font-bold ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      {audioBlob && (
        <div className="mt-4">
          <h3 className="font-bold">Last Recording:</h3>
          <audio controls className="mt-2 w-full">
            <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="mt-4 p-2 bg-gray-100 rounded">
        <p className="text-sm">
          <strong>How it works:</strong> This recorder will automatically stop
          after {silenceThreshold.current} seconds of silence and send the audio
          to the server. It will restart recording when it detects sound again.
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;
