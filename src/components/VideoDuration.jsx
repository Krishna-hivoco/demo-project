import { useState, useRef, useEffect } from "react";

export default function CustomVideoPlayer() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60); // Default 60 seconds
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Update duration once video metadata is loaded
      const updateDuration = () => {
        setDuration(videoRef.current.duration);
        setEndTime(Math.min(endTime, videoRef.current.duration));
      };

      videoRef.current.addEventListener("loadedmetadata", updateDuration);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            updateDuration
          );
        }
      };
    }
  }, [endTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // If video reaches the end time, pause and reset to start time
      if (video.currentTime >= endTime) {
        video.pause();
        video.currentTime = startTime;
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [startTime, endTime]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure we're at the start position
    if (currentTime < startTime || currentTime >= endTime) {
      video.currentTime = startTime;
    }

    video.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md h-screen max-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Custom Video Player
      </h1>

      <div className="flex-1 mb-4 min-h-0">
        <video
          ref={videoRef}
          className="w-full h-full object-contain rounded-lg shadow-lg"
          src="/panda_sample.mp4"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">
            Current: {formatTime(currentTime)}
          </span>
          <span className="text-gray-700">
            Duration: {formatTime(duration)}
          </span>
        </div>

        <div className="relative h-2 bg-gray-300 rounded-full">
          <div
            style={{
              left: `${(startTime / duration) * 100}%`,
              width: `${((endTime - startTime) / duration) * 100}%`,
            }}
            className="absolute h-2 bg-blue-500 rounded-full"
          ></div>
          <div
            style={{ left: `${(currentTime / duration) * 100}%` }}
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full -ml-2"
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Start Time: {formatTime(startTime)}
          </label>
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={startTime}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setStartTime(Math.min(value, endTime - 1));
              if (currentTime < value || currentTime >= endTime) {
                videoRef.current.currentTime = value;
                setCurrentTime(value);
              }
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            End Time: {formatTime(endTime)}
          </label>
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={endTime}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setEndTime(Math.max(value, startTime + 1));
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-auto pb-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Selected Duration
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Pause
          </button>
        )}

        <button
          onClick={() => {
            videoRef.current.currentTime = startTime;
            setCurrentTime(startTime);
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset to Start
        </button>
      </div>
    </div>
  );
}
