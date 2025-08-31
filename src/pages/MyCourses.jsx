"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetEnrolledCoursesQuery,
  useGetCourseProgressDetailsQuery, // ✅ fixed hook name
} from "@/services/coursesApi";

const placeholderImg = "/def.jpg";

// 🟢 Child component handles progress safely
function CourseCard({ course, userId }) {
  const navigate = useNavigate();

  // ✅ Call with both userId and courseId
  const { data: progressData, isLoading: loadingProgress } =
    useGetCourseProgressDetailsQuery({ userId, courseId: course.id });

  const progress = progressData?.percentage ?? 0; // adjust field name if backend differs

  const categoryName = course?.category?.name || "General";
  const levelName = course?.level || "Beginner";
  const instructorName = course?.instructor
    ? `${course.instructor.first_name || ""} ${
        course.instructor.last_name || ""
      }`.trim()
    : "No instructor";

  const imgSrc = course?.course_image
    ? course.course_image.startsWith("http")
      ? course.course_image
      : `${import.meta.env.VITE_BASE_URL}${course.course_image}`
    : placeholderImg;

  return (
    <Card key={course.id}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative ml-3 mt-5 h-48 md:w-64 bg-muted overflow-hidden rounded-lg">
            <img
              src={imgSrc}
              alt={course?.name || "Course image"}
              className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.src = placeholderImg)}
            />
            {progress === 100 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
            )}
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-muted/50">
                {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
              </Badge>
              <Badge variant="outline">
                {levelName.charAt(0).toUpperCase() + levelName.slice(1)}
              </Badge>
            </div>

            <h3 className="text-xl font-bold">
              {course?.name || "Untitled Course"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{instructorName}</p>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                {course?.curriculum?.reduce(
                  (total, module) => total + (module?.video?.length || 0),
                  0
                ) || 0}{" "}
                lessons
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {course?.estimated_time || "N/A"}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Enrolled:{" "}
                {course?.enrolled_date
                  ? new Date(course.enrolled_date).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </div>
            </div>

            {loadingProgress ? (
              <Skeleton className="h-2 w-full mb-2" />
            ) : (
              <>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">
                    {progress}% Complete
                  </span>
                  <Button onClick={() => navigate(`/portal/learn/${course.id}`)}>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    {progress === 0
                      ? "Start Course"
                      : progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  const enrolledCourses = enrolledData?.course || [];

  useEffect(() => {
    if (enrolledData) {
      console.log("Enrolled Courses API Response:", enrolledData);
    }
  }, [enrolledData]);

  // 🟢 No fake progress filter, just pass userId down
  const filteredCourses = useMemo(() => {
    return enrolledCourses;
  }, [enrolledCourses]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Button onClick={() => navigate("/portal/library")}>
            Browse More Courses
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-40 w-full" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-red-500">
                  Error loading your courses
                </h3>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} userId={currentUserId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No courses found</h3>
                <Button onClick={() => navigate("/portal/library")}>
                  Browse Course Library
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
