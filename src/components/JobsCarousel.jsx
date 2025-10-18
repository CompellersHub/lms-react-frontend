import { useState, useRef, useCallback } from "react";
import {
  Briefcase,
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
import { useGetJobsQuery } from "@/services/coursesApi";
import { Button } from "@/components/ui/button";

export function JobsCarousel() {
  const sliderRef = useRef(null);
  const [sectionRef] = useInView({ threshold: 0.3 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch all jobs from backend
  const { data: jobs = [] } = useGetJobsQuery();

  const handleBeforeChange = useCallback(() => {}, []);
  const handleAfterChange = useCallback((index) => setCurrentSlide(index), []);
  const goToPrev = useCallback(() => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  }, []);
  const goToNext = useCallback(() => {
    if (sliderRef.current) sliderRef.current.slickNext();
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
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const isPrevArrowDisabled = currentSlide === 0;
  const isNextArrowDisabled = currentSlide >= jobs.length - sliderSettings.slidesToShow;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-primary/10 text-foreground rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Featured Jobs
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Explore Job Openings</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Discover exciting career opportunities and apply to join top companies.
          </p>
        </div>
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className={`font-sans absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none ${isPrevArrowDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            aria-label="Previous slide"
            disabled={isPrevArrowDisabled}
          >
            <ChevronLeft className={`h-6 w-6 ${isPrevArrowDisabled ? "text-gray-400" : "text-primary"}`} />
          </button>
          {/* Slider content area */}
          <div className="mx-6">
            <Slider ref={sliderRef} {...sliderSettings}>
              {jobs.map((job) => (
                <div key={job.id} className="px-3 h-full">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="relative h-48 bg-gray-50 flex items-center justify-center">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name || job.title}
                          className="w-full h-full object-contain p-4"
                          onError={e => (e.target.src = "/placeholder.svg")}
                        />
                      ) : (
                        <Briefcase className="w-16 h-16 text-primary/30" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col">
                      <h3 className="text-lg h-18 sm:h-14 font-bold text-foreground mb-1">
                        {job.title}
                      </h3>
                      <div className="text-xs text-foreground/60 mb-2 font-semibold">
                        {job.company_name}
                      </div>
                      <p className="text-foreground/70 text-base mb-2 line-clamp-2">
                        {job.short_description}
                      </p>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center text-xs text-foreground/70">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center text-xs text-foreground/70">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{job.type || "Full Time"}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center text-xs text-foreground/70">
                            <span className="font-semibold mr-1">Salary:</span> {job.salary}
                          </div>
                        )}
                        {job.application_deadline && (
                          <div className="flex items-center text-xs text-foreground/70">
                            <span className="font-semibold mr-1">Deadline:</span> {new Date(job.application_deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <Link to={`/jobs/${job.id}`}>
                          <Button className="font-sans w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-2 px-4 mt-4">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className={`font-sans absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none ${isNextArrowDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            aria-label="Next slide"
            disabled={isNextArrowDisabled}
          >
            <ChevronRight className={`h-6 w-6 ${isNextArrowDisabled ? "text-gray-400" : "text-primary"}`} />
          </button>
        </div>
        <div className="text-center mt-10">
          <Link
            to="/jobs"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300 font-medium"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
