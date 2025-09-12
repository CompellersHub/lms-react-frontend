import { useState, useRef, useEffect } from "react";
import { Play, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AwsVideoPlayer from "./AwsVideoPlayer";
import bgImage from "@/assets/img/hero.jpeg";
import { EventRegistrationModal } from "./EventRegistrationModal"; // Import the consultation modal component

export function Hero() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false); // New state for registration modal
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef(null);

  // Handle when video player is ready
  const handleVideoReady = () => {
    // Auto-play when video is ready and modal is open
    if (showVideoModal && videoRef.current) {
      setTimeout(() => {
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.play();
        }
      }, 50);
    }
  };

  // Auto-play video when modal opens
  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      // Try multiple times with increasing delays to ensure video is ready
      const tryPlayVideo = (attempt = 1) => {
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.play();
        } else if (attempt < 5) {
          // Retry up to 5 times with increasing delays
          setTimeout(() => tryPlayVideo(attempt + 1), attempt * 100);
        }
      };

      // Start trying to play after a small initial delay
      setTimeout(() => tryPlayVideo(), 100);
    }
  }, [showVideoModal]);

  // Handle modal close
  const handleCloseModal = () => {
    // Pause video when closing modal
    if (videoRef.current && videoRef.current.pause) {
      videoRef.current.pause();
    }
    setShowVideoModal(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showVideoModal) {
        handleCloseModal();
      }
    };

    if (showVideoModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [showVideoModal]);

  return (
    <section className="relative min-h-[500px] h-screen w-full overflow-hidden flex items-center justify-center">
      {" "}
      {/* Adjusted height and added flex for centering */}
      {/* Blurred placeholder while image loads */}
      <div
        className={`absolute inset-0 bg-no-repeat bg-cover transition-all duration-700 ${
          imageLoaded ? "" : "blur-lg scale-105 bg-gray-900"
        }`}
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: imageLoaded ? "brightness(0.9)" : "brightness(0.3)",
        }}
      >
        {/* Hidden img tag to track load event */}
        <img
          src={bgImage}
          alt="Hero background"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-12 lg:px-16 py-16 space-y-8">
        {" "}
        {/* Added vertical padding */}
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {" "}
          {/* Adjusted for responsiveness */}
          {/* <div className="flex items-center gap-2 rounded-md bg-white/10 p-2 backdrop-blur-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-primary">
              <Shield className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-primary">
              TITANS CAREERS
            </span>
          </div> */}
          {/* <Button
            onClick={() => setShowRegistrationModal(true)}
            className="px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 rounded-full text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105"
          >
            Register for Free Consultation
          </Button> */}
          <Button
            onClick={() => setShowRegistrationModal(true)}
            className="absolute top-14 left-6 md:left-12 lg:left-16 px-4 py-2 bg-secondary text-foreground hover:bg-secondary/90 rounded-full text-sm font-semibold shadow-xl z-[100] transition-all duration-300 hover:scale-105"
          >
            Register for a Free Masterclass
          </Button>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-black md:text-3xl lg:text-6xl">
          At Titans Careers, growth and learning drive us.
Explore opportunities to develop your skills and shape the future with us
        </h1>
        <p className="mt-4 max-w-2xl text-2xl text-gray-800">
          Get job-ready with Titans Careers. Learn global skills today and stand
          out wherever you go.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/courses" className="relative group overflow-hidden">
            <Button className="w-full sm:w-auto px-6 py-6 bg-primary text-foreground hover:bg-transparent hover:text-white hover:border border-primary border rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-300">
              Enrol Now
            </Button>
          </Link>


        </div>
      </div>
      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleCloseModal} // Close modal when clicking backdrop
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking video
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 z-50 text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Video container */}
            <div className="relative w-full">
              <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-2xl">
                <AwsVideoPlayer
                  ref={videoRef}
                  videoUrl="https://titanscareers.s3.eu-north-1.amazonaws.com/media/titanscareers.com.mp4"
                  title="Titans Careers Story"
                  className="w-full h-full min-h-[400px] md:min-h-[500px]"
                  onLoadedData={handleVideoReady}
                />
              </div>
            </div>

            {/* Video title */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">Our Story</h3>
              <p className="text-white/80 text-sm mt-1">
                Discover how Titans Careers is transforming professional
                development
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </section>
  );
}
