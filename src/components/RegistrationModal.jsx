import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useRegisterForConsultationMutation,
  useGetAllCoursesQuery,
} from "../services/coursesApi";

export function RegistrationModal({
  isOpen,
  onClose,
  onSuccess = () => {}, // Provide a default empty function
  onError = () => {}, // Provide a default empty function
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState(""); // New state for selected course name
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state for in-form error
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetAllCoursesQuery();
  const [bookConsultation] = useRegisterForConsultationMutation();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setWhatsappNumber("");
    setMessage("");
    setSelectedCourseName(""); // Clear selected course name on reset
    setIsMessageOpen(false);
    setErrorMessage(""); // Clear error message on reset
    setAgreedToTerms(false);
  };

  // Effect to reset form when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (!firstName || !email) {
      setErrorMessage("Please fill in your first name and email.");
      return;
    }

    if (!selectedCourseName) {
      setErrorMessage("Please select a course of interest.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage(
        "You must agree to the Terms and Conditions and Privacy Policy."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        whatsappNumber, // Map to 'whatsapp' as per API
        message,
        course: selectedCourseName, // Include selected course name under the 'course' key
      };
      console.log("Sending payload to backend:", payload); // Log payload

      const response = await bookConsultation(payload);

      if (response.error) {
        throw new Error(
          response.error.data?.message || "Failed to submit consultation"
        );
      }
      onSuccess();
      onClose(); // Close modal only on success
    } catch (error) {
      setErrorMessage(error.message || "Failed to submit consultation");
      onError(error.message || "Failed to submit consultation"); // Still call parent onError for toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Register for Free Consultation</DialogTitle>
          <DialogDescription>
            Fill in your details to book a free consultation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course">Course of Interest</Label>
            <Select
              onValueChange={setSelectedCourseName}
              value={selectedCourseName}
              disabled={isSubmitting || coursesLoading || coursesError}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {coursesLoading && (
                  <SelectItem value="loading" disabled>
                    Loading courses...
                  </SelectItem>
                )}
                {coursesError && (
                  <SelectItem value="error" disabled>
                    Error loading courses
                  </SelectItem>
                )}
                {!coursesLoading && !coursesError && courses?.length === 0 && (
                  <SelectItem value="no-courses" disabled>
                    No courses available
                  </SelectItem>
                )}
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {coursesError && (
              <p className="text-red-500 text-sm">
                Failed to load courses. Please try again later.
              </p>
            )}
          </div>

          <Collapsible
            open={isMessageOpen}
            onOpenChange={setIsMessageOpen}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">Leave a message</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Toggle message section</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp No.</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500} // Limit to 500 characters
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {message.length}/500 characters
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              disabled={isSubmitting}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              !agreedToTerms ||
              !firstName ||
              !email ||
              !selectedCourseName
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
