import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAccessToken } from "../store/slices/authSlice"; // ✅ Correct import

// Base API URL
export const baseUrl =
  import.meta.env.VITE_BASE_URL || "https://api.titanscareers.com";

// Helper: filter upcoming classes based on start date
const filterUpcoming = (data) => {
  if (!Array.isArray(data)) return [];
  const now = new Date();
  return data.filter((cls) => {
    const dateValue =
      cls.start_time || cls.date || cls.startDate || cls.start || null;
    const start = dateValue ? new Date(dateValue) : null;
    return start instanceof Date && !isNaN(start) && start > now;
  });
};

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = selectAccessToken(getState());
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.error("Error preparing headers:", err);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Course",
    "Assignment",
    "Order",
    "Library",
    "Certificate",
    "Progress",
    "Profile",
    "LiveClass",
    "Event",
    "Consultation",
  ],
  endpoints: (builder) => ({
    // 📚 Courses
    getAllCourses: builder.query({
      query: () => "/courses/courses/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    getCourseById: builder.query({
      query: (id) => `/courses/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    getCoursesByCategory: builder.query({
      query: (category) => `/courses/courses?category=${category}`,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "CATEGORY" },
            ]
          : [{ type: "Course", id: "CATEGORY" }],
    }),

    searchCourses: builder.query({
      query: (searchTerm) => `/courses/courses?search=${searchTerm}`,
      providesTags: [{ type: "Course", id: "SEARCH" }],
    }),

    // 📝 Assignments
    getAllAssignments: builder.query({
      query: () => "/courses/assignments/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Assignment", id })),
              { type: "Assignment", id: "LIST" },
            ]
          : [{ type: "Assignment", id: "LIST" }],
    }),

    getAssignmentById: builder.query({
      query: (id) => `/courses/assignments/${id}/`,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),

    // ✅ Assignments per student course (with submitted flag)
    getAssignmentsForStudentCourse: builder.query({
      async queryFn({ userId, courseId }, _queryApi, _extraOptions, baseQuery) {
        const studentRes = await baseQuery(`/customuser/student/${userId}/`);
        if (studentRes.error) return { error: studentRes.error };

        const assignmentRes = await baseQuery(`/courses/assignments/`);
        if (assignmentRes.error) return { error: assignmentRes.error };

        const studentCourses = studentRes.data?.enrolled_courses || [];
        const studentSubmissions = studentRes.data?.submissions || [];
        const allAssignments = assignmentRes.data || [];

        const filteredAssignments = allAssignments
          .filter((a) => String(a.course?.id) === String(courseId))
          .map((assignment) => {
            const submitted = studentSubmissions.some(
              (s) => String(s.assignment) === String(assignment.id)
            );
            return { ...assignment, submitted };
          });

        return { data: filteredAssignments };
      },
      providesTags: (result, error, { courseId }) => [
        { type: "Assignment", id: `STUDENT-COURSE-${courseId}` },
      ],
    }),

    submitAssignment: builder.mutation({
      query: (submissionData) => {
        const formData = new FormData();
        formData.append("assignment_id", submissionData.assignment);
        if (submissionData.file) formData.append("file", submissionData.file);
        if (submissionData.feedback)
          formData.append("feedback", submissionData.feedback);

        return {
          url: `/courses/submission/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Assignment", id: "LIST" },
        { type: "Assignment", id: `STUDENT-COURSE-${courseId}` },
      ],
    }),

    // 📦 Orders & Enrollment
    getEnrolledCourses: builder.query({
      query: (id) => `/customuser/student/${id}/`,
      providesTags: ["Order"],
    }),

    // 📊 Progress
    getCourseProgressDetails: builder.query({
      query: ({ userId, courseId }) =>
        `/customuser/user-course-progress/${userId}/${courseId}/`,
      providesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),

    // 📚 Library
    getAllLibraryMaterials: builder.query({
      query: () => "/courses/courselibrary/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Library", id })),
              { type: "Library", id: "LIST" },
            ]
          : [{ type: "Library", id: "LIST" }],
    }),

    getLibraryMaterialById: builder.query({
      query: (id) => `/courses/courselibrary/${id}/`,
      providesTags: (result, error, id) => [{ type: "Library", id }],
    }),

    // 🎓 Certificates
    generateCertificate: builder.mutation({
      query: () => ({
        url: "/courses/GenerateCertificate/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return {
            blob,
            filename: response.headers.get("content-disposition"),
          };
        },
      }),
      transformResponse: (response) => ({
        blob: response.blob,
        filename: response.filename,
        timestamp: new Date().toISOString(),
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Certificate generation failed:", error);
        }
      },
      transformErrorResponse: (error) => ({
        error:
          error.status === 404
            ? "Certificate not found"
            : "Failed to generate certificate",
        status: error.status,
        data: error.data,
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    checkCertificateAvailability: builder.query({
      query: ({ courseId, userId }) =>
        `/courses/certificates/check/${courseId}/${userId}/`,
      providesTags: (result, error, { courseId, userId }) => [
        { type: "Certificate", id: `${courseId}-${userId}` },
      ],
    }),

    // 🎥 Live Classes
    getAllLiveClasses: builder.query({
      query: () => `/courses/CreateLiveClass/`,
      providesTags: [{ type: "LiveClass", id: "ALL" }],
    }),

    getUpcomingLiveClasses: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(`/courses/CreateLiveClass/`);
        if (result.error) return { error: result.error };
        return { data: filterUpcoming(result.data) };
      },
      providesTags: [{ type: "LiveClass", id: "UPCOMING" }],
    }),

    getLiveClassById: builder.query({
      query: (id) => `/courses/CreateLiveClass/${id}/`,
      providesTags: (result, error, id) => [{ type: "LiveClass", id }],
    }),

    // 👤 Student Profile
    getStudentProfile: builder.query({
      query: () => `/student_profile/profile/`,
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    // 📅 Events
    getEvents: builder.query({
      query: () => "/courses/event/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Event", id })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),

    registerForEvent: builder.mutation({
      query: (body) => ({
        url: "/courses/event-register/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    // 📞 Consultations
    registerForConsultation: builder.mutation({
      query: (body) => ({
        url: "/courses/consultations/",
        method: "POST",
        body: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          whatsapp: body.whatsappNumber,
          message: body.message,
          course: body.course,
        },
      }),
      invalidatesTags: ["Consultation"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCategoryQuery,
  useSearchCoursesQuery,
  useGetAllAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentsForStudentCourseQuery,
  useSubmitAssignmentMutation,
  useGetEnrolledCoursesQuery,
  useGetCourseProgressDetailsQuery,
  useGetAllLibraryMaterialsQuery,
  useGetLibraryMaterialByIdQuery,
  useGenerateCertificateMutation,
  useCheckCertificateAvailabilityQuery,
  useGetAllLiveClassesQuery,
  useGetUpcomingLiveClassesQuery,
  useGetLiveClassByIdQuery,
  useGetStudentProfileQuery,
  useGetEventsQuery,
  useRegisterForEventMutation,
  useRegisterForConsultationMutation,
} = coursesApi;
