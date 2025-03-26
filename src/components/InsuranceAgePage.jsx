import React, { useState, useRef, useEffect } from "react";
import "./InsuranceAgePage.css";
import VideoModal from "./VideoModel";

const InsuranceAgePage = () => {
  const [playing, setPlaying] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    language: "English",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    dob: false,
  });

  const audioRef = useRef(null);
  const secondAudioRef = useRef(null);

  // State to manage audio play
  const [firstAudioLink, setFirstAudioLink] = useState(null);
  const [secondAudioLink, setSecondAudioLink] = useState("/audio/intro.mp3");
  const [isPlayingFirst, setIsPlayingFirst] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlayingFirst(true);
      setIsPlaying(true);
    }
  };

  // Handle the end of the first audio
  const handleFirstAudioEnd = () => {
    if (secondAudioRef.current) {
      secondAudioRef.current.play();
      setIsPlayingFirst(false);
      setIsPlaying(true);
    }
  };

  // Languages available for audio
  const languages = [
    { id: "en", name: "English" },
    { id: "hi", name: "Hindi" },
  ];

  const handlePostRequest = async (lang) => {
    // Set up the data to be sent in the body of the POST request
    const data = {
      name: `Hey ${userDetails?.name} , `,
      lang: lang?.toLowerCase(),
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
      // console.log("res", result.audio);
      setFirstAudioLink(`data:audio/wav;base64,${result.audio}`);
    } catch (err) {
      //   setError(err.message); // Handle any errors
    }
  };

  useEffect(() => {
    if (audioRef.current && firstAudioLink) {
      setIsPlaying(true);
      // Set the audio source once it's available
      audioRef.current.src = firstAudioLink;
      audioRef.current.play();
    }
  }, [firstAudioLink]);

  const toggleAudio = (section) => {
    if (isPlaying) return;
    if (!playing[section]) {
      audioRef.current.pause();
      setVideoPlayerOpen(true);

      // Store the section to be played after language selection
      sessionStorage.setItem("pendingAudioSection", section);
    } else {
      // If already playing, just stop it
      const newPlayingState = { ...playing };
      newPlayingState[section] = false;
      setPlaying(newPlayingState);
    }
  };

  const startAudio = (section) => {
    // First pause all currently playing audio
    const newPlayingState = { ...playing };
    Object.keys(playing).forEach((key) => {
      newPlayingState[key] = false;
    });

    // Then play the selected section
    newPlayingState[section] = true;
    setPlaying(newPlayingState);
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
      setShowLanguageModal(true);
    }
  };

  const handleLanguageSubmit = async () => {
    setShowLanguageModal(false);

    // Get the pending section from session storage
    const pendingSection = sessionStorage.getItem("pendingAudioSection");
    if (pendingSection) {
      startAudio(pendingSection);
      sessionStorage.removeItem("pendingAudioSection");
    }
  };

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

  const renderAudioButton = (section) => (
    <button
      onClick={() => toggleAudio(section)}
      className={`audio-button ${
        playing[section] ? "playing" : ""
      } animate-bounce`}
      aria-label={playing[section] ? "Pause audio" : "Play audio"}
    >
      {playing[section] ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )}
      <span className="pulse-ring"></span>
    </button>
  );

  const ageGroups = [
    {
      id: "section1",
      title: "Young Adults (18-30 years)",
      description:
        "Young adults should focus on building a strong financial foundation with cost-effective term insurance and health coverage.",
      points: [
        "Term life insurance with adequate coverage",
        "Health insurance with accident benefits",
        "Critical illness riders for comprehensive protection",
      ],
      audioText: "Young Adults Insurance Options",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
      iconColor: "text-blue-500",
    },
    {
      id: "section2",
      title: "Family Starters (30-40 years)",
      description:
        "As you start a family, your insurance needs expand to protect your dependents and growing responsibilities.",
      points: [
        "Family floater health insurance",
        "Child education plans",
        "Higher sum assured term insurance",
        "Home loan protection cover",
      ],
      audioText: "Family Insurance Planning",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      iconColor: "text-green-500",
    },
    {
      id: "section3",
      title: "Mid-Career (40-50 years)",
      description:
        "Focus on wealth accumulation while maintaining comprehensive protection for your health and family future.",
      points: [
        "Investment-linked insurance plans",
        "Enhanced health coverage with senior care riders",
        "Retirement planning with pension plans",
        "Critical illness standalone policies",
      ],
      audioText: "Mid-Career Insurance Strategies",
      bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
      iconColor: "text-amber-500",
    },
    {
      id: "section4",
      title: "Pre-Retirement (50-60 years)",
      description:
        "Prepare for retirement while ensuring adequate health protection as healthcare needs typically increase.",
      points: [
        "Enhanced health insurance with lower deductibles",
        "Annuity and pension plans",
        "Senior citizen-specific health coverage",
        "Legacy planning solutions",
      ],
      audioText: "Pre-Retirement Insurance Planning",
      bgColor: "bg-gradient-to-r from-purple-50 to-violet-50",
      iconColor: "text-purple-500",
    },
    {
      id: "section5",
      title: "Senior Citizens (60+ years)",
      description:
        "Focus on healthcare coverage and creating a steady income stream for your retirement years.",
      points: [
        "Senior citizen health insurance with comprehensive coverage",
        "Regular income plans with lifetime payouts",
        "Plans covering pre-existing conditions",
        "Medical insurance with domiciliary coverage",
      ],
      audioText: "Senior Citizen Insurance Options",
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header bg-gradient-to-r from-orange-500 to-red-500">
              <h2 className="text-white text-xl font-bold text-center">
                Welcome to ICICI Insurance
              </h2>
            </div>
            <div className="modal-body">
              <p className="mb-4">
                Please provide your details to personalize your insurance
                journey
              </p>
              <form onSubmit={handleWelcomeSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg ${
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
                  <label className="block text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2 border rounded-lg ${
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
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold shadow-md hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header bg-gradient-to-r from-blue-500 to-indigo-500">
              <h2 className="text-white text-xl font-bold text-center">
                Select Audio Language
              </h2>
            </div>
            <div className="modal-body">
              <p className="mb-4">
                In which language would you like to listen to the audio?
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    onClick={async () => {
                      setUserDetails({ ...userDetails, language: lang.name });
                      setShowLanguageModal(false);
                      await handlePostRequest(lang.name);
                    }}
                    className={`language-option ${
                      userDetails.language === lang.name ? "selected" : ""
                    }`}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="header-container">
        <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">ICICI Insurance</div>
          <div className="flex gap-4 items-center">
            <button className="text-white hover:text-orange-100 transition-colors hidden md:block">
              Support
            </button>
            <button className="text-white hover:text-orange-100 transition-colors hidden md:block">
              Login
            </button>
            <button className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition-colors font-semibold">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Age-Based Insurance Planning
        </h1>
        <p className="text-gray-600 mt-2 text-xl">
          Find the perfect insurance coverage based on your age and life stage
        </p>
        <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4"></div>
      </div>

      {ageGroups.map((group) => (
        <div
          key={group.id}
          onClick={() => toggleAudio(group.id)}
          className={`mb-10 p-6 border-0 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all ${group.bgColor}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${group.iconColor} bg-white shadow-md`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {group.title}
              </h2>
            </div>
            {renderAudioButton(group.id)}
          </div>
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <p className="mb-3 text-lg">{group.description}</p>
              <div className="bg-white/70 p-4 rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">Key considerations:</p>
                <ul className="space-y-2 mt-2 text-gray-700">
                  {group.points.map((point, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={group.iconColor}
                      >
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-1/3 overflow-hidden hidden md:visible rounded-lg shadow-md">
              <div className="bg-gradient-to-b from-gray-100 to-gray-300 h-48 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={group.iconColor}
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="2.18"
                    ry="2.18"
                  ></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
              </div>
            </div>
          </div>
          {playing[group.id] && (
            <div className="mt-4 p-3 bg-white/80 rounded-md flex items-center gap-2 shadow-sm animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={group.iconColor}
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Audio playing: {group.audioText}
              </span>
            </div>
          )}
        </div>
      ))}

      <div className="mt-12 p-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg text-white">
        <h3 className="text-2xl font-bold mb-3">Need personalized advice?</h3>
        <p className="mb-6 text-lg">
          Speak with our insurance experts to find the perfect coverage based on
          your age and requirements.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <button className="bg-white text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-100 transition-colors font-bold shadow-md flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Schedule a Consultation
          </button>
          <button className="border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-500 transition-colors font-bold shadow-md flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Call 1800-XXX-XXXX
          </button>
        </div>
      </div>

      {isPlaying && (
        <div className="audio-modal-container">
          <img
            className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white md:bg-transparent p-2  shadow-xl"
            src="/gif/speaker.gif"
            alt="Gif"
            srcSet=""
          />
        </div>
      )}

      {videoPlayerOpen && (
        <VideoModal
          show={videoPlayerOpen}
          onClose={() => {
            setVideoPlayerOpen(false);
          }}
        />
      )}
      <div className="hidden">
        <audio
          ref={audioRef}
          onEnded={handleFirstAudioEnd} // Play the second audio when the first one ends
          controls
        >
          Your browser does not support the audio tag.
        </audio>

        <audio
          ref={secondAudioRef}
          src={secondAudioLink}
          onEnded={() => setIsPlaying(false)}
          controls
          style={{ display: isPlayingFirst ? "none" : "block" }} // Hide the second audio until the first ends
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

export default InsuranceAgePage;
