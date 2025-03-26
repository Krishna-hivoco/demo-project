import React, { useState, useRef, useEffect } from "react";
import "./InsuranceAgePage.css";

const ICICIVideo = () => {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    language: "English",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    dob: false,
  });

  // Example subtitle data - replace with your actual subtitle content
  //   const subtitles = [

  //   ];

  const [subtitles, setSubtitles] = useState([
    {
      startTime: 1,
      endTime: 5,
      text: "Hii Himanshu, How are you",
    },
  ]);

  // Handle video can play event
  const handleVideoCanPlay = () => {
    setIsVideoReady(true);
  };

  // Track video time for subtitles
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateSubtitle = () => {
      const currentTime = videoElement.currentTime;
      const subtitle = subtitles.find(
        (sub) => currentTime >= sub.startTime && currentTime < sub.endTime
      );
      setCurrentSubtitle(subtitle ? subtitle.text : "");
    };

    const timeUpdateHandler = () => {
      updateSubtitle();
      setIsPlaying(!videoElement.paused);
    };

    videoElement.addEventListener("timeupdate", timeUpdateHandler);
    videoElement.addEventListener("play", () => setIsPlaying(true));
    videoElement.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      videoElement.removeEventListener("timeupdate", timeUpdateHandler);
      videoElement.removeEventListener("play", () => setIsPlaying(true));
      videoElement.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [subtitles]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleWelcomeSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const errors = {
      name: !userDetails.name.trim(),
      dob: !userDetails.dob.trim(),
    };

    setFormErrors(errors);

    if (!errors.name && !errors.dob) {
      setShowWelcomeModal(false);
      // Calculate age from DOB to suggest appropriate section
      const age = calculateAge(userDetails.dob);

      // Store user data
      localStorage.setItem(
        "iciciUserDetails",
        JSON.stringify({
          ...userDetails,
          age,
        })
      );
      const updatedSubtitles = [...subtitles];
      updatedSubtitles[0].text = `Hii Himanshu , How are you`;

      setSubtitles(updatedSubtitles);
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <h2 className="text-white text-2xl font-bold text-center">
                Welcome to ICICI Personalize Video
              </h2>
            </div>
            <div className="p-6">
              <p className="mb-6 text-gray-700 text-center">
                Please provide your details to personalize your insurance
                journey
              </p>
              <form onSubmit={handleWelcomeSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter your name
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all ${
                      formErrors.dob ? "border-red-500" : "border-gray-300"
                    }`}
                    value={userDetails.dob}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, dob: e.target.value })
                    }
                  />
                  {formErrors.dob && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter your date of birth
                    </p>
                  )}
                </div>
                {/* <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Preferred Language
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all"
                    value={userDetails.language}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        language: e.target.value,
                      })
                    }
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div> */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-bold shadow-md hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Begin My Personalized Journey
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">ICICI Insurance</h1>
            <div className="text-right">
              {!showWelcomeModal && (
                <p className="text-sm opacity-80">
                  Welcome, {userDetails.name}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-orange-100 to-red-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Personalized Insurance Video
              </h2>
              <p className="text-gray-600 mb-4">
                Watch this customized presentation about insurance options that
                match your profile.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-video relative bg-black">
                {/* Loading overlay */}
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-300 border-b-red-500 border-l-red-300 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-lg">
                        Preparing your personalized video...
                      </p>
                    </div>
                  </div>
                )}

                {/* Video element */}
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  preload="auto"
                  controls
                  onCanPlay={handleVideoCanPlay}
                  poster="/images/video-thumbnail.jpg"
                >
                  <source src="/videos/messi.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Subtitles overlay */}
                {isPlaying && currentSubtitle && (
                  <div className="absolute bottom-16 left-0 right-0 text-center p-2">
                    <div className="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-2xl max-w-[90%]">
                      {currentSubtitle}
                    </div>
                  </div>
                )}
              </div>

              {/* Video controls */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div>
                  {isVideoReady && (
                    <div className="flex gap-2">
                      <button
                        onClick={playVideo}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Play
                      </button>
                      <button
                        onClick={pauseVideo}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Pause
                      </button>
                    </div>
                  )}
                </div>
                {/* <div className="text-sm text-gray-500">
                  {userDetails.language} • Personalized for your age group
                </div> */}
              </div>
            </div>

            {/* Call to action */}
            {/* <div className="p-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-300">
                  Explore Insurance Plans
                </button>
                <button className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300">
                  Schedule a Consultation
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICICIVideo;
