import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  selectGroup,
  toggleChatWidget,
  setChatWidgetOpen,
  loadMessages,
} from "../store/slice/chatSlice";
import { fetchMyGroups } from "../store/slice/groupsSlice";
import socketService from "../services/socket";
import { groupAPI } from "../services/api";

interface ApiMessage {
  id: string;
  groupId: string;
  content: string;
  senderId: string;
  sender: string;
  timestamp: string;
}

import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";

const ChatLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroupId, messagesByGroupId, isChatWidgetOpen } = useSelector(
    (state: RootState) => state.chat
  );
  const { myGroups, loading } = useSelector((state: RootState) => state.groups);
  const { token, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    dispatch(fetchMyGroups());

    if (token) {
      socketService.connect(token);
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (myGroups.length > 0) {
      if (!selectedGroupId || !myGroups.find((g) => g.id === selectedGroupId)) {
        dispatch(selectGroup(myGroups[0].id));
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

  const selectedGroup = useMemo(() => {
    return myGroups.length > 0
      ? selectedGroupId
        ? myGroups.find((g) => g.id === selectedGroupId) || myGroups[0]
        : myGroups[0]
      : null;
  }, [myGroups, selectedGroupId]);

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    socketService.sendMessage(selectedGroup.id, newMessage.trim());

    setNewMessage("");
  };

  if (myGroups.length === 0) {
    return (
      <div className="fixed bottom-0 right-2 sm:right-4 lg:right-6 z-50 w-64 sm:w-72 h-14 bg-white border border-gray-200 shadow-xl rounded-t-xl flex items-center justify-center">
        <div className="text-center text-gray-500 text-xs sm:text-sm px-3">
          {loading ? "Loading groups..." : "No groups available"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 right-2 sm:right-4 lg:right-6 z-50 flex flex-col transition-all duration-300
    bg-white border border-gray-200 shadow-xl overflow-hidden
    ${
      isChatWidgetOpen
        ? "w-[320px] sm:w-[400px] md:w-[500px] lg:w-[580px] h-[400px] sm:h-[500px] md:h-[600px] rounded-t-xl"
        : "w-64 sm:w-72 h-14 rounded-t-xl"
    }`}
    >
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer select-none"
        onClick={() => dispatch(toggleChatWidget())}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <FaUsers className="text-white flex-shrink-0" />
          <span className="font-semibold truncate">
            {selectedGroup ? selectedGroup.name : "No groups"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isChatWidgetOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setChatWidgetOpen(false));
              }}
              className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
            >
              <FaChevronDown className="text-sm" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setChatWidgetOpen(true));
              }}
              className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
            >
              <FaChevronUp className="text-sm" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setChatWidgetOpen(false));
            }}
            className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>

      {isChatWidgetOpen && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 sm:w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {myGroups.map((group) => (
              <button
                key={group.id}
                className={`w-full px-3 sm:px-4 py-3 text-left cursor-pointer truncate border-l-4 transition-all duration-200
        ${
          selectedGroupId === group.id
            ? "bg-white border-blue-500 text-blue-700 font-semibold shadow-sm"
            : "border-transparent hover:bg-gray-100 hover:border-gray-300 text-gray-700"
        }`}
                onClick={() => {
                  if (selectedGroupId) {
                    socketService.leaveGroup(selectedGroupId);
                  }

                  dispatch(selectGroup(group.id));

                  socketService.joinGroup(group.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{group.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {group.category}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-white">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center text-sm sm:text-base">
                    No messages yet
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-lg shadow-sm ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="font-semibold text-xs sm:text-sm mb-1">
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
              ))}
            </div>

            <div className="border-t border-gray-200 p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 bg-gray-50">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaPaperPlane className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isChatWidgetOpen && (
        <div className="flex items-center justify-center h-full text-gray-500 italic text-xs sm:text-sm px-3">
          Chat minimized. Click header to expand.
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
