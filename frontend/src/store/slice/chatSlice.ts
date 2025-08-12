import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export type MessagesByGroupId = Record<string, ChatMessage[]>;

interface ChatState {
  selectedGroupId: string | null;
  messagesByGroupId: MessagesByGroupId;
  isSidebarOpen: boolean;
  isChatWidgetOpen: boolean;
}

const initialState: ChatState = {
  selectedGroupId: null,
  messagesByGroupId: {},
  isSidebarOpen: false,
  isChatWidgetOpen: false,
};

type SendMessagePayload = {
  groupId: string;
  content: string;
  sender: string;
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectGroup: (state, action: PayloadAction<string>) => {
      state.selectedGroupId = action.payload;
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
