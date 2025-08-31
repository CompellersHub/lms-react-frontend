import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Shield,
  BarChart2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetEventsQuery } from "@/services/coursesApi";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { parseEventDate } from "@/utils/dateUtils";
import {
  hasLiveSessions,
  getPrimaryLiveSession,
} from "@/utils/liveSessionUtils";
import { LiveIndicator, LiveCardBorder } from "@/components/LiveIndicator";
import { JoinLiveButton, LiveSessionBanner } from "@/components/JoinLiveButton";

export function WorkshopEvents() {
  const { data: events = [] } = useGetEventsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLiveBanner, setShowLiveBanner] = useState(true);

  // Live session state
  const [liveSession, setLiveSession] = useState(null);
  const [hasLive, setHasLive] = useState(false);

  // Check for live sessions on component mount and every minute
  useEffect(() => {
    const checkLiveSessions = () => {
      const isLive = hasLiveSessions();
      const primarySession = getPrimaryLiveSession();
      setHasLive(isLive);
      setLiveSession(primarySession);
    };

    checkLiveSessions();
    const interval = setInterval(checkLiveSessions, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const scrollToWorkshops = () => {
    const element = document.getElementById("upcoming-workshops");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const getIcon = (courseName) => {
    switch (courseName) {
      case "Data Analysis":
        return <BarChart2 className="h-6 w-6" />;
      case "AML/KYC Compliance":
        return <Shield className="h-6 w-6" />;
      case "Business Analysis & Project Management":
        return <Briefcase className="h-6 w-6" />;
      case "Cybersecurity":
        return <Shield className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  // Check if an event matches the live session
  const isEventLive = (event) => {
    if (!liveSession) return false;
    return event.course.name === liveSession.courseName;
  };

  // Handle joining live session
  const handleJoinLive = (session) => {
    window.open(session.zoomLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-background">
      {/* Live Session Banner */}
      {hasLive && showLiveBanner && (
        <LiveSessionBanner
          session={liveSession}
          onJoinClick={handleJoinLive}
          onDismiss={() => setShowLiveBanner(false)}
        />
      )}

      {/* Hero Section */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional Training Series: Expert-Led Workshops
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Intensive masterclasses designed to maximize your professional
            growth and industry expertise
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg"
              onClick={() => handleRegisterClick(null)}
            >
              Register Now
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full text-lg"
              onClick={scrollToWorkshops}
            >
              Learn More
            </Button>
          </div>

          {/* Live Session Join Button */}
          {hasLive && (
            <JoinLiveButton
              session={liveSession}
              onJoinClick={handleJoinLive}
            />
          )}
        </div>
      </div>

      {/* Workshops Grid */}
      <div
        id="upcoming-workshops"
        className="py-16 px-6 md:px-12 lg:px-16 h-fit"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Upcoming Masterclass Events
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event) => {
              const eventIsLive = isEventLive(event);

              return (
                <LiveCardBorder key={event.id} isLive={eventIsLive}>
                  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all h-full flex flex-col justify-between">
                    <div className="flex items-center mb-4 relative">
                      {eventIsLive && (
                        <div className="absolute -top-2 -right-2">
                          <LiveIndicator variant="badge" size="sm" />
                        </div>
                      )}
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {getIcon(event.course.name)}
                      </div>
                      <h3 className="text-xl font-bold line-clamp-1">
                        {event.title}
                      </h3>
                      {eventIsLive && (
                        <div className="ml-2">
                          <LiveIndicator variant="dot" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {parseEventDate(event.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {event.event_excerpt}
                    </p>
                    <div className="flex flex-col gap-2 h-fit space-y-6 mt-4">
                      <div className="h-fit">
                        <h4 className="font-semibold mb-3 text-sm">
                          Workshop Highlights:
                        </h4>

                        <ul className="space-y-2 text-muted-foreground h-fit">
                          {event.workshop.workshop_highlights.map(
                            (highlight, index) => (
                              <li
                                key={index}
                                className="flex items-start text-sm"
                              >
                                <span className="mr-2">•</span>
                                <span>{highlight}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="h">
                        <h4 className="font-semibold mb-2 text-sm">
                          Who Should Attend:
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {event.who_can_attend}
                        </p>
                      </div>

                      <div className="mt-4 h-full">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center text-sm">
                            <User className="h-4 w-4 mr-2" />
                            Meet Your Instructor
                          </h4>
                          <p className="font-medium text-sm mb-1">
                            {event.instructor}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {event.instructor_info}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full align-bottom self-end">
                      <Button
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-2 px-4 mt-4"
                        onClick={() => handleRegisterClick(event)}
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </LiveCardBorder>
              );
            })}
          </div>
        </div>
      </div>

      {/* Registration Info */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Registration Information
          </h2>

          <div className="bg-card p-8 rounded-xl border border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <BookOpen className="h-6 w-6 mr-3 text-primary" />
                <h3 className="text-2xl font-bold">Standard Registration</h3>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <p className="text-primary font-bold text-lg">£500</p>
              </div>
            </div>

            <h4 className="font-semibold mb-4">Includes:</h4>
            <ul className="space-y-4 text-muted-foreground mb-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access to all premium masterclass sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Comprehensive digital learning materials</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Industry-recognized certificate of completion</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Membership in our exclusive alumni network</span>
              </li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className="text-blue-800">
                "This masterclass completely transformed our ML implementation
                approach..."
              </p>
              <p className="font-medium mt-2 text-blue-900">
                — Tobi Oladipupo, Lead Data Scientist
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground md:max-w-lg">
                Early registration is highly recommended as our masterclasses
                consistently reach capacity.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg w-full md:w-auto"
                onClick={() => handleRegisterClick(null)}
              >
                Secure Your Spot Today
              </Button>
            </div>
          </div>
        </div>
      </div>
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
