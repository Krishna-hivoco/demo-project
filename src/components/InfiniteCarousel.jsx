import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChatBot from "./ChatBot";

const CardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

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

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    let interval;
    if (isMobile) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMobile, cards.length]);

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? cards.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) =>
        prevIndex === cards.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="relative max-w-6xl m-auto h-[600px] bg-gradient-to-r rounded-lg overflow-hidden p-2 md:p-4">
      <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold">ICICI Insurance Brochure</div>
      </div>

      <div className="relative w-full h-72 md:h-full flex items-center justify-center mt-10 md:mt-0">
        <div
          className="absolute flex transition-transform duration-500 ease-in-out"
          style={{
            // transform: `translateX(calc(1152px / 2 - ${
            //   activeIndex * 256 + 128
            // }px))`,

            transform: `translateX(calc(${
              carouselRef.current?.offsetWidth / 2
            }px - ${activeIndex * 256 + 128}px))`,

            // transform: `translateX(calc(50% + ${-activeIndex * 256}px))`,
          }}
          ref={carouselRef}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`relative mx-3 w-48 h-60 md:w-64 md:h-80 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md transition-all duration-500 transform ${
                index === activeIndex ? "scale-125 z-20" : "scale-90 z-10"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${card.title} card, ${
                index === activeIndex ? "currently active" : ""
              }`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-28 md:h-40 object-cover rounded-t-xl"
              />
              <div className="p-2 md:p-4">
                <h3 className="text-sm md:text-lg font-bold text-white">
                  {card.title}
                </h3>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-white/90">
                  {card.description}
                </p>
              </div>
              {index === activeIndex && (
                <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                  <button className="bg-white text-red-600 text-xs px-2 md:px-3 py-1 rounded-full font-medium hover:bg-white/90 transition-colors">
                    Learn More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronLeft className="text-orange-600" size={isMobile ? 20 : 24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <ChevronRight className="text-orange-600" size={isMobile ? 20 : 24} />
      </button>

      <ChatBot />
    </div>
  );
};

export default CardCarousel;
