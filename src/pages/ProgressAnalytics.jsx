"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetEnrolledCoursesQuery,
  useGetAssignmentsForStudentCourseQuery,
  useGetCourseProgressDetailsQuery,
} from "@/services/coursesApi";
import {
  BarChart,
  Calendar,
  Clock,
  GraduationCap,
  LineChart,
  PieChart,
} from "lucide-react";
import CourseProgressDetail from "@/components/dashboard/course-progress-detail";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const placeholderImg = "/placeholder.png";

export default function ProgressAnalytics() {
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  const enrolledCourses = enrolledData?.course || [];

  // --- Fetch assignments for deadlines ---
  const { data: assignmentsData } =
    useGetAssignmentsForStudentCourseQuery(
      { userId: currentUserId, courseId: null }, // null = fetch all
      { skip: !currentUserId }
    );

  const upcomingDeadlines = useMemo(() => {
    if (!assignmentsData) return [];
    const now = new Date();
    return assignmentsData
      .filter((a) => a.due_date && new Date(a.due_date) > now)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);
  }, [assignmentsData]);

  // --- Fetch weekly learning activity ---
  const { data: progressData } = useGetCourseProgressDetailsQuery(
    { userId: currentUserId, courseId: enrolledCourses[0]?.id },
    { skip: !currentUserId || !enrolledCourses.length }
  );

  // Example transformation → group by week
  const weeklyActivity = useMemo(() => {
    if (!progressData?.activity_log) return [];
    const grouped = {};
    progressData.activity_log.forEach((log) => {
      const week = new Date(log.date).toLocaleDateString("en-US", {
        week: "numeric",
      });
      grouped[week] = (grouped[week] || 0) + log.hours;
    });
    return Object.entries(grouped).map(([week, hours]) => ({
      week,
      hours,
    }));
  }, [progressData]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Progress & Analytics</h1>
          <Button onClick={() => navigate("/portal/courses")}>
            View My Courses
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="courses"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Course Progress</TabsTrigger>
            <TabsTrigger value="analytics">Learning Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* --- Course Progress --- */}
          <TabsContent value="courses" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  Track your progress across all enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full mb-4" />
                  ))
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-500">Error loading your courses</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="space-y-2">
                    {enrolledCourses.map((course) => (
                      <CourseProgressDetail
                        key={course.id}
                        courseId={course.id}
                        courseName={course.name}
                        courseImage={course.course_image || placeholderImg}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet
                    </p>
                    <Button onClick={() => navigate("/portal/library")}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Analytics Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Learning Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {weeklyActivity.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="hours" stroke="#8884d8" />
                      </ReLineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <LineChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">
                        No activity recorded yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] overflow-y-auto space-y-3">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map((a) => (
                      <div
                        key={a.id}
                        className="p-3 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(a.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/portal/assignments/${a.id}`)
                          }
                        >
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">
                        No upcoming deadlines
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
