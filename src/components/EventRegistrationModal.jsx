import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRegisterForEventMutation,
  useGetEventsQuery,
} from "@/services/coursesApi";
import { Checkbox } from "./ui/checkbox";
import { parseEventDate } from "@/utils/dateUtils";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


export function EventRegistrationModal({ isOpen, onClose, event, simple = false }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(event?.id || "");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formStatus, setFormStatus] = useState({ status: "idle", message: "" });

  const { data: events, isLoading: isLoadingEvents } = useGetEventsQuery();
  const [registerForEvent, { isLoading }] = useRegisterForEventMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let eventToRegister = null;
    if (simple) {
      eventToRegister = null;
    } else {
      eventToRegister = event || events.find((e) => e.id === selectedEventId);
      if (!eventToRegister) {
        setFormStatus({ status: "error", message: "Please select an event." });
        return;
      }
    }
    try {
      await registerForEvent({
        first_name: firstName,
        email,
        phone_number: phone ? phone.replace(/\s/g, '') : '', // use phone_number key
        course_name: simple ? "Cybersecurity" : (eventToRegister && eventToRegister.course?.name ? eventToRegister.course.name : ""),
      }).unwrap();
      setFormStatus({
        status: "success",
        message:
          "🎉 You have been registered successfully! Please check your email for event details.",
      });
      setTimeout(() => {
        onClose();
        setFormStatus({ status: "idle", message: "" });
        setFirstName("");
        setEmail("");
        setPhone("");
        setSelectedEventId(event?.id || "");
        setAgreedToTerms(false);
      }, 10000);
    } catch (error) {
      setFormStatus({
        status: "error",
        message: "Registration failed. Please try again.",
      });
      console.error("Failed to register for event:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for a Free Masterclass</DialogTitle>
          <DialogDescription>
            Fill in your details to register for a free masterclass.
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Phone">Phone</Label>
            <PhoneInput
              id="Phone"
              international
              defaultCountry="GB"
              value={phone}
              onChange={setPhone}
              className="rounded-md border px-3 py-2 text-base w-full bg-white"
              placeholder="Enter phone number"
              required
            />
          </div>
          {/* <div className="flex flex-col items-center mt-2 mb-2">
            <a
              href="https://chat.whatsapp.com/LbqHFDSOHT93o2cK1B4bBy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow transition-colors duration-200 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.818-2.236A12.96 12.96 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.97 0-3.85-.57-5.44-1.56l-.39-.23-4.64 1.33 1.33-4.64-.23-.39A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.1c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.2 5.08 4.36.71.25 1.26.4 1.69.51.71.18 1.36.16 1.87.1.57-.07 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/>
              </svg>
              Join our WhatsApp community to get started
            </a>
            <span className="text-xs text-gray-500 mt-1">Get instant support and updates</span>
          </div> */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
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
          {!simple && !event && (
            <div className="grid gap-2">
              <Label htmlFor="event">Event</Label>
              <Select
                onValueChange={setSelectedEventId}
                value={selectedEventId}
              >
                <SelectTrigger className="w-full overflow-hidden">
                  <SelectValue
                    placeholder="Select an event"
                    className="truncate max-w-full"
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60 max-w-80 overflow-y-auto">
                  {isLoadingEvents ? (
                    <SelectItem value="loading" disabled>
                      Loading events...
                    </SelectItem>
                  ) : (
                    events?.map((event) => (
                      <SelectItem
                        key={event.id}
                        value={event.id}
                        className="max-h-60 max-w-80 overflow-y-auto"
                      >
                        {event.course?.name} -{" "}
                        {event?.date && parseEventDate(event.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            type="submit"
            className="w-full font-sans"
            disabled={isLoading || !agreedToTerms}
          >
            {isLoading ? "Registering..." : "Submit"}
          </Button>
          {formStatus.status === "success" && (
            <>
              <p className="text-green-500 text-sm text-center">
                {formStatus.message}
              </p>
              {/* WhatsApp link section: only show after successful registration */}
              <div className="flex flex-col items-center mt-2 mb-2">
                <a
                  href={selectedEventId === events?.[0]?.id
                    ? "https://chat.whatsapp.com/LbqHFDSOHT93o2cK1B4bBy"
                    : "https://chat.whatsapp.com/BJnvGHfLUsxKsfAzKUrpxt"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow transition-colors duration-200 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.818-2.236A12.96 12.96 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.97 0-3.85-.57-5.44-1.56l-.39-.23-4.64 1.33 1.33-4.64-.23-.39A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.1c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.2 5.08 4.36.71.25 1.26.4 1.69.51.71.18 1.36.16 1.87.1.57-.07 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/>
                  </svg>
                  Join our WhatsApp community to get started
                </a>
                <span className="text-xs text-gray-500 mt-1">Get instant support and updates</span>
              </div>
            </>
          )}
          {formStatus.status === "error" && (
            <p className="text-red-500 text-sm text-center">
              {formStatus.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
