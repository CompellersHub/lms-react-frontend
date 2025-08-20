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

export function EventRegistrationModal({ isOpen, onClose, event }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(event?.id || "");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formStatus, setFormStatus] = useState({ status: "idle", message: "" });

  const { data: events, isLoading: isLoadingEvents } = useGetEventsQuery();
  const [registerForEvent, { isLoading }] = useRegisterForEventMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventToRegister =
      event || events.find((e) => e.id === selectedEventId);

    if (!eventToRegister) {
      setFormStatus({ status: "error", message: "Please select an event." });
      return;
    }

    try {
      await registerForEvent({
        first_name: firstName,
        email,
        course_name: eventToRegister.course.name,
      }).unwrap();
      setFormStatus({
        status: "success",
        message:
          "🎉 You have been registered successfully! Please check your email for event details.",
      });
      setTimeout(() => {
        onClose();
        setFormStatus({ status: "idle", message: "" });
      }, 2000);
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

          {!event && (
            <div className="grid gap-2">
              <Label htmlFor="event">Event</Label>
              <Select
                onValueChange={setSelectedEventId}
                value={selectedEventId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="max-h-60 max-w-80 md:max-w-fit overflow-y-auto">
                  {isLoadingEvents ? (
                    <SelectItem value="loading" disabled>
                      Loading events...
                    </SelectItem>
                  ) : (
                    events?.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.course.name} -{" "}
                        {parseEventDate(event.date).toLocaleDateString(
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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !agreedToTerms}
          >
            {isLoading ? "Registering..." : "Submit"}
          </Button>

          {formStatus.status === "success" && (
            <p className="text-green-500 text-sm text-center">
              {formStatus.message}
            </p>
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
