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
    return <div>Loading...</div>;
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
