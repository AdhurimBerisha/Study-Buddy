import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Button from "../../components/Button";

const groups = [
  {
    id: 1,
    name: "Frontend Masters",
    category: "Web Development",
    members: 85,
    level: "Intermediate",
    description: "A place for frontend developers.",
    upcomingEvent: "Aug 20 - React Conf",
    lastActivity: "2 hours ago",
    unreadMessages: 5,
    pendingTasks: 2,
    isMember: true,
  },
  {
    id: 2,
    name: "Python Pioneers",
    category: "Software Development",
    members: 120,
    level: "Beginner",
    description: "Python programming enthusiasts.",
    upcomingEvent: "Sep 10 - Python Meetup",
    lastActivity: "1 day ago",
    unreadMessages: 0,
    pendingTasks: 0,
    isMember: true,
  },
];

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const dummyMessages: Message[] = [
  { id: 1, sender: "Alice", content: "Hi everyone!", timestamp: "10:00 AM" },
  {
    id: 2,
    sender: "Bob",
    content: "Hello! How are you?",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    sender: "Alice",
    content: "Doing great, thanks!",
    timestamp: "10:02 AM",
  },
];

const ChatPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg: Message = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)]  bg-gray-100">
      <aside className="w-72 border-r border-b border-gray-300 overflow-y-auto p-4 ">
        <h1 className="text-2xl font-bold mb-6">Your Groups</h1>
        <div className="space-y-3">
          {groups.map((group) => {
            const isSelected = selectedGroup.id === group.id;
            return (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  setIsMinimized(false);
                  setMessages(dummyMessages);
                }}
                className={`cursor-pointer rounded-md  p-3 border border-gray-400  ${
                  isSelected
                    ? "border-blue-500 bg-gray-100 border ring-2 ring-blue-400"
                    : "border-transparent hover:border-gray-300  hover:bg-gray-50"
                } transition-colors duration-200`}
              >
                <div className="flex justify-between items-center">
                  <h2
                    className={`text-lg font-semibold truncate ${
                      isSelected ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {group.name}
                  </h2>
                  {group.unreadMessages ? (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {group.unreadMessages}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-gray-600 mt-0.5 truncate">
                  {group.description}
                </p>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 flex flex-col  shadow-inner rounded-l-xl overflow-hidden">
        <header className="flex justify-between items-center bg-gray-100 p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">{selectedGroup.name} Chat</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </header>

        {!isMinimized && selectedGroup && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-gray-500 text-center mt-8">
                  No messages yet. Start the conversation!
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-blue-100 text-blue-900 self-end"
                      : "bg-gray-200 text-gray-900 self-start"
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.sender}</p>
                  <p className="mt-1">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-b border-gray-300 px-4 py-3 flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center text-gray-500 italic select-none">
            Chat minimized. Click the arrow to expand.
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
