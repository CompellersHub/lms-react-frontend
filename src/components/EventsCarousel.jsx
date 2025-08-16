import { useState, useRef, useCallback } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "../hooks/useInView";
import { useGetEventsQuery } from "@/services/coursesApi";
import { EventRegistrationModal } from "./EventRegistrationModal";
import { Button } from "@/components/ui/button";

export function EventsCarousel() {
  const sliderRef = useRef(null);
  const [sectionRef] = useInView({ threshold: 0.3 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch all events from backend
  const { data: events = [] } = useGetEventsQuery();

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleBeforeChange = useCallback(() => {
    // Additional logic before slide change if needed
  }, []);

  const handleAfterChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const goToPrev = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  }, []);

  const goToNext = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const isPrevArrowDisabled = currentSlide === 0;
  const isNextArrowDisabled =
    currentSlide >= events.length - sliderSettings.slidesToShow;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-primary/10 text-foreground rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Upcoming Events
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Join Our Events
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Participate in our workshops, seminars, and masterclasses to enhance
            your skills and network with industry professionals.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none
                     ${
                       isPrevArrowDisabled
                         ? "cursor-not-allowed opacity-50"
                         : ""
                     }`}
            aria-label="Previous slide"
            disabled={isPrevArrowDisabled}
          >
            <ChevronLeft
              className={`h-6 w-6 ${
                isPrevArrowDisabled ? "text-gray-400" : "text-primary"
              }`}
            />
          </button>

          {/* Slider content area */}
          <div className="mx-6">
            <Slider ref={sliderRef} {...sliderSettings}>
              {events.map((event) => {
                return (
                  <div key={event.id} className="px-3 h-full">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full">
                      <div className="relative h-48 bg-gray-50">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />

                        {/* Hover overlay with enrollment status and cart button */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            className="w-full bg-primary hover:bg-primary/80 text-white text-xs py-1 px-2"
                            onClick={() => handleRegisterClick(event)}
                          >
                            Register
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col">
                        <h3 className="text-lg h-14 font-bold text-foreground mb-3">
                          {event.title}
                        </h3>
                        <p className="text-foreground/70 text-base mb-4 line-clamp-2">
                          {event.event_excerpt}
                        </p>

                        {/* Instructor Info */}
                        {event.instructor && (
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-primary">
                              INSTRUCTOR:{" "}
                            </span>
                            <span className="text-xs text-foreground font-bold">
                              {event.instructor}
                            </span>
                          </div>
                        )}

                        {/* Event Details */}
                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-foreground/70">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-foreground/70">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {event.start_time} - {event.end_time}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-foreground/70">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>Virtual</span>
                          </div>
                        </div>

                        {/* Course Info */}
                        {event.course && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-sm font-medium text-foreground mt-1">
                              {event.course.name}
                            </div>
                            {event.course.level && (
                              <div className="text-xs text-foreground/60 mt-1">
                                Level: {event.course.level}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="mt-auto">
                          <Button
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-2 px-4 mt-4"
                            onClick={() => handleRegisterClick(event)}
                          >
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none
                     ${
                       isNextArrowDisabled
                         ? "cursor-not-allowed opacity-50"
                         : ""
                     }`}
            aria-label="Next slide"
            disabled={isNextArrowDisabled}
          >
            <ChevronRight
              className={`h-6 w-6 ${
                isNextArrowDisabled ? "text-gray-400" : "text-primary"
              }`}
            />
          </button>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/events"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300 font-medium"
          >
            View All Events
          </Link>
        </div>
      </div>
      {selectedEvent && (
        <EventRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </section>
  );
}
