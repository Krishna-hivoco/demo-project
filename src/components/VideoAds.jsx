import React, { useState, useRef, useEffect } from "react";
import "../App.css";

// Sample quiz questions with timestamps (in seconds)
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    ></path>
  </svg>
);

// Define overlay types and their content
const overlays = [
  {
    id: 1,
    type: "question",
    timestamp: 5, // Show at 5 seconds
    duration: 10, // Overlay remains for 10 seconds if not dismissed
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    type: "contact",
    timestamp: 15, // Show at 15 seconds
    duration: 8,
    title: "Connect With Us!",
    socials: [
      {
        type: "instagram",
        label: "@yourcompany",
        url: "https://instagram.com/yourcompany",
      },
      {
        type: "linkedin",
        label: "Your Company",
        url: "https://linkedin.com/company/yourcompany",
      },
      { type: "phone", label: "+1 (555) 123-4567", url: "tel:+15551234567" },
    ],
  },
  {
    id: 3,
    type: "question",
    timestamp: 30, // Show at 30 seconds
    duration: 10,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    id: 4,
    type: "contact",
    timestamp: 45, // Show at 45 seconds
    duration: 8,
    title: "Questions? Reach Out!",
    socials: [
      {
        type: "phone",
        label: "Call Us: +1 (555) 123-4567",
        url: "tel:+15551234567",
      },
      {
        type: "instagram",
        label: "DM us on Instagram",
        url: "https://instagram.com/yourcompany",
      },
    ],
  },
];

function VideoAds() {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayTimer, setOverlayTimer] = useState(null);

  // Check video time to display overlays
  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      const time = Math.floor(videoElement.currentTime);
      setCurrentTime(time);

      // Find if we should show an overlay at the current timestamp
      const overlayToShow = overlays.find((o) => o.timestamp === time);

      if (overlayToShow && !activeOverlay && !isAnimating) {
        // Start animation
        setIsAnimating(true);

        // Set the active overlay after a brief delay to allow animation to begin
        setTimeout(() => {
          setActiveOverlay(overlayToShow);

          // Start overlay timer
          const timer = setTimeout(() => {
            handleDismiss();
          }, overlayToShow.duration * 1000);

          setOverlayTimer(timer);
        }, 100);
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      if (overlayTimer) {
        clearTimeout(overlayTimer);
      }
    };
  }, [activeOverlay, isAnimating, overlayTimer]);

  const handleAnswerSelect = (answer) => {
    if (overlayTimer) {
      clearTimeout(overlayTimer);
      setOverlayTimer(null);
    }

    setSelectedAnswer(answer);
    setIsCorrect(answer === activeOverlay.correctAnswer);

    // Auto-dismiss the overlay after showing result for 3 seconds
    setTimeout(() => {
      handleDismiss();
    }, 500);
  };

  const handleDismiss = () => {
    setActiveOverlay(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsAnimating(false);
    if (overlayTimer) {
      clearTimeout(overlayTimer);
      setOverlayTimer(null);
    }
  };

  // Render the appropriate overlay based on type
  const renderOverlay = () => {
    if (!activeOverlay) return null;

    if (activeOverlay.type === "question") {
      return (
        <>
          <h2 className="text-xl font-bold mb-4 text-white">
            {activeOverlay.question}
          </h2>

          <div className="space-y-2">
            {activeOverlay.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded ${
                  selectedAnswer === option
                    ? isCorrect
                      ? "bg-green-500 bg-opacity-80 text-white"
                      : "bg-red-500 bg-opacity-80 text-white"
                    : "bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                } border border-opacity-30`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>

          {/* {selectedAnswer !== null && (
            <div className="mt-4">
              <p
                className={`font-medium ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCorrect
                  ? "Correct!"
                  : `Incorrect. The correct answer is ${activeOverlay.correctAnswer}.`}
              </p>
            </div>
          )} */}
        </>
      );
    } else if (activeOverlay.type === "contact") {
      return (
        <>
          <h2 className="text-xl font-bold mb-4 text-white">
            {activeOverlay.title}
          </h2>

          <div className="space-y-3">
            {activeOverlay.socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
              >
                <span className="mr-3">
                  {social.type === "instagram" && <InstagramIcon />}
                  {social.type === "linkedin" && <LinkedInIcon />}
                  {social.type === "phone" && <PhoneIcon />}
                </span>
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen   flex items-center justify-center p-4">
      <div className="w-full max-w-3xl relative">
        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            src="/videos/video.mp4" // Replace with your video path
          />

          {/* Timeline indicators */}
          {/* <div className="absolute bottom-10 left-0 right-0 h-1 bg-gray-700 bg-opacity-50">
            {overlays.map((o) => (
              <div
                key={o.id}
                className={`absolute h-4 w-1 ${
                  o.type === "question" ? "bg-yellow-400" : "bg-blue-400"
                } -top-1.5 transform -translate-x-1/2`}
                style={{
                  left: `${
                    (o.timestamp / (videoRef.current?.duration || 100)) * 100
                  }%`,
                }}
                title={`${o.type === "question" ? "Quiz" : "Contact"} at ${
                  o.timestamp
                }s`}
              />
            ))}
          </div> */}

          {/* Overlay Container */}
          {(activeOverlay || isAnimating) && (
            <div
              className={`absolute inset-0  pointer-events-none flex items-center justify-center`}
            >
              <div
                className={`bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-6 max-w-md w-full pointer-events-auto
                  ${isAnimating ? "animate-slide-in" : ""}`}
              >
                {renderOverlay()}

                <button
                  className="mt-4 bg-transparent border border-white text-white py-1 px-3 rounded text-sm hover:bg-white hover:bg-opacity-20"
                  onClick={handleDismiss}
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Current Time Display (for debugging) */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Time: {currentTime}s
          </div>
        </div>
      </div>
    </div>
  );
}
export default VideoAds;
