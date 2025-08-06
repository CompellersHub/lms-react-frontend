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
import { Helmet } from "react-helmet";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Titans Careers - Transform Your Professional Journey</title>
        <meta
          property="og:title"
          content="Titans Careers - Transform Your Professional Journey"
        />
        <meta
          property="og:description"
          content="We eliminate the barriers between your current position and your dream career through industry-relevant skills training, one-on-one coaching, and a supportive network."
        />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://www.titanscareers.com" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <FeaturesBanner />
      <DownloadGuideSection />
      {/* <CompanyLogosCarousel /> */}
      <StatsSection />
      <WhyChooseUs />
      {/* <ProjectsCarousel /> */}
      <CourseIntroVideos />
      <EventsCarousel />
      <PlatformFeatures />
    </>
  );
}

export default HomePage;
