import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export type ChatGroup = {
  id: number;
  name: string;
  category: string;
  members: number;
  level: string;
  description?: string;
  upcomingEvent?: string;
  lastActivity?: string;
  unreadMessages?: number;
};

export type MessagesByGroupId = Record<number, ChatMessage[]>;

interface ChatState {
  groups: ChatGroup[];
  selectedGroupId: number | null;
  messagesByGroupId: MessagesByGroupId;
  isSidebarOpen: boolean;
  isChatWidgetOpen: boolean;
}

const initialGroups: ChatGroup[] = [
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

const initialMessages: MessagesByGroupId = {
  1: [
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
  ],
  2: [
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
  ],
  3: [],
};

const initialState: ChatState = {
  groups: initialGroups,
  selectedGroupId: initialGroups.length > 0 ? initialGroups[0].id : null,
  messagesByGroupId: initialMessages,
  isSidebarOpen: false,
  isChatWidgetOpen: false,
};

type SendMessagePayload = {
  groupId: number;
  content: string;
  sender: string;
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectGroup: (state, action: PayloadAction<number>) => {
      state.selectedGroupId = action.payload;
      const group = state.groups.find((g) => g.id === action.payload);
      if (group) {
        group.unreadMessages = 0;
      }
    },
    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const { groupId, content, sender } = action.payload;
      if (!state.messagesByGroupId[groupId]) {
        state.messagesByGroupId[groupId] = [];
      }
      const nextId = state.messagesByGroupId[groupId].length + 1;
      state.messagesByGroupId[groupId].push({
        id: nextId,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    receiveMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const { groupId, content, sender } = action.payload;
      if (!state.messagesByGroupId[groupId]) {
        state.messagesByGroupId[groupId] = [];
      }
      const nextId = state.messagesByGroupId[groupId].length + 1;
      state.messagesByGroupId[groupId].push({
        id: nextId,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      if (state.selectedGroupId !== groupId) {
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          group.unreadMessages = (group.unreadMessages || 0) + 1;
        }
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setChatWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatWidgetOpen = action.payload;
    },
    toggleChatWidget: (state) => {
      state.isChatWidgetOpen = !state.isChatWidgetOpen;
    },
  },
});

export const {
  selectGroup,
  sendMessage,
  receiveMessage,
  setSidebarOpen,
  toggleSidebar,
  setChatWidgetOpen,
  toggleChatWidget,
} = chatSlice.actions;

export default chatSlice.reducer;
