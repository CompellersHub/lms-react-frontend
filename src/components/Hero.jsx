import { useState } from "react";
import { Play, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EventRegistrationModal } from "./EventRegistrationModal"; // Import the consultation modal component

export function Hero() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false); // New state for registration modal

  return (
    <section className="relative min-h-[500px] h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video background replacing image */}
      <video
        src="https://titanscareers.s3.eu-north-1.amazonaws.com/videos/Meeting+Landing+Page+1.mov"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
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
      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </section>
  );
}
