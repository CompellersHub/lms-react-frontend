import React, { useState } from "react";
import campaign from "/assets/campaign.png";
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

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isConsultationSuccessModalOpen, setIsConsultationSuccessModalOpen] =
    useState(false);

  return (
    <>
      <Hero />
      <FeaturesBanner />
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        <img src={campaign} alt="campaign" />
      </div>
      <DownloadGuideSection />
      <CompanyLogosCarousel />
      <StatsSection />
      <WhyChooseUs />
      {/* <ProjectsCarousel /> */}
      <CourseIntroVideos />
      {/* Consultation Banner */}
      <div
        onClick={() => setIsConsultationModalOpen(true)}
        className="cursor-pointer"
      >
        <img
          src="/assets/consultation.png"
          alt="Book a Free Consultation"
          className=""
        />
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
