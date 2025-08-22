import { useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import StripePaymentForm from "../../components/StripePaymentForm";
import Button from "../../components/Button";

type CheckoutState = {
  course: { id: string; title: string; price: number };
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const state = useMemo(
    () => (location.state || {}) as CheckoutState,
    [location.state]
  );

  const { title, amount, subtitle } = useMemo(() => {
    if (state) {
      return {
        title: `Purchase: ${state.course.title}`,
        amount: Number(state.course.price) || 0,
        subtitle: "Full course access - one-time purchase",
      };
    }
    return { title: "Checkout", amount: 0, subtitle: "" };
  }, [state]);

  if (!state) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nothing to checkout.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to purchase this course.
          </p>
          <div className="space-y-3">
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-600">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>
        </div>
        <div className="p-6 sm:p-10">
          {isAuthenticated ? (
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between text-lg text-gray-900 dark:text-gray-100 mb-6">
                <span>Total</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  ${amount.toFixed(2)}
                </span>
              </div>

              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  amount={amount}
                  courseId={state.course.id}
                  userId={user?.id || ""}
                  onSuccess={() => {
                    toast.success(
                      "Payment successful! Redirecting to your course..."
                    );
                    navigate(`/learning/course/${state.course.id}`, {
                      replace: true,
                    });
                  }}
                  onError={() => {
                    toast.error("Payment failed. Please try again.");
                  }}
                />
              </Elements>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No items to checkout.
              </p>
              <Link to="/">
                <Button>Go Home</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
