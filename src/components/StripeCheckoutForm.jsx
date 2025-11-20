import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNotifyStripePaymentSuccessMutation } from "@/services/api";
import { setPaymentStatus, setOrderId } from "@/store/slices/cartSlice";
import { addCourseToUser } from "@/store/slices/authSlice";
import Modal from "./Modal";
import { toast } from "sonner";

// Convert country name to ISO 3166-1 alpha-2 code
const convertCountryToCode = (country) => {
  const countryCodes = {
    "United Kingdom": "GB",
    "United States": "US",
    Canada: "CA",
    Australia: "AU",
    Germany: "DE",
    France: "FR",
    Spain: "ES",
    Italy: "IT",
    Nigeria: "NG",
    India: "IN",
    Brazil: "BR",
    Japan: "JP",
    China: "CN",
    "South Africa": "ZA",
    "New Zealand": "NZ",
    "South Korea": "KR",
    Netherlands: "NL",
    Sweden: "SE",
    Switzerland: "CH",
    Belgium: "BE",
    Russia: "RU",
    Mexico: "MX",
    // Add more mappings as needed
  };
  return countryCodes[country] || "GB"; // Default to GB if not found
};

const StripeCheckoutForm = ({
  clientSecret,
  cartTotal,
  cartItems,
  billingInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Get user from Redux for course enrollment
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Stripe payment notify API
  const [notifyPaymentSuccess] = useNotifyStripePaymentSuccessMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Stripe handleSubmit started");

    if (!stripe || !elements || !clientSecret || isSubmitting) {
      console.log("❌ Stripe validation failed:", {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret,
        isSubmitting,
      });
      return;
    }

    // Authentication check
    if (!isAuthenticated || !user?.id) {
      console.log("❌ Authentication check failed");
      setModalMessage("Please log in to complete your purchase");
      setModalOpen(true);
      navigate("/login");
      return;
    }

    console.log("✅ Starting Stripe payment processing...");
    setIsSubmitting(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.log("❌ CardElement not found");
      setModalMessage("Card input not found. Please refresh.");
      setModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("🔄 Calling stripe.confirmCardPayment...");
      console.log("  Client Secret:", clientSecret);
      console.log("  Billing Info:", billingInfo);

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${billingInfo.firstName} ${billingInfo.lastName}`,
              email: billingInfo.email,
              address: {
                line1: billingInfo.address,
                city: billingInfo.city,
                postal_code: billingInfo.postalCode,
                country: convertCountryToCode(billingInfo.country),
              },
            },
          },
        }
      );

      console.log("✅ stripe.confirmCardPayment completed");
      console.log("💳 Payment Intent:", paymentIntent);
      console.log("❌ Error (if any):", error);

      if (error) {
        setModalMessage(error.message || "Payment failed");
        setModalOpen(true);
        console.error("Payment error:", error);
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("✅ Stripe payment succeeded, notifying backend...");

        try {
          // Notify backend of successful payment for enrollment
          console.log("📤 Sending to backend:", {
            paymentIntentId: paymentIntent.id,
          });

          const response = await notifyPaymentSuccess({
            paymentIntentId: paymentIntent.id,
          }).unwrap();

          console.log("✅ Backend notification successful:", response);

          // Update Redux state
          dispatch(setPaymentStatus("success"));
          dispatch(setOrderId(paymentIntent.id));
          // DON'T clear cart here - let OrderConfirmationPage do it

          // Add course to user in Redux
          if (cartItems[0]) {
            dispatch(
              addCourseToUser({
                id: cartItems[0].id,
                name: cartItems[0].name,
              })
            );
          }

          toast.success("Payment successful! Course access granted.");

          console.log(
            "🚀 About to navigate to:",
            `/order-confirmation/${paymentIntent.id}`
          );

          // Use window.location for reliable navigation (same as PayPal)
          console.log("🔄 Using window.location navigation...");
          window.location.href = `/order-confirmation/${paymentIntent.id}`;

          console.log("✅ Navigation called successfully!");
        } catch (backendError) {
          console.error("❌ Backend notification failed:", backendError);

          // Still navigate but show warning
          toast.warning(
            backendError.message ||
              "Payment succeeded but enrollment may be delayed. Please contact support if needed."
          );

          // Use window.location for reliable navigation (fallback)
          console.log("🔄 Using window.location navigation (fallback)...");
          window.location.href = `/order-confirmation/${paymentIntent.id}`;

          console.log("✅ Fallback navigation called!");
        }
      } else {
        setModalMessage("Payment was not completed. Please try again.");
        setModalOpen(true);
      }
    } catch (err) {
      setModalMessage("Something went wrong. Please try again.");
      setModalOpen(true);
      console.error("❌ Unexpected error during payment:", err);
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    } finally {
      console.log("🔄 Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
        {/* Stripe payment amount is enforced from cartTotal and cannot be changed by the user. Frontend is compliant. Backend should also validate the amount. */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          disabled={!stripe || isSubmitting}
        >
          {isSubmitting ? "Processing..." : `Pay £${cartTotal}`}
        </button>
      </form>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Payment Error</h2>
          <p className="mb-4">{modalMessage}</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default StripeCheckoutForm;
