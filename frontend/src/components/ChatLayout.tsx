import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimes, FaUsers } from "react-icons/fa";
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
  const [isOpen, setIsOpen] = useState(true);
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
    setMessages(dummyMessages); // Replace with real fetch if needed
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex flex-col rounded-xl shadow-lg border border-gray-200 transition-all duration-300 overflow-hidden
        bg-white z-50
        ${isOpen ? "w-[580px] h-[600px]" : "w-72 h-14"}
      `}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <FaUsers className="text-gray-600" />
          <span className="font-semibold text-gray-800 truncate max-w-[320px]">
            {selectedGroup.name}
          </span>
          {selectedGroup.unreadMessages ? (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {selectedGroup.unreadMessages}
            </span>
          ) : null}
        </div>
        <div className="flex items-center space-x-3">
          {isOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-label="Minimize chat"
              className="hover:bg-gray-200 p-1 rounded"
            >
              <FaChevronDown />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              aria-label="Maximize chat"
              className="hover:bg-gray-200 p-1 rounded"
            >
              <FaChevronUp />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert("Close chat (implement your logic)");
            }}
            aria-label="Close chat"
            className="hover:bg-gray-200 p-1 rounded"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {groups.map((group) => (
              <button
                key={group.id}
                className={`w-full px-4 py-3 text-left cursor-pointer truncate border-l-4 transition-colors duration-150
        ${
          group.id === selectedGroup.id
            ? "bg-white border-blue-500 text-blue-700 font-semibold"
            : "border-transparent hover:bg-gray-100 hover:border-gray-300 text-gray-700"
        }`}
                onClick={() => selectGroup(group)}
              >
                {group.name}
                {group.unreadMessages ? (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {group.unreadMessages}
                  </span>
                ) : null}
                <div className="text-xs text-gray-400 mt-0.5">
                  {group.category}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex flex-col flex-1">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              {messages.length === 0 && (
                <p className="text-gray-400 text-center mt-10 select-none">
                  No messages yet
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] p-4 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-blue-100 text-blue-900 self-end ml-auto"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="font-semibold text-sm">{msg.sender}</p>
                  <p className="mt-1">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 flex items-center space-x-3 bg-gray-50">
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="flex items-center justify-center h-full text-gray-500 italic select-none">
          Chat minimized. Click header to expand.
        </div>
      )}
    </div>
  );
}
