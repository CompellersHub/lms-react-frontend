import React, { useState, useEffect } from "react";
import campaign from "/assets/campaign.jpeg";
// import popupImage from "/assets/illustrations/popup.jpeg";
import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { CompanyLogosCarousel } from "@/components/CompanyLogosCarousel";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { StatsSection } from "@/components/StatsSection";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { CourseIntroVideos } from "@/components/CourseIntroVideos";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { EventsCarousel } from "@/components/EventsCarousel";
import DownloadGuideSection from "@/components/DownloadGuideSection";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { RegistrationModal } from "@/components/RegistrationModal";
import { ConsultationSuccessModal } from "@/components/ConsultationSuccessModal";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";

// --- Add this import for the popup modal ---
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PhoneInputLimited from "@/components/ui/PhoneInputLimited";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isConsultationSuccessModalOpen, setIsConsultationSuccessModalOpen] = useState(false);
  // const [showEventModal, setShowEventModal] = useState(false);
  // const [showImagePopup, setShowImagePopup] = useState(false);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   if (params.get("promo") === "true") {
  //     setShowImagePopup(true);
  //   } else {
  //     const timer = setTimeout(() => {
  //       setShowImagePopup(true);
  //     }, 10000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  return (
    <>
      <Hero />
      <FeaturesBanner />

      {/*
      Popup image modal with blur background and transition
      {showImagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowImagePopup(false)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <img
              src={popupImage}
              alt="Add new skills to your toolbox"
              className="w-full h-auto object-contain mb-4 cursor-pointer rounded-xl"
              style={{ maxWidth: '600px' }}
              onClick={() => {
                setShowImagePopup(false);
                setShowEventModal(true);
              }}
            />
          </div>
        </div>
      )}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <EventRegistrationModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        simple={false}
      />
      */}
      <ReviewsCarousel />
      <DownloadGuideSection />
      <CompanyLogosCarousel />
      <StatsSection />
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[60vh] h-[60vh] flex items-center justify-center bg-white overflow-hidden">
        <img 
          src={campaign} 
          alt="campaign" 
          className="w-full h-full object-cover" 
          style={{ display: 'block' }}
          onClick={() => setIsModalOpen(true)}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="font-sans absolute bottom-8 right-8 px-6 py-3 bg-primary text-white rounded-xl shadow-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-200 z-10"
        >
          Register
        </button>
      </div>
      <WhyChooseUs />
      {/* <ProjectsCarousel /> */}
      <CourseIntroVideos />
      {/* Consultation Banner - Panoramic Video with Button Inside */}
      <div
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[56vh] h-[56vh] flex items-center justify-center bg-black overflow-hidden"
      >
        <video
          src="https://titanscareers.s3.eu-north-1.amazonaws.com/videos/VID-20250917-WA0087.mp4"
          poster="/assets/consultation.png"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <button
          onClick={() => setIsConsultationModalOpen(true)}
          className=" absolute bottom-10 left-10 px-10 py-4 bg-primary text-white rounded-full shadow-lg text-xl font-bold hover:bg-primary/90 transition-all duration-200 z-10 font-sans"
        >
          Book a Free Consultation
        </button>
      </div>
      <EventsCarousel />
      <PlatformFeatures />
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <RegistrationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onSuccess={() => {
          setIsConsultationModalOpen(false);
          setIsConsultationSuccessModalOpen(true);
        }}
      />
      <ConsultationSuccessModal
        isOpen={isConsultationSuccessModalOpen}
        onClose={() => setIsConsultationSuccessModalOpen(false)}
      />
    </>
  );
}

export default HomePage;