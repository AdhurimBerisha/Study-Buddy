import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchMyGroups,
  leaveGroup,
  deleteGroup,
  clearError,
  refreshGroupData,
} from "../../store/slice/groupsSlice";
import { toast } from "react-toastify";

import Hero from "../../components/Hero";
import Button from "../../components/Button";
import {
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaSignInAlt,
} from "react-icons/fa";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";
import GroupCard from "./GroupCard";

const MyGroups = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myGroups, loading, error } = useSelector(
    (state: RootState) => state.groups
  );
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyGroups());
    }

    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isAuthenticated, error]);

  const handleLeaveGroup = async (id: string) => {
    try {
      await dispatch(leaveGroup(id)).unwrap();
      toast.info("Successfully left the group.");
      dispatch(refreshGroupData(id));
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast.error("Failed to leave group. Please try again.");
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      );
      if (!confirmed) return;
      await dispatch(deleteGroup(id)).unwrap();
      toast.info("Group deleted successfully.");
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error("Failed to delete group. Please try again.");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Hero />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-8">
            <FaSignInAlt className="text-6xl text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4">
              Login Required
            </h1>
            <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
              Please log in to view and manage your groups.
            </p>
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={handleLoginClick}
            >
              <FaSignInAlt className="mr-2" />
              Login Now
            </Button>
          </div>
        </div>
        <Features />
      </div>
    );
  }

  if (loading && myGroups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your groups...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
              <span className="text-red-800 dark:text-red-300 font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              My Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and participate in your learning communities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate("/groups")}>
              <FaUsers className="mr-2" />
              Browse All Groups
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
            <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
            <span className="text-gray-700 dark:text-gray-200 font-semibold">
              {myGroups.length} Active Groups
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
            <FaUsers className="text-green-500 text-xl" />
            <span className="text-gray-700 dark:text-gray-200 font-semibold">
              {myGroups.reduce((acc, g) => acc + g.memberCount, 0)}+ Total
              Members
            </span>
          </div>
        </div>

        {myGroups.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-4xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              You haven't joined any groups yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start by exploring available groups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/groups")}>
                <FaUsers className="mr-2" />
                Browse All Groups
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                variant="my"
                onView={() => navigate(`/groups/${group.id}`)}
                onLeave={() => handleLeaveGroup(group.id)}
                onDelete={
                  user?.id === group.createdBy.id
                    ? () => handleDeleteGroup(group.id)
                    : undefined
                }
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>

      <Features />
      <Banner
        imageSrc={bannerBg}
        title="Ready to create your own group?"
        subtitle="Start a learning community and invite others to join"
        buttonText="Create Group"
        buttonLink="/groups"
      />
    </div>
  );
};

export default MyGroups;
