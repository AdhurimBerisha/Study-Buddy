import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import AdminDashboard from "./AdminDashboard";
import TutorDashboard from "./TutorDashboard.tsx";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-80 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse"
              >
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasDashboardAccess = user.role === "admin" || user.role === "tutor";

  if (!hasDashboardAccess) {
    navigate("/");
    return null;
  }

  const renderDashboard = () => {
    if (user.role === "admin") {
      return <AdminDashboard />;
    } else if (user.role === "tutor") {
      return <TutorDashboard />;
    } else {
      navigate("/");
      return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.firstName}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {user.role === "admin" && "Admin Dashboard - Manage the platform"}
              {user.role === "tutor" &&
                "Tutor Dashboard - Manage your courses and students"}
            </p>
          </div>
          {renderDashboard()}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
