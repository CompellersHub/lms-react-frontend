import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, ShieldCheck, Award, Clock, CreditCard } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ErrorBoundary } from "react-error-boundary";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckoutProtection from "@/components/CheckoutProtection";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import PayPalCheckoutForm from "@/components/PayPalCheckoutForm";
import Modal from "@/components/Modal";

// Redux
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
} from "@/store/slices/cartSlice";

// API
import { useCreateStripePaymentIntentMutation, baseUrl } from "@/services/api";

// PayPal Services
import { getCourseFromCart } from "@/services/paypalService";

// Initialize Stripe outside of the component to avoid re-creating the object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const accessToken = useSelector(state => state.auth.accessToken);

  // State for managing payment method and Stripe client secret
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // 'paypal' or 'stripe'
  const [clientSecret, setClientSecret] = useState("");
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
  });
  // Add state for bank transfer
  const [bankRef, setBankRef] = useState("");
  const [bankFile, setBankFile] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankDesc, setBankDesc] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  // const [showPendingModal, setShowPendingModal] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "", message: "" });

  // RTK Query mutations
  const [createStripePaymentIntent, { isLoading: isCreatingStripeIntent }] =
    useCreateStripePaymentIntentMutation();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/courses");
      toast.error("Cart is empty. Please add courses to checkout.");
    }
  }, [cartItems, navigate]);

  // Create PaymentIntent for Stripe when the user selects the card option
  useEffect(() => {
    if (paymentMethod === "stripe" && cartTotal > 0) {
      createStripePaymentIntent({
        amount: Math.round(cartTotal * 100), // Convert to cents/pence
        currency: "gbp",
        course_id: cartItems[0]?.id, // Assuming single course in cart
      })
        .unwrap()
        .then((data) => {
          console.log("Stripe Payment Intent created:", data);
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Stripe Payment Intent creation error:", error);
          toast.error("Could not initialize Stripe payment. Please try again.");
        });
    }
  }, [paymentMethod, cartTotal, createStripePaymentIntent, cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    // If cart becomes empty, navigate away
    if (cartItems.length === 1) {
      navigate("/courses");
    }
  };

  // Stripe appearance and options
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  };

  const isFormValid = () => {
    return (
      billingInfo.firstName.trim() &&
      billingInfo.lastName.trim() &&
      billingInfo.email.trim() &&
      billingInfo.email.includes("@")
    );
  };

  // Get current course for display
  const currentCourse = getCourseFromCart(cartItems);

  // If no course, show fallback UI
  if (!currentCourse) {
    return (
      <CheckoutProtection>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              No course selected
            </h2>
            <p className="text-lg mb-4">
              Please add a course to your cart before checking out.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/courses")}
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </CheckoutProtection>
    );
  }

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    components: "buttons",
  };

  function PaymentErrorFallback({ error }) {
    return (
      <div className="p-4 text-center text-red-600">
        <h4 className="font-bold mb-2">Payment Error</h4>
        <div>{error.message}</div>
        <div className="mt-2 text-sm">
          Please refresh or try another payment method.
        </div>
      </div>
    );
  }

  // Guard all usages of currentCourse
  return (
    <CheckoutProtection>
      <div className="w-full min-h-screen ml-[2px] mr-[2px] px-0 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12" style={{background: 'linear-gradient(135deg, #ffe29e 0%, #a1c4fd 60%, #e0e7ff 100%)'}}>
        {/* Left: Information & Billing */}
        <div className="lg:col-span-2 rounded-2xl shadow-xl p-8" style={{background: 'linear-gradient(135deg, #ffe29e 0%, #a1c4fd 60%, #e0e7ff 100%)'}}>
          <h1 className="text-3xl font-bold mb-8 text-primary">Checkout</h1>
          {/* Information */}
          <div className="mb-8">
            <label className="block text-base font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={billingInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg mb-2"
              required
            />
            <div className="text-xs text-blue-600">
              Please send me emails with exclusive info
            </div>
          </div>
          {/* Billing Address */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  House number and street name
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  Town / City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={billingInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  Zip code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={billingInfo.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-base font-semibold text-gray-700 mb-2"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-lg"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Order & Payment */}
        <div className="lg:col-span-1 rounded-2xl shadow-xl p-0 overflow-hidden" style={{background: 'linear-gradient(135deg, #ffe29e 0%, #a1c4fd 60%, #e0e7ff 100%)'}}>
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Your Order</h2>
            {currentCourse && (
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentCourse.image}
                  alt={currentCourse.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-lg">{currentCourse.name}</h3>
                  <p className="text-sm text-gray-500">
                    Level: {currentCourse.level}
                  </p>
                </div>
                <div className="ml-auto font-bold text-xl text-primary">
                  £{currentCourse.price}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => handleRemoveFromCart(currentCourse.id)}
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t font-semibold text-lg mb-6">
              <span>Subtotal:</span>
              <span>£{currentCourse ? currentCourse.price : 0}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mb-6">
              <span>Total:</span>
              <span>£{currentCourse ? currentCourse.price : 0}</span>
            </div>
            {/* Colorful Payment Method Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all text-lg ${paymentMethod === "paypal" ? "bg-blue-100 border-blue-500 text-blue-700 shadow" : "bg-white border-gray-200 hover:border-blue-300"}`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-6 w-6" />
                  PayPal
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all text-lg ${paymentMethod === "stripe" ? "bg-blue-50 border-blue-600 text-blue-800 shadow" : "bg-white border-gray-200 hover:border-blue-300"}`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  Card
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all text-lg ${paymentMethod === "transfer" ? "bg-green-100 border-green-500 text-green-700 shadow" : "bg-white border-gray-200 hover:border-green-300"}`}
                  onClick={() => setPaymentMethod("transfer")}
                >
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>
                  Bank Transfer
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all text-lg ${paymentMethod === "payl8r" ? "bg-yellow-100 border-yellow-400 text-yellow-700 shadow" : "bg-white border-gray-200 hover:border-yellow-300"}`}
                  onClick={() => setPaymentMethod("payl8r")}
                  aria-label="Payl8r"
                >
                  <img src="/assets/company-logos/payl8r.jpg" alt="Payl8r" className="h-20 w-48 object-contain hover:scale-105 transition-transform" />
                  {/* <span className="text-base font-semibold text-yellow-700">Partnered with Payl8r</span> */}
                </button>
              </div>
            </div>
            {/* Payment Form Section - dynamic fields based on method */}
            <div className="space-y-4">
              <ErrorBoundary FallbackComponent={PaymentErrorFallback}>
                {paymentMethod === "paypal" && isFormValid() && (
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalCheckoutForm
                      cartTotal={cartTotal}
                      cartItems={cartItems}
                      billingInfo={billingInfo}
                    />
                  </PayPalScriptProvider>
                )}
                {paymentMethod === "stripe" && isFormValid() && clientSecret && (
                  <Elements options={stripeOptions} stripe={stripePromise}>
                    <StripeCheckoutForm
                      clientSecret={clientSecret}
                      cartTotal={cartTotal}
                      cartItems={cartItems}
                      billingInfo={billingInfo}
                    />
                  </Elements>
                )}
                {paymentMethod === "transfer" && isFormValid() && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h4 className="font-semibold mb-2 text-lg">Bank Transfer Details</h4>
                    <p className="mb-2 text-sm">Please transfer the total amount to the account below and enter your transaction reference.</p>
                    <div className="mb-2 text-sm">
                      <span className="font-bold">Bank Name:</span> Barclays Bank<br />
                      <span className="font-bold">Account Name:</span> Titans Careers<br />
                      <span className="font-bold">Sort Code:</span> 20-11-43<br />
                      <span className="font-bold">Account Number:</span> 53818284<br />
                      <span className="font-bold">Reference:</span> AML/KYC or Data Analysis
                    </div>
                    <label className="block mt-4 mb-2 text-sm font-medium">Transaction Reference</label>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={e => setBankRef(e.target.value)}
                      placeholder="Enter your bank transfer reference"
                      className="block w-full border border-gray-300 rounded-xl p-3 text-lg"
                    />
                    <label className="block mt-4 mb-2 text-sm font-medium">Upload Receipt <span className="text-red-600">*</span></label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setBankFile(e.target.files[0])}
                      className="block w-full"
                      required
                    />
                    {/* New fields for bank transfer */}
                    <label className="block mt-4 mb-2 text-sm font-medium">Description</label>
                    <input
                      type="text"
                      value={bankDesc}
                      onChange={e => setBankDesc(e.target.value)}
                      placeholder="Payment description (e.g. Course fee)"
                      className="block w-full border border-gray-300 rounded-xl p-3 text-lg"
                    />
                    <label className="block mt-4 mb-2 text-sm font-medium">Amount (£)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bankAmount}
                      onChange={e => setBankAmount(e.target.value)}
                      placeholder="Amount paid"
                      className="block w-full border border-gray-300 rounded-xl p-3 text-lg"
                    />
                    <Button
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                      disabled={bankLoading || !bankRef || !bankFile || !bankDesc || !bankAmount}
                      onClick={async () => {
                        if (!bankFile) {
                          setModal({ open: true, type: "error", message: "Please upload a receipt before submitting." });
                          return;
                        }
                        setBankLoading(true);
                        const formData = new FormData();
                        formData.append("reference", bankRef);
                        formData.append("receipt", bankFile);
                        formData.append("course_id", currentCourse.id);
                        formData.append("title", currentCourse.name || "Bank Transfer Receipt");
                        formData.append("description", bankDesc);
                        formData.append("amount", parseFloat(bankAmount));
                        // Do NOT append date
                        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
                        try {
                          const res = await fetch(`${baseUrl}/courses/receipts/upload/`, {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                            headers,
                          });
                          const resBody = await res.text();
                          if (!res.ok) throw new Error(resBody || "Upload failed");
                          setModal({ open: true, type: "success", message: "Your bank transfer receipt has been submitted and is pending approval. You will be notified by email once your course is activated." });
                          setBankRef("");
                          setBankFile(null);
                          setBankDesc("");
                          setBankAmount("");
                          // setBankDate(""); // Optionally clear date state if you want
                        } catch (err) {
                          let msg = err?.message || "Failed to upload receipt. Please try again.";
                          // Try to parse backend error
                          try {
                            const parsed = JSON.parse(msg);
                            if (parsed.errors) msg = Object.values(parsed.errors).flat().join(" ");
                          } catch {err}
                          setModal({ open: true, type: "error", message: msg });
                        } finally {
                          setBankLoading(false);
                        }
                      }}
                    >
                      {bankLoading ? "Uploading..." : "I Have Made The Transfer"}
                    </Button>
                    <Modal open={modal.open} onClose={() => {
                      setModal({ ...modal, open: false });
                      if (modal.type === "success") navigate("/courses");
                    }}>
                      <div className="p-6 text-center">
                        <h2 className={`text-xl font-bold mb-4 ${modal.type === "error" ? "text-red-600" : "text-green-600"}`}>{modal.type === "error" ? "Error" : "Success"}</h2>
                        <p>{modal.message}</p>
                        <Button className="mt-6" onClick={() => {
                          setModal({ ...modal, open: false });
                          if (modal.type === "success") navigate("/courses");
                        }}>
                          {modal.type === "error" ? "Close" : "Go to Courses"}
                        </Button>
                      </div>
                    </Modal>
                  </div>
                )}
                {paymentMethod === "payl8r" && isFormValid() && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center mb-4">
                      <img src="/assets/company-logos/payl8r.jpg" alt="Payl8r" className="h-20 w-48 object-contain hover:scale-105 transition-transform" />
                      <span className="mt-2 text-lg font-semibold text-yellow-700">Apply with Payl8r</span>
                    </div>
                    <p className="mb-2 text-sm text-center">Partnered with Payl8r. Complete your application below.</p>
                    <div className="w-full mt-4">
                      <iframe
                        src="https://payl8r.com/retailers/payment-detail?retailer=titanscar1020f2ucstj"
                        title="Payl8r Application"
                        width="100%"
                        height="800"
                        frameBorder="0"
                        className="rounded-xl border border-gray-200 shadow"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-700">
                      <a href="https://payl8r.com/retailers/payment-detail?retailer=titanscar1020f2ucstj" target="_blank" rel="noopener noreferrer" className="underline">Payl8r Information Page</a>
                    </div>
                    {/* FCA Disclaimer for Payl8r compliance */}
                    <div className="mt-4 text-xs text-gray-700 border-t pt-3">
                      TITANS CAREERS LIMITED is an Introducer Appointed Representative of Social Money Limited t/a Payl8r who is authorised by the FCA under Ref. Number 675283. Credit is subject to creditworthiness and affordability assessments. Missed payments may affect your credit file, future borrowing and incur fees. Representative APR 65.5%
                    </div>
                  </div>
                )}
                {paymentMethod === "stripe" && isFormValid() && (isCreatingStripeIntent || !clientSecret) && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Initializing secure payment...</p>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Secure Checkout</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm">SSL encrypted payment</span>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-blue-500 mr-3" />
            <span className="text-sm">Instant course access</span>
          </div>
        </div>
      </Card>
    </CheckoutProtection>
  );
};

export default CheckoutPage;
