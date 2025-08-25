import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import { toast } from "react-toastify";

interface StripePaymentFormProps {
  amount: number;
  courseId: string;
  userId: string;
  onSuccess: () => void;
  onError: () => void;
}

const StripePaymentForm = ({
  amount,
  courseId,
  userId,
  onSuccess,
  onError,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTextColor(isDarkMode ? "#ffffff" : "#000000");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isDark = document.documentElement.classList.contains("dark");
          setTextColor(isDark ? "#ffffff" : "#000000");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:8080/api"
        }/api/payments/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount,
            courseId,
            userId,
          }),
        }
      );

      const { clientSecret, paymentIntentId } = await response.json();

      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError();
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const confirmResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:8080/api"
          }/api/payments/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              paymentIntentId,
              courseId,
              userId,
            }),
          }
        );

        if (confirmResponse.ok) {
          toast.success("Payment successful! Course purchased.");
          onSuccess();
        } else {
          throw new Error("Failed to confirm payment");
        }
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
      onError();
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "18px",
        color: textColor,
        fontWeight: "600",
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": {
          color: "#9ca3af",
          fontWeight: "400",
        },
        backgroundColor: "transparent",
        padding: "16px",
        border: "2px solid #d1d5db",
        borderRadius: "8px",
        "&:focus": {
          borderColor: "#3b82f6",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        },
        "&:hover": {
          borderColor: "#9ca3af",
        },
      },
      invalid: {
        color: "#dc2626",
        borderColor: "#fca5a5",
        "&:focus": {
          borderColor: "#dc2626",
          boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 -mt-5">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-lg">💳</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Payment Details
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Complete your purchase securely
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Enter cardholder name"
              className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Card Information
            </label>
            <div className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-l-4 border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="font-medium text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Total Amount
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${amount.toFixed(2)}
          </span>
        </div>

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Complete Payment - $${amount.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
