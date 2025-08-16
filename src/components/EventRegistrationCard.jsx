import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCoursesQuery } from "@/services/coursesApi";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EventRegistrationCard({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const { data: courses, isLoading } = useGetAllCoursesQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ firstName, email, course });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 w-full max-w-sm p-6 bg-white rounded-xl shadow-xl border border-gray-200 z-50
                   md:bottom-6 md:right-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Register for free Masterclass
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your name"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-gray-700">
              Course
            </Label>
            <Select onValueChange={setCourse} value={course}>
              <SelectTrigger className="focus:ring-2 ">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    <span className="text-gray-500">Loading courses...</span>
                  </SelectItem>
                ) : (
                  courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <span className="truncate">{course.title}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full transition-colors duration-300"
          >
            Register
          </Button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
