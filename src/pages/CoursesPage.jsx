import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, BarChart, Filter } from "lucide-react";
import { useGetAllCoursesQuery } from "../services/coursesApi";
import Spinner from "../components/Spinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useSelector } from "react-redux";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";

function CoursesPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch courses using RTK Query
  const { data: courses = [], isLoading, error } = useGetAllCoursesQuery();

  // Filter courses client-side
  const filteredCourses = useMemo(() => {
    if (!courses.length) return [];

    return courses.filter((course) => {
      // Apply level filter
      const matchesFilter =
        filter === "all" || course.level.toLowerCase() === filter;

      // Apply search filter
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        course.name.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const user = useSelector((state) => state.auth.user);
  const enrolledCourseIds = user?.course?.map((c) => c.id || c) || [];

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Courses"
        message={
          error.status === "FETCH_ERROR"
            ? "Network error. Please check your connection."
            : error.data?.message || "Failed to load courses."
        }
        onRetry={() => window.location.reload()}
        retryLabel="Try Again"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Titans Careers Courses
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Enhance your skills with our industry-leading courses designed by
          experts with decades of experience.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            // Border color and focus ring using primary color
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {/* Using a foreground-like color for the icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-foreground/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Using a foreground-like color for the icon */}
          <Filter className="h-5 w-5 text-foreground/60" />
          {/* Using foreground color for text */}
          <span className="text-foreground/80">Filter by:</span>
          <select
            value={filter}
            onChange={handleFilterChange}
            // Border color and focus ring using primary color
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    // src={`${baseUrl}${course.course_image}`}
                    src={course.course_image}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
                    {course.level}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
                    {course.name}
                  </h3>
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                    {course.description}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 text-foreground/60 mr-1" />
                      <span className="text-sm text-foreground/70">
                        {course.estimated_time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 text-foreground/60 mr-1" />
                      <span className="text-sm text-foreground/70">
                        {course?.curriculum.length} modules
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {course.instructor ? (
                      <>
                        <img
                          src={course.instructor.profile_picture}
                          alt={
                            course.instructor.first_name
                              ? `${course.instructor.first_name} ${course.instructor.last_name}`
                              : "Instructor"
                          }
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <span className="text-sm text-foreground">
                          {course.instructor.first_name &&
                          course.instructor.last_name
                            ? `${course.instructor.first_name} ${course.instructor.last_name}`
                            : "Instructor"}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-foreground/60 italic">
                        "Titans Careers Team"
                      </span>
                    )}
                  </div>

                  {/* <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.rating)
                              ? "text-secondary fill-current"
                              : "text-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-foreground/70 ml-2">
                      ({course.reviews} reviews)
                    </span>
                  </div> */}

                  <div className="mt-auto space-y-3">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={isEnrolled ? undefined : `/courses/${course.id}`}
                    className={`block w-full text-center font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4 ${
                      isEnrolled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-white"
                    }`}
                    style={isEnrolled ? { pointerEvents: "none" } : {}}
                    tabIndex={isEnrolled ? -1 : 0}
                    aria-disabled={isEnrolled}
                  >
                    {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-foreground/80">
              No courses found matching your criteria. Please try a different
              search or filter.
            </p>
          </div>
        )}

        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <img
            src="/assets/masterclass.jpeg"
            alt="Masterclass Registration"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default CoursesPage;
