import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  refreshGroupData,
  clearCurrentGroup,
} from "../../store/slice/groupsSlice";
import { toast } from "react-toastify";

import Button from "../../components/Button";
import {
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaSignInAlt,
  FaEdit,
  FaTrash,
  FaCrown,
  FaUser,
  FaSignOutAlt,
  FaComments,
} from "react-icons/fa";
import type { GroupMember } from "../../store/slice/groupsSlice";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentGroup, messages, loading, error } = useSelector(
    (state: RootState) => state.groups
  );
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  const [newMessage, setNewMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "",
    level: "",
    maxMembers: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchGroup(id));
    }

    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentGroup && !isEditing) {
      setEditData({
        name: currentGroup.name,
        description: currentGroup.description || "",
        category: currentGroup.category,
        level: currentGroup.level,
        maxMembers: currentGroup.maxMembers?.toString() || "",
      });
    }
  }, [currentGroup, isEditing]);

  const handleJoinGroup = async () => {
    if (!id) return;
    try {
      await dispatch(joinGroup(id)).unwrap();
      toast.info("Successfully joined the group.");
      dispatch(refreshGroupData(id));
    } catch (error) {
      console.error("Failed to join group:", error);
      toast.error("Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async () => {
    if (!id) return;
    try {
      await dispatch(leaveGroup(id)).unwrap();
      toast.info("Successfully left the group.");
      navigate("/groups");
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast.error("Failed to leave group. Please try again.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await dispatch(deleteGroup(id)).unwrap();
        toast.info("Group deleted successfully.");
        navigate("/groups");
      } catch (error) {
        console.error("Failed to delete group:", error);
        toast.error("Failed to delete group. Please try again.");
      }
    }
  };

  const handleUpdateGroup = async () => {
    if (!id) return;

    if (!editData.name || !editData.category || !editData.level) {
      toast.error(
        "Please fill in all required fields (Name, Category, and Level)"
      );
      return;
    }

    try {
      const updateData = {
        name: editData.name,
        description: editData.description,
        category: editData.category,
        level: editData.level,
        maxMembers: editData.maxMembers
          ? parseInt(editData.maxMembers)
          : undefined,
      };

      await dispatch(updateGroup({ id, data: updateData })).unwrap();
      toast.info("Group updated successfully.");
      setIsEditing(false);
      dispatch(fetchGroup(id));
    } catch (error) {
      console.error("Failed to update group:", error);
      toast.error("Failed to update group. Please try again.");
    }
  };

  const canEdit =
    currentGroup &&
    (currentGroup.userRole === "admin" ||
      currentGroup.createdBy?.id === user?.id);

  const canDelete = currentGroup && currentGroup.createdBy?.id === user?.id;

  if (loading && !currentGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Group not found</p>
        </div>
      </div>
    );
  }

  const members: GroupMember[] = currentGroup?.members ?? [];
  const derivedIsMember = Boolean(
    currentGroup.isMember ||
      currentGroup.createdBy?.id === user?.id ||
      members.some((m) => m.id === user?.id)
  );
  const memberCount = currentGroup.memberCount ?? members.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {currentGroup.name}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                {currentGroup.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                  {currentGroup.category}
                </span>
                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                  {currentGroup.level}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">
                  {memberCount}
                  {currentGroup.maxMembers
                    ? ` / ${currentGroup.maxMembers} members`
                    : " members"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {!derivedIsMember ? (
                <Button
                  variant="primary"
                  onClick={handleJoinGroup}
                  disabled={!isAuthenticated}
                  className="w-full lg:w-auto"
                >
                  <FaSignInAlt className="mr-2" />
                  Join Group
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLeaveGroup}
                  className="w-full lg:w-auto"
                >
                  <FaSignOutAlt className="mr-2" />
                  Leave Group
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full lg:w-auto"
                >
                  <FaEdit className="mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Group"}
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  onClick={handleDeleteGroup}
                  className="w-full lg:w-auto text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaTrash className="mr-2" />
                  Delete Group
                </Button>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Edit Group
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <select
                  value={editData.level}
                  onChange={(e) =>
                    setEditData({ ...editData, level: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
                <input
                  type="number"
                  placeholder="Max Members"
                  value={editData.maxMembers}
                  onChange={(e) =>
                    setEditData({ ...editData, maxMembers: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  min="2"
                  max="1000"
                />
                <div className="md:col-span-2">
                  <textarea
                    placeholder="Description"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleUpdateGroup} variant="primary">
                  Update Group
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaUsers className="text-blue-600 dark:text-blue-400" />
                Members ({memberCount})
              </h2>
              <div className="space-y-3">
                {members.length > 0 ? (
                  members.map((member: GroupMember) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center overflow-hidden">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                              {member.firstName?.[0]}
                              {member.lastName?.[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                              {member.firstName} {member.lastName}
                            </span>
                            {member?.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                                <FaCrown /> Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                <FaUser /> Member
                              </span>
                            )}
                          </div>

                          {member?.joinedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Joined{" "}
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <FaUsers className="text-2xl mx-auto mb-2" />
                    <p>No members found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaComments className="text-blue-600 dark:text-blue-400" />
                Group Chat
              </h2>

              {!derivedIsMember ? (
                <div className="text-center py-12">
                  <FaComments className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Join the group to participate in discussions
                  </p>
                  <Button onClick={handleJoinGroup} disabled={!isAuthenticated}>
                    <FaSignInAlt className="mr-2" />
                    Join Group
                  </Button>
                </div>
              ) : (
                <>
                  <div className="h-96 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FaComments className="text-3xl mx-auto mb-2" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                              {message.user.avatar ? (
                                <img
                                  src={message.user.avatar}
                                  alt={`${message.user.firstName} ${message.user.lastName}`}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                  {message.user.firstName[0]}
                                  {message.user.lastName[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                  {message.user.firstName}{" "}
                                  {message.user.lastName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <form className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={!isAuthenticated}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || !isAuthenticated}
                      className="px-6"
                    >
                      Send
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
