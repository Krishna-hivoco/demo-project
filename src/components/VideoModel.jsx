import React, { useEffect, useRef, useState } from "react";

const VideoModal = ({ show, onClose }) => {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Play the video when the modal is shown and video is ready
    if (show && videoRef.current && isVideoReady) {
      videoRef.current.play();
    }
  }, [show, isVideoReady]);

  // Handle video loading events
  const handleVideoCanPlay = () => {
    setIsVideoReady(true);
  };

  return (
    show && (
      <div className="video-modal-container ">
        {/* Close button at the top-right corner */}
        <button
          className="w-10 h-10 text-xl text-white bg-black rounded-full"
          onClick={onClose}
        >
          ×
        </button>

        {/* Video loading state */}
        {!isVideoReady && (
          <div className="flex items-center justify-center h-full w-full bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading video...</p>
            </div>
          </div>
        )}

        {/* Video Player (hidden until ready) */}
        <div
          className="video-player"
          style={{ display: isVideoReady ? "block" : "none" }}
        >
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            controls
            preload="auto"
            onCanPlay={handleVideoCanPlay}
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )
  );
};

export default VideoModal;
