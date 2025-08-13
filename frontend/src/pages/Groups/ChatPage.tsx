import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  FaBars,
  FaTimes,
  FaPaperPlane,
  FaSignInAlt,
  FaLock,
} from "react-icons/fa";
import Button from "../../components/Button";
import {
  selectGroup as selectGroupAction,
  toggleSidebar,
  setSidebarOpen,
  loadMessages,
} from "../../store/slice/chatSlice";
import { fetchMyGroups } from "../../store/slice/groupsSlice";
import socketService from "../../services/socket";
import { groupAPI } from "../../services/api";

interface ApiMessage {
  id: string;
  groupId: string;
  content: string;
  senderId: string;
  sender: string;
  timestamp: string;
}

const ChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const isAuthenticated = !!token;
  const { selectedGroupId, messagesByGroupId, isSidebarOpen } = useSelector(
    (state: RootState) => state.chat
  );
  const { myGroups, loading } = useSelector((state: RootState) => state.groups);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyGroups());

      socketService.connect(token);
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (myGroups.length > 0) {
      if (!selectedGroupId || !myGroups.find((g) => g.id === selectedGroupId)) {
        dispatch(selectGroupAction(myGroups[0].id));
      }
    }
  }, [myGroups, selectedGroupId, dispatch]);

  const fetchGroupMessages = useCallback(
    async (groupId: string) => {
      try {
        const response = await groupAPI.getGroupMessages(groupId);

        const messages = response.data.map((msg: ApiMessage) => {
          const isCurrentUser =
            currentUser &&
            ((msg.senderId && msg.senderId === currentUser.id) ||
              (msg.sender &&
                currentUser.firstName &&
                currentUser.lastName &&
                msg.sender
                  .toLowerCase()
                  .includes(currentUser.firstName.toLowerCase()) &&
                msg.sender
                  .toLowerCase()
                  .includes(currentUser.lastName.toLowerCase())));

          return {
            id: String(msg.id),
            sender: isCurrentUser ? "You" : msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
        dispatch(loadMessages({ groupId, messages }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [currentUser, dispatch]
  );

  useEffect(() => {
    if (selectedGroupId && socketService.isSocketConnected()) {
      socketService.leaveGroup(selectedGroupId);

      socketService.joinGroup(selectedGroupId);

      fetchGroupMessages(selectedGroupId);
    }
  }, [selectedGroupId, fetchGroupMessages]);

  useEffect(() => {
    return () => {
      if (selectedGroupId) {
        socketService.leaveGroup(selectedGroupId);
      }
    };
  }, [selectedGroupId]);

  const selectedGroup =
    myGroups.length > 0
      ? selectedGroupId
        ? myGroups.find((g) => g.id === selectedGroupId) || myGroups[0]
        : myGroups[0]
      : null;

  const messages = useMemo(() => {
    return selectedGroup ? messagesByGroupId[selectedGroup.id] || [] : [];
  }, [selectedGroup, messagesByGroupId]);

  useEffect(() => {
    if (messages.length > 0) {
      const chatContainer = document.querySelector(".overflow-y-auto");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access group chats and discussions.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FaSignInAlt className="mr-2" />
              Login to Continue
            </Button>
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    socketService.sendMessage(selectedGroup.id, newMessage.trim());

    setNewMessage("");
  };

  const selectGroup = (groupId: string) => {
    if (selectedGroupId) {
      socketService.leaveGroup(selectedGroupId);
    }

    dispatch(selectGroupAction(groupId));

    socketService.joinGroup(groupId);

    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-80 lg:w-96 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Groups
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Select a group to start chatting
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {myGroups.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No groups available.</p>
                <p className="text-xs mt-1">
                  Join or create a group to start chatting.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myGroups.map((group) => {
                  const isSelected = selectedGroupId === group.id;
                  return (
                    <div
                      key={group.id}
                      onClick={() => selectGroup(group.id)}
                      className={`cursor-pointer rounded-lg p-4 border transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h2
                            className={`text-base sm:text-lg font-semibold truncate ${
                              isSelected ? "text-blue-700" : "text-gray-900"
                            }`}
                          >
                            {group.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            {group.description || "No description available"}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{group.memberCount} members</span>
                            <span>•</span>
                            <span>{group.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white shadow-lg lg:shadow-none">
        <header className="flex justify-between items-center bg-white p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {selectedGroup ? selectedGroup.name : "No group selected"}
            </h2>
            {selectedGroup && (
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {selectedGroup.memberCount} members
              </span>
            )}
          </div>
        </header>

        {selectedGroup ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPaperPlane className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-lg shadow-sm ${
                      msg.sender === "You"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold mb-1">
                      {msg.sender}
                    </p>
                    <p className="text-sm sm:text-base">{msg.content}</p>
                    <p
                      className={`text-xs mt-2 text-right ${
                        msg.sender === "You" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-gray-600">
              <p className="text-sm sm:text-base">
                No groups available. Join or create a group to start chatting.
              </p>
            </div>
          </div>
        )}
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
    </div>
  );
};

export default ChatPage;
