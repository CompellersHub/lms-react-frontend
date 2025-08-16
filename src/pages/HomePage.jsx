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
import { EventRegistrationCard } from "@/components/EventRegistrationCard";

function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <>
      <Hero />
      <FeaturesBanner />
      <div onClick={() => setShowRegistration(true)} className="cursor-pointer">
        <img src={campaign} alt="campaign" />
      </div>
      <DownloadGuideSection />
      <CompanyLogosCarousel />
      <StatsSection />
      <WhyChooseUs />
      {/* <ProjectsCarousel /> */}
      <CourseIntroVideos />
      <EventsCarousel />
      <PlatformFeatures />
      {showRegistration && (
        <EventRegistrationCard
          className="animate-fade-in-up"
          onClose={() => setShowRegistration(false)}
        />
      )}
    </>
  );
}

export default HomePage;
