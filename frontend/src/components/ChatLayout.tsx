import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";
import Button from "./Button";

type Group = {
  id: number;
  name: string;
  category: string;
  members: number;
  level: string;
  unreadMessages?: number;
};

const groups: Group[] = [
  {
    id: 1,
    name: "Frontend Masters",
    category: "Web Development",
    members: 85,
    level: "Intermediate",
    unreadMessages: 3,
  },
  {
    id: 2,
    name: "Python Pioneers",
    category: "Software Development",
    members: 120,
    level: "Beginner",
    unreadMessages: 0,
  },
  {
    id: 3,
    name: "Design Wizards",
    category: "UI/UX",
    members: 40,
    level: "Advanced",
    unreadMessages: 7,
  },
];

const dummyMessages = [
  {
    id: 1,
    sender: "Alice",
    content: "Hey, how's it going?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "You",
    content: "Good, thanks! You?",
    timestamp: "10:01 AM",
  },
  { id: 3, sender: "Alice", content: "Great!", timestamp: "10:02 AM" },
];

export default function RightSideChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
  };

  const selectGroup = (group: (typeof groups)[0]) => {
    setSelectedGroup(group);
    setMessages(dummyMessages);
  };

  return (
    <div
      className={`fixed bottom-0 right-2 sm:right-4 lg:right-6 z-50 flex flex-col transition-all duration-300
    bg-white border border-gray-200 shadow-xl overflow-hidden
    ${
      isOpen
        ? "w-[320px] sm:w-[400px] md:w-[500px] lg:w-[580px] h-[400px] sm:h-[500px] md:h-[600px] rounded-t-xl"
        : "w-64 sm:w-72 h-14 rounded-t-xl"
    }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <FaUsers className="text-white flex-shrink-0" />
          <span className="font-semibold truncate">{selectedGroup.name}</span>
          {selectedGroup.unreadMessages ? (
            <span className="bg-white text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
              {selectedGroup.unreadMessages}
            </span>
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          {isOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-label="Minimize chat"
              className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
            >
              <FaChevronDown className="text-sm" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              aria-label="Maximize chat"
              className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
            >
              <FaChevronUp className="text-sm" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert("Close chat (implement your logic)");
            }}
            aria-label="Close chat"
            className="hover:bg-blue-400 p-1 rounded transition-colors duration-200"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-1/3 sm:w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {groups.map((group) => (
              <button
                key={group.id}
                className={`w-full px-3 sm:px-4 py-3 text-left cursor-pointer truncate border-l-4 transition-all duration-200
        ${
          group.id === selectedGroup.id
            ? "bg-white border-blue-500 text-blue-700 font-semibold shadow-sm"
            : "border-transparent hover:bg-gray-100 hover:border-gray-300 text-gray-700"
        }`}
                onClick={() => selectGroup(group)}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{group.name}</span>
                  {group.unreadMessages ? (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      {group.unreadMessages}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {group.category}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex flex-col flex-1">
            {/* Messages */}
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

            {/* Message Input */}
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

      {!isOpen && (
        <div className="flex items-center justify-center h-full text-gray-500 italic text-xs sm:text-sm px-3">
          Chat minimized. Click header to expand.
        </div>
      )}
    </div>
  );
}
