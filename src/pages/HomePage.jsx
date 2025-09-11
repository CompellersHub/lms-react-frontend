import React, { useState } from "react";
import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { CompanyLogosCarousel } from "@/components/CompanyLogosCarousel";
// import PartnerShowcase from "@/components/PartnerShowcase";
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

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isConsultationSuccessModalOpen, setIsConsultationSuccessModalOpen] =
    useState(false);

  return (
    <>
      <Hero />
      <FeaturesBanner />
      <ReviewsCarousel />
      
      <DownloadGuideSection />
      <CompanyLogosCarousel />
      <StatsSection />
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[60vh] h-[60vh] flex items-center justify-center bg-white overflow-hidden">
        <video
          src="https://titanscareers.s3.eu-north-1.amazonaws.com/videos/Meeting+Landing+Page+1.mov"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-8 right-8 px-6 py-3 bg-primary text-white rounded-full shadow-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-200 z-10"
        >
          Register
        </button>
      </div>
      <WhyChooseUs />
      {/* <ProjectsCarousel /> */}
      <CourseIntroVideos />
      {/* Consultation Banner */}
      <div
        onClick={() => setIsConsultationModalOpen(true)}
        className="cursor-pointer relative w-full min-h-[240px] flex items-center justify-center overflow-hidden"
      >
        <video
          src="https://titanscareers.s3.eu-north-1.amazonaws.com/videos/Free+Registration+Masterclass.mov"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-7xl font-bold drop-shadow-lg">Book a Free Consultation</span>
          
        </div>
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
