import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "../App.css";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChatBot from "./ChatBot";

import VideoModal from "./VideoModel";
import PdfFlip from "./PdfFlip";

function CardSwiper() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null); // State to track expanded card
  const [activeCard, setActiveCard] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleVideoCanPlay = () => {
    setIsVideoReady(true);
  };
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

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

  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    language: "English",
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    dob: false,
  });
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
  const cards = [
    {
      id: 1,
      title: "Savings Account",
      description:
        "Enjoy higher interest rates with our premium savings account options",
      image: "/pdf/1.jpg",
    },
    {
      id: 2,
      title: "Credit Cards",
      description:
        "Exclusive rewards and cashback on our range of credit cards",
      image: "/pdf/2.jpg",
    },
    {
      id: 3,
      title: "Home Loans",
      description:
        "Competitive interest rates on home loans with quick approvals",
      image: "/pdf/3.jpg",
    },
    {
      id: 4,
      title: "Fixed Deposits",
      description:
        "Secure your savings with attractive returns on fixed deposits",
      image: "/pdf/4.jpg",
    },
    {
      id: 5,
      title: "Personal Banking",
      description: "Personalized solutions for all your banking needs",
      image: "/pdf/5.jpg",
    },
    {
      id: 6,
      title: "Savings Account",
      description:
        "Enjoy higher interest rates with our premium savings account options",
      image: "/pdf/6.jpg",
    },
    {
      id: 7,
      title: "Credit Cards",
      description:
        "Exclusive rewards and cashback on our range of credit cards",
      image: "/pdf/7.jpg",
    },
    {
      id: 8,
      title: "Home Loans",
      description:
        "Competitive interest rates on home loans with quick approvals",
      image: "/pdf/8.jpg",
    },
  ];

  const closeModal = () => {
    setIsOpen(false);
    pauseVideo(); // Pause video when closing
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const handlePrevClick = () => {
    swiperRef.current.swiper.slidePrev(); // Move to the previous slide
  };

  const handleNextClick = () => {
    swiperRef.current.swiper.slideNext(); // Move to the next slide
  };
  const handleCardClick = (cardId) => {
    if (activeCard === cardId) {
      setExpandedCard(expandedCard === cardId ? null : cardId);
      setIsOpen(true);
    }
    setIsOpen(true);
  };

  const containerRef = useRef(null);
  const [isTwoFingerScroll, setIsTwoFingerScroll] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setIsTwoFingerScroll(true);
      setStartY(e.touches[0].clientY); // Take the first finger as reference
    }
  };

  const handleTouchMove = (e) => {
    if (isTwoFingerScroll && e.touches.length === 2) {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;

      if (containerRef.current) {
        containerRef.current.scrollTop += deltaY; // Scroll the container
      }

      setStartY(currentY);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setIsTwoFingerScroll(false);
    }
  };

  return (
    <div className="h-svh ">
      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-container text-start">
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

      {isOpen && (
        <VideoModal
          show={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}

      {/* <Swiper
        ref={swiperRef}
        effect={"coverflow"}
       
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 200, 
          disableOnInteraction: false,
        }}
        keyboard={true}
        direction="horizontal"
        mousewheel={true}
       
        loop={true}
        pagination={true}
        modules={[EffectCoverflow]}
        className="mySwiper"
        navigation={true}
        onSlideChange={(swiper) => setActiveCard(cards[swiper.activeIndex]?.id)}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={card.id}>
            <div
              onClick={() => handleCardClick(card.id)}
              className={`mx-auto w-full max-w-sm sm:w-72 md:w-64 lg:w-72 h-auto flex flex-col  rounded-xl shadow-md overflow-hidden  
                
                ${activeCard === card.id ? "cursor-pointer" : " opacity-95"}`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full max-h-svh sm:h-36 md:h-[450px] object-cover "
              />
             
            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}

      {/* <button
        onClick={handlePrevClick}
        className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronLeft className="text-orange-600" size={24} />
      </button> */}
      {/* <button
        onClick={handleNextClick}
        className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronRight className="text-orange-600" size={24} />
      </button> */}
      <PdfFlip setIsOpen={setIsOpen} />
      {!isOpen && <ChatBot person_name={userDetails.name.trim()} />}
    </div>
  );
}

export default CardSwiper;
