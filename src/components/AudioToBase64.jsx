

import { useState, useRef } from "react";

const AudioUploader = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState();
  const [error, setError] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);

      // Check file type
      const fileType = file.type;
      console.log("File type:", fileType);

      // Create a URL for the audio preview
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      // Reset states
      setError(null);
      setApiResponse(null);
    }
  };

  const sendToApi = async () => {
    if (!audioFile) {
      setError("Please select an audio file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append("audio", audioFile);

      // Flask API endpoint
      const response = await fetch(
        "https://interactive.hivoco.com/api/upload-and-get-timestamps",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("data", data.speech_segments);
      setApiResponse(data.speech_segments);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audio Upload</h1>

      {/* File Input */}
      <div className="w-full mb-6">
        <label className="block text-gray-700 mb-2 font-medium">
          Select Audio File
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">MP3, WAV, OGG, M4A</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Audio Preview */}
      {audioUrl && (
        <div className="w-full mb-6">
          <h2 className="text-lg font-medium mb-2">Preview</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="mb-2 text-sm text-gray-700">
              {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={audioUrl}
              type={audioFile.type}
              preload="metadata"
              onError={(e) => {
                console.error("Audio error:", e);
                setError(
                  "This audio format may not be supported by your browser. You can still upload it to the API."
                );
              }}
            >
              Your browser does not support the audio element or this audio
              format.
            </audio>
            <p className="mt-2 text-xs text-gray-500">
              Note: Some WAV formats may not play in all browsers but can still
              be uploaded to the API.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={sendToApi}
        disabled={isLoading || !audioFile}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
          isLoading || !audioFile
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Sending..." : "Send to API"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* API Response */}
      {apiResponse && (
        <div className="w-full mt-4">
          <h2 className="text-lg font-medium mb-2">API Response</h2>
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {/* <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(apiResponse, null, 2)}
            </pre> */}

            {apiResponse.map((item) => {
              return <p>{item}</p>;
            })}
          </div>

          {/* Server-side audio playback */}
          {/* {playbackUrl && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-md font-medium mb-2">
                Server Audio Playback
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                This is the audio served directly from the server:
              </p>
              <audio
                controls
                className="w-full"
                src={playbackUrl}
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
