import React, { useRef, useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ref for the image container and image
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Prevent default touch behavior
  const preventTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

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

  // Add event listeners to prevent zoom
  useEffect(() => {
    // Prevent pinch zoom globally
    document.body.addEventListener("touchmove", preventTouch, {
      passive: false,
    });
    document.body.addEventListener("gesturestart", preventTouch, {
      passive: false,
    });
    document.body.addEventListener("gesturechange", preventTouch, {
      passive: false,
    });
    document.body.addEventListener("gestureend", preventTouch, {
      passive: false,
    });

    return () => {
      // Cleanup event listeners
      document.body.removeEventListener("touchmove", preventTouch);
      document.body.removeEventListener("gesturestart", preventTouch);
      document.body.removeEventListener("gesturechange", preventTouch);
      document.body.removeEventListener("gestureend", preventTouch);
    };
  }, []);

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

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(1, Math.min(zoom + delta, 3));
    setZoom(newZoom);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    console.log("handleMouseDown");
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    console.log("handleMouseMove");
    if (isDragging && containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // Calculate new position
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate max movement boundaries
      const maxX = Math.max(
        0,
        (imageRect.width * zoom - containerRect.width) / 2
      );
      const maxY = Math.max(
        0,
        (imageRect.height * zoom - containerRect.height) / 2
      );

      // Set new position with boundary checks
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    console.log("handleMouseUp");
    setIsDragging(false);

    // Reset position to center when cursor is released
    if (zoom > 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    if (isDragging) {
      setIsDragging(false);

      // Reset position to center when cursor leaves
      if (zoom > 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const iciciImages = [
    {
      image: "/pdf/1.jpg",
      positions: [],
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
          description: "The Benefits of the policy",
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
      positions: [],
    },
  ];

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot);
    setIsOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className=" flex items-center justify-center w-full h-full flex-col"
      // onTouchStart={preventTouch}
      // onTouchMove={preventTouch}
      // onTouchEnd={preventTouch}
    >
      {/* Document Container with Subtle Shadow and Border */}
      <div
        // onWheel={handleWheel}
        className="relative w-full h-[85%] bg-[#008B8B] overflow-hidden scrollbar-hide"
        style={{
          touchAction: "none", // Prevent default touch interactions
          userSelect: "none", // Prevent text selection
          WebkitUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        {/* Flip Book Container */}
        <div
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            cursor: zoom > 1 ? (isDraggisng ? "grabbing" : "grab") : "zoom-in",
            userSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={preventTouch}
          onTouchMove={preventTouch}
          onTouchEnd={preventTouch}
          draggable="false"
          ref={imageRef}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-out select-none inset-0 flex items-center justify-center p-8"
        >
          <HTMLFlipBook
            width={400}
            height={600}
            mobileScrollSupport={true}
            ref={bookRef}
            useMouseEvents={false}
            flippingTime={500}
            onFlip={(e) => setCurrentPage(e.data)}
          >
            {iciciImages.map((page, index) => (
              <div
                key={index}
                className="page relative flex items-center justify-center"
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
      </div>

      {/* Control Bar */}
      <div className="bottom-0 left-0 right-0 bg-[#333333] w-full p-4">
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
            onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            disabled={zoom <= 1}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  zoom <= 1
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
            onClick={() => setZoom(Math.min(3, zoom + 0.5))}
            disabled={zoom >= 3}
            className={`
                transition-all duration-300 rounded-full p-2
                ${
                  zoom >= 3
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
