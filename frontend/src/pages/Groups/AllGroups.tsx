import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import {
  createGroup,
  joinGroup,
  leaveGroup,
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
} from "react-icons/fa";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";
import GroupCard from "./GroupCard";

const AllGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allGroups = useSelector((state: RootState) => state.groups.allGroups);
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [upcomingEvent, setUpcomingEvent] = useState("");

  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      alert("Please log in to create a group.");
      return;
    }

    if (!groupName || !category || !level) {
      alert("Please fill Group Name, Category and Level.");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      category,
      members: 1,
      level,
      description,
      upcomingEvent,
      isMember: true,
      createdBy: currentUser?.id || "currentUserId",
      lastActivity: new Date().toISOString(),
    };

    dispatch(createGroup(newGroup));
    setGroupName("");
    setCategory("");
    setLevel("");
    setDescription("");
    setUpcomingEvent("");
    setIsModalOpen(false);
  };

  const handleJoinGroup = (id: number) => {
    if (!isAuthenticated) {
      alert("Please log in to join a group.");
      return;
    }
    dispatch(joinGroup(id));
  };

  const handleLeaveGroup = (id: number) => {
    if (!isAuthenticated) {
      alert("Please log in to leave a group.");
      return;
    }
    dispatch(leaveGroup(id));
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

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
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
            <Button variant="outline">
              <FaUsers className="mr-2" />
              My Groups
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaUsers className="text-blue-600 text-xl" />
            <span className="text-gray-700 font-semibold">
              {allGroups.reduce((acc, g) => acc + g.members, 0)}+ Active Members
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaStar className="text-yellow-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              {allGroups.length} Specialized Groups
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
          {allGroups.map((group) => (
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

        {allGroups.length === 0 && (
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

      <Features />
      <Banner
        imageSrc={bannerBg}
        title="Find your perfect learning community!"
        subtitle="Join groups that match your interests and skill level"
        buttonText="Browse Groups"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Group"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Upcoming Event (optional)"
            value={upcomingEvent}
            onChange={(e) => setUpcomingEvent(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllGroups;
