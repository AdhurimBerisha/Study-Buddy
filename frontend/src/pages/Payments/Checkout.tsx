import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

type CheckoutState =
  | {
      type: "course";
      course: { title: string; price: number };
    }
  | {
      type: "tutor";
      tutor: { name: string; trialRate: number; hourlyRate: number };
      booking: { isTrial: boolean };
    };

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as CheckoutState;

  const { title, amount, subtitle } = useMemo(() => {
    if (state && state.type === "course") {
      return {
        title: `Purchase: ${state.course.title}`,
        amount: state.course.price,
        subtitle: "One-time course purchase",
      };
    }
    if (state && state.type === "tutor") {
      const amt = state.booking.isTrial
        ? state.tutor.trialRate
        : state.tutor.hourlyRate;
      const label = state.booking.isTrial ? "Trial Lesson" : "1 Hour Lesson";
      return {
        title: `${label} with ${state.tutor.name}`,
        amount: amt,
        subtitle: state.booking.isTrial
          ? "Discounted one-time trial lesson"
          : "Standard hourly private lesson",
      };
    }
    return { title: "Checkout", amount: 0, subtitle: "" };
  }, [state]);

  const handleComplete = () => {
    alert("Payment successful (demo)");
    navigate("/", { replace: true });
  };

  if (!state) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
          <p className="text-gray-600 mb-6">Nothing to checkout.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        <div className="p-6 sm:p-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-bold text-blue-600">
                ${amount.toFixed(2)}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border rounded-lg px-4 py-3"
                placeholder="Card number"
              />
              <input
                className="border rounded-lg px-4 py-3"
                placeholder="MM/YY"
              />
              <input
                className="border rounded-lg px-4 py-3"
                placeholder="CVC"
              />
              <input
                className="border rounded-lg px-4 py-3"
                placeholder="Cardholder name"
              />
            </div>
            <Button className="mt-6 w-full" onClick={handleComplete}>
              Pay ${amount.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
