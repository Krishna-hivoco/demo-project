


import React, { useState, useRef, useEffect } from "react";

const PandaLipSync = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Convert text to speech and play panda video
  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsLoading(true);

    try {
      // Simulate API call to text-to-speech service
      const response = await simulateTextToSpeechAPI(text);

      // Create audio URL from response
      setAudioUrl(response);

      setIsLoading(false);

      // Auto-play will be triggered in the useEffect that watches audioUrl
    } catch (error) {
      console.error("Error converting text to speech:", error);
      setIsLoading(false);
    }
  };

  const simulateTextToSpeechAPI = async (text) => {
    // Set up the data to be sent in the body of the POST request
    const data = {
      name: `${text} `,
      lang: "english",
    };

    try {
      const response = await fetch(
        "https://interactive.hivoco.com/api/get_audio",
        {
          method: "POST", // Specify the request method
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify(data), // Convert the data object to JSON
        }
      );

      // Handle the response
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json(); // Assuming the API returns JSON data
      return `data:audio/wav;base64,${result.audio}`;
    } catch (err) {
      console.error("API error:", err);
      throw err;
    }
  };

  // Effect to handle audio/video synchronization and auto-play
  useEffect(() => {
    if (!audioUrl) return;

    const audioElement = audioRef.current;
    const videoElement = videoRef.current;

    if (audioElement && videoElement) {
      // Set up event listeners for audio
      const handleAudioPlay = () => {
        videoElement.play();
        setIsPlaying(true);
      };

      const handleAudioPause = () => {
        videoElement.pause();
        setIsPlaying(false);
      };

      const handleAudioEnded = () => {
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsPlaying(false);
      };

      // Add event listeners
      audioElement.addEventListener("play", handleAudioPlay);
      audioElement.addEventListener("pause", handleAudioPause);
      audioElement.addEventListener("ended", handleAudioEnded);

      // Automatically start playing as soon as audio URL is set
      setTimeout(() => {
        audioElement.play().catch((err) => {
          console.error("Auto-play failed:", err);
          // Most browsers require user interaction before audio can play
          // This is just a fallback message for development purposes
        });
      }, 100);

      // Clean up event listeners
      return () => {
        audioElement.removeEventListener("play", handleAudioPlay);
        audioElement.removeEventListener("pause", handleAudioPause);
        audioElement.removeEventListener("ended", handleAudioEnded);
      };
    }
  }, [audioUrl]);

  // Handle video looping to match audio duration
  useEffect(() => {
    if (isPlaying && videoRef.current && audioRef.current) {
      const videoElement = videoRef.current;

      const handleVideoEnded = () => {
        // If audio is still playing, loop the video
        if (!audioRef.current.ended) {
          videoElement.currentTime = 0;
          videoElement.play();
        }
      };

      videoElement.addEventListener("ended", handleVideoEnded);

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnded);
      };
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panda Lip-Sync</h1>

      <div className="w-full mb-6">
        <textarea
          className="w-full p-3 border rounded-lg shadow-sm h-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
          placeholder="Enter text for the panda to speak..."
          value={text}
          onChange={handleTextChange}
        />
      </div>

      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors mb-8 disabled:bg-gray-400"
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
      >
        {isLoading ? "Converting..." : "Make Panda Speak!"}
      </button>

      <div className="w-full max-w-2xl h-96 relative bg-black rounded-lg overflow-hidden shadow-xl">
        {/* Panda video placeholder - replace with your panda video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          loop={false}
          muted
          poster="/api/placeholder/640/360"
        >
          {/* This source should be replaced with your actual panda video */}
          <source src="panda_sample.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-white text-center">
              <p className="text-xl mb-2">Panda is waiting to speak</p>
              <p className="text-sm">
                Enter text and click the button to start
              </p>
            </div>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} className="mt-4 w-full hidden" controls />
      )}
    </div>
  );
};

export default PandaLipSync;
