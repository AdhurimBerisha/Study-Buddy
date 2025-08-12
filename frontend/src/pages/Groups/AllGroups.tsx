import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchAllGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  clearError,
} from "../../store/slice/groupsSlice";

import Hero from "../../components/Hero";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import {
  FaClock,
  FaPlus,
  FaStar,
  FaUsers,
  FaLock,
  FaSignInAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";
import GroupCard from "./GroupCard";

const AllGroups = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allGroups, loading, error } = useSelector(
    (state: RootState) => state.groups
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");

  useEffect(() => {
    dispatch(fetchAllGroups());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateGroup = async () => {
    if (!isAuthenticated) {
      alert("Please log in to create a group.");
      return;
    }

    // Optimized validation - check all fields at once
    const requiredFields = { groupName, category, level };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value.trim())
      .map(([key]) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      );

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    const groupData = {
      name: groupName,
      description,
      category,
      level,
      maxMembers: maxMembers ? parseInt(maxMembers) : undefined,
    };

    try {
      await dispatch(createGroup(groupData)).unwrap();
      dispatch(fetchAllGroups());
      setGroupName("");
      setCategory("");
      setLevel("");
      setDescription("");
      setMaxMembers("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleJoinGroup = async (id: string) => {
    if (!isAuthenticated) {
      alert("Please log in to join a group.");
      return;
    }
    try {
      await dispatch(joinGroup(id)).unwrap();
      dispatch(fetchAllGroups());
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async (id: string) => {
    if (!isAuthenticated) {
      alert("Please log in to leave a group.");
      return;
    }
    try {
      await dispatch(leaveGroup(id)).unwrap();
      dispatch(fetchAllGroups());
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  const handleCreateGroupClick = () => {
    if (!isAuthenticated) {
      alert("Please log in to create a new group.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const totalMembers =
    allGroups?.reduce((acc, g) => acc + (g.memberCount || 0), 0) || 0;

  if (loading && (!allGroups || allGroups.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Groups</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Button
              onClick={handleCreateGroupClick}
              className={
                !isAuthenticated ? "opacity-75 cursor-not-allowed" : ""
              }
            >
              {isAuthenticated ? (
                <>
                  <FaPlus className="mr-2" />
                  Create New Group
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Login to Create Group
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate("/groups/my")}>
              <FaUsers className="mr-2" />
              My Groups
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaUsers className="text-blue-600 text-xl" />
            <span className="text-gray-700 font-semibold">
              {totalMembers}+ Active Members
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaStar className="text-yellow-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              {allGroups?.length || 0} Specialized Groups
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaClock className="text-green-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              Weekly Events & Activities
            </span>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <FaSignInAlt className="text-blue-600 text-xl" />
              <h3 className="text-lg font-semibold text-blue-900">
                Login Required
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              Please log in to create groups, join discussions, and access all
              features.
            </p>
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleLoginClick}
            >
              <FaSignInAlt className="mr-2" />
              Login Now
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGroups?.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              variant="all"
              onJoin={() => handleJoinGroup(group.id)}
              onLeave={() => handleLeaveGroup(group.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        {(!allGroups || allGroups.length === 0) && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              No groups available yet
            </h3>
            <p className="text-gray-500 mb-6">
              {isAuthenticated
                ? "Be the first to create a new group"
                : "Login to create the first group"}
            </p>
            <Button
              variant="primary"
              onClick={handleCreateGroupClick}
              className={
                !isAuthenticated ? "opacity-75 cursor-not-allowed" : ""
              }
            >
              {isAuthenticated ? "Create New Group" : "Login to Create Group"}
            </Button>
          </div>
        )}
      </div>

      {/* Only render heavy components when modal is closed for better performance */}
      {!isModalOpen && (
        <>
          <Features />
          <Banner
            imageSrc={bannerBg}
            title="Find your perfect learning community!"
            subtitle="Join groups that match your interests and skill level"
            buttonText="Browse Groups"
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Group"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Name *"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Category *"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            autoComplete="off"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select Level *</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
            rows={3}
          />
          <input
            type="number"
            placeholder="Max Members (optional)"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            min="2"
            max="1000"
          />

          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
          >
            Create Group
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllGroups;
