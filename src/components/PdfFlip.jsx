import React, { useRef, useState } from "react";
import {
  Fullscreen,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react";
import _ from "lodash";
import HTMLFlipBook from "react-pageflip";

export default function PdfFlip({ setIsOpen }) {
  const bookRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Fullscreen functionality
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current
          .requestFullscreen()
          .catch((err) => console.log(err));
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Zoom functionality
  const zoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale + 0.2, 3);
      return Number(newScale.toFixed(2));
    });
  };

  const zoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale - 0.2, 1);
      return Number(newScale.toFixed(2));
    });
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const iciciImages = [
    {
      image: "/pdf/1.jpg",
      positions: [
        // {
        //   x: 30,
        //   y: 50,
        //   label: "Loan Details",
        //   description: "View loan information",
        // },
        // { x: 70, y: 30, label: "Contact", description: "Contact our support" },
      ],
    },
    {
      image: "/pdf/2.jpg",
      positions: [
        {
          x: 100,
          y: 120,
          label: "Investment",
          description: "Explore investment options",
        },
        { x: 40, y: 50, label: "Rates", description: "Current interest rates" },
      ],
    },
    {
      image: "/pdf/3.jpg",
      positions: [
        {
          x: 40,
          y: 300,
          label: "Policy",
          description: "The Benifiets of the policy",
        },
        {
          x: 75,
          y: 40,
          label: "Feature",
          description: "Feature of the policy",
        },
      ],
    },
    {
      image: "/pdf/4.jpg",
      positions: [
        {
          x: 300,
          y: 50,
          label: "Savings",
          description: "Savings account details",
        },
        {
          x: 50,
          y: 80,
          label: "Online Banking",
          description: "Digital banking services",
        },
      ],
    },
    {
      image: "/pdf/5.jpg",
      positions: [
        {
          x: 30,
          y: 50,
          label: "Personal Banking",
          description: "Personal banking solutions",
        },
        { x: 70, y: 70, label: "Offers", description: "Current bank offers" },
      ],
    },
    {
      image: "/pdf/6.jpg",
      positions: [
        {
          x: 30,
          y: 50,
          label: "Home Loan",
          description: "Home loan information",
        },
        {
          x: 60,
          y: 90,
          label: "EMI Calculator",
          description: "Calculate your EMI",
        },
      ],
    },
    {
      image: "/pdf/7.jpg",
      positions: [
        {
          x: 30,
          y: 50,
          label: "NRI Services",
          description: "Services for Non-Resident Indians",
        },
        {
          x: 70,
          y: 40,
          label: "International Banking",
          description: "Global banking solutions",
        },
      ],
    },
    {
      image: "/pdf/8.jpg",
      positions: [
        // {
        //   x: 30,
        //   y: 50,
        //   label: "Customer Support",
        //   description: "Get help and support",
        // },
        // {
        //   x: 60,
        //   y: 80,
        //   label: "Branch Locator",
        //   description: "Find nearest branch",
        // },
      ],
    },
  ];

  const handleHotspotClick = (hotspot) => {
    // console.log("object", hotspot);
    setActiveHotspot(hotspot);
    setIsOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-svh flex-col"
    >
      {/* Document Container with Subtle Shadow and Border */}
      <div className="relative w-full  h-[85%] bg-[#008B8B]   overflow-auto scrollbar-hide ">
        {/* Flip Book Container */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <HTMLFlipBook
            width={400}
            height={600}
            // showCover={true}
            mobileScrollSupport={true}
            ref={bookRef}
            useMouseEvents={false}
            flippingTime={500}
            onFlip={(e) => setCurrentPage(e.data)}
            style={{ transform: `scale(${scale})` }}
          >
            {iciciImages.map((page, index) => (
              <div
                key={index}
                className="page relative flex items-center justify-center "
              >
                <img
                  src={page.image}
                  alt={`ICICI Page ${index + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-100 ease-in-out"
                />

                {page.positions.map((position, posIndex) => (
                  <div
                    key={posIndex}
                    onClick={() => handleHotspotClick(position)}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                    }}
                  >
                    <div className="relative">
                      <div className="relative w-4 h-4">
                        <span className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping"></span>
                        <span className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full"></span>
                      </div>
                      {_.isEqual(activeHotspot, position) && (
                        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                          <div className="bg-white text-black p-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                            <strong>{position.label}</strong>
                            <p className="text-xs text-gray-600">
                              {position.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* Control Bar with Refined Design */}
      </div>
      <div className=" bottom-0 left-0 right-0 bg-[#333333] w-full  p-4 ">
        <div className="flex justify-center items-center space-x-6">
          {/* Previous Page Button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`
                transition-all duration-300 rounded-full p-2 
                ${
                  currentPage === 0
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-blue-500/30 hover:text-blue-300"
                }
              `}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={zoomOut}
            disabled={scale <= 1}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  scale <= 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-blue-500/30 hover:text-blue-300"
                }
              `}
          >
            <Minus size={28} />
          </button>

          {/* Page Indicator */}
          <div className="text-white text-lg font-semibold tracking-wider md:block hidden">
            Page {currentPage + 1} / {iciciImages.length}
          </div>

          {/* Zoom In Button */}
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  scale >= 3
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-blue-500/30 hover:text-blue-300"
                }
              `}
          >
            <Plus size={28} />
          </button>

          {/* Next Page Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === iciciImages.length - 1}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  currentPage === iciciImages.length - 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-blue-500/30 hover:text-blue-300"
                }
              `}
          >
            <ChevronRight size={28} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullScreen}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  isFullScreen
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-blue-500/30 hover:text-blue-300"
                }
              `}
          >
            <Fullscreen size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
