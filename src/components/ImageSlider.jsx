import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../App.css";
// import "./styles.css";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ImageSlider() {
  const [expandedCard, setExpandedCard] = useState(null); // State to track expanded card
  const swiperRef = useRef(null);
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
    {
      id: 1,
      title: "Fixed Deposits",
      description:
        "Secure your savings with attractive returns on fixed deposits",
      image: "/pdf/1.jpg",
    },
    {
      id: 2,
      title: "Personal Banking",
      description: "Personalized solutions for all your banking needs",
      image: "/pdf/2.jpg",
    },
    {
      id: 3,
      title: "Savings Account",
      description:
        "Enjoy higher interest rates with our premium savings account options",
      image: "/pdf/3.jpg",
    },
    {
      id: 4,
      title: "Credit Cards",
      description:
        "Exclusive rewards and cashback on our range of credit cards",
      image: "/pdf/4.jpg",
    },
    {
      id: 5,
      title: "Home Loans",
      description:
        "Competitive interest rates on home loans with quick approvals",
      image: "/pdf/5.jpg",
    },
    {
      id: 6,
      title: "Fixed Deposits",
      description:
        "Secure your savings with attractive returns on fixed deposits",
      image: "/pdf/6.jpg",
    },
    {
      id: 7,
      title: "Personal Banking",
      description: "Personalized solutions for all your banking needs",
      image: "/pdf/7.jpg",
    },
  ];
  const handlePrevClick = () => {
    swiperRef.current.swiper.slidePrev(); // Move to the previous slide
  };

  const handleNextClick = () => {
    swiperRef.current.swiper.slideNext(); // Move to the next slide
  };
  const handleCardClick = (cardId) => {
    if (expandedCard === cardId) {
      setExpandedCard(null); // Close the card if it's already expanded
    } else {
      setExpandedCard(cardId); // Expand the card
    }
  };
  return (
    <>
      <Swiper
        ref={swiperRef}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow]}
        className="mySwiper"
        navigation={true}
      >
        {cards.map((card, index) => (
          <SwiperSlide>
            <div
              key={card.id}
              className="border mx-auto w-full max-w-sm sm:w-72 md:w-64 lg:w-72 h-auto flex flex-col bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 sm:h-36 md:h-40 object-cover"
              />
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-white/90 flex-grow">
                  {card.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={handlePrevClick}
        className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronLeft className="text-orange-600" size={24} />
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronRight className="text-orange-600" size={24} />
      </button>
    </>
  );
}

export default ImageSlider;
