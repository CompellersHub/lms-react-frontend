import React, { useState } from "react";
import campaign from "/assets/campaign.jpeg";
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
// import { useRegisterForEventMutation } from "@/services/coursesApi";

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

  // // --- Popup registration form state ---
  // const [showPopup, setShowPopup] = useState(true);
  // const [popupName, setPopupName] = useState("");
  // const [popupEmail, setPopupEmail] = useState("");
  // const [popupPhone, setPopupPhone] = useState("");
  // const [popupLoading, setPopupLoading] = useState(false);
  // const [popupStatus, setPopupStatus] = useState(null);

  // const [registerForEvent] = useRegisterForEventMutation();

  // const handlePopupSubmit = async (e) => {
  //   e.preventDefault();
  //   setPopupLoading(true);
  //   setPopupStatus(null);
  //   try {
  //     await registerForEvent({
  //       first_name: popupName,
  //       email: popupEmail,
  //       phone: popupPhone,
  //       // You can add more fields if needed, e.g. course_name
  //     }).unwrap();
  //     setPopupLoading(false);
  //     setPopupStatus("success");
  //     setShowPopup(false);
  //   } catch {
  //     setPopupLoading(false);
  //     setPopupStatus("error");
  //   }
  // };

  return (
    <>
      <Hero />
      <FeaturesBanner />

      {/* Popup Registration Form
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-[95vw] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Quick Registration</DialogTitle>
            <DialogDescription>
              Fill in your details to register quickly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePopupSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="popupName">Full Name</Label>
              <Input
                id="popupName"
                value={popupName}
                onChange={(e) => setPopupName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="popupEmail">Email</Label>
              <Input
                id="popupEmail"
                type="email"
                value={popupEmail}
                onChange={(e) => setPopupEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="popupPhone">Phone</Label>
              <PhoneInputLimited
                id="popupPhone"
                international
                defaultCountry="GB"
                value={popupPhone}
                onChange={setPopupPhone}
                className="rounded-md border px-3 py-2 text-base w-full bg-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full font-sans"
              disabled={popupLoading}
            >
              {popupLoading ? "Registering..." : "Register"}
            </Button>
            {popupStatus === "success" && (
              <p className="text-green-500 text-sm text-center">
                Registration successful!
              </p>
            )}
            {popupStatus === "error" && (
              <p className="text-red-500 text-sm text-center">
                Registration failed. Please try again.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog> */}

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