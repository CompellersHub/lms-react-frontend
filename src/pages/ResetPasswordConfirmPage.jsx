import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "../components/Spinner";
import { confirmPasswordResetSchema } from "../schemas/passwordSchemas";
import { useConfirmPasswordResetMutation } from "../services/api"; // Import the new mutation

function ResetPasswordConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPasswordReset, { isLoading, isSuccess, isError, error, data }] =
    useConfirmPasswordResetMutation();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(confirmPasswordResetSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid password reset link. Missing token.");
      navigate("/forgot-password"); // Redirect if link is incomplete
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Password has been reset successfully!");
      navigate("/login"); // Redirect to login after successful reset
    }

    if (isError) {
      // Assuming backend sends error.data.detail or specific field errors
      const errorMessage =
        error?.data?.new_password ||
        error?.data?.token ||
        error?.data?.detail ||
        "Failed to reset password. Please check the link or try again.";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, data, navigate]);

  const onSubmit = (formData) => {
    confirmPasswordReset({
      new_password: formData.new_password,
      token,
      uid: null, // Not needed for your backend
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Enter your new password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password Field */}
          <div>
            <label htmlFor="new_password" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="new_password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border ${
                  errors.new_password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="New Password"
                {...register("new_password")}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.new_password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.new_password.message}
              </p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label htmlFor="confirm_password" className="sr-only">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border ${
                  errors.confirm_password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Confirm New Password"
                {...register("confirm_password")}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.confirm_password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Reset Password"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/80">
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordConfirmPage;
