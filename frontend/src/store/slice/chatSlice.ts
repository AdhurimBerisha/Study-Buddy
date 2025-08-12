import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatMessage = {
  id: string;
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
  id?: string;
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectGroup: (state, action: PayloadAction<string>) => {
      state.selectedGroupId = action.payload;
    },
    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const { groupId, content, sender, id } = action.payload;
      if (!state.messagesByGroupId[groupId]) {
        state.messagesByGroupId[groupId] = [];
      }

      const messageId = id || Date.now().toString();
      const messageExists = state.messagesByGroupId[groupId].some(
        (msg) => msg.id === messageId
      );
      if (messageExists) {
        return;
      }

      state.messagesByGroupId[groupId].push({
        id: messageId,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    receiveMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const { groupId, content, sender, id } = action.payload;
      console.log("🔄 Processing receiveMessage:", {
        groupId,
        content,
        sender,
        id,
      });

      if (!state.messagesByGroupId[groupId]) {
        state.messagesByGroupId[groupId] = [];
      }

      const messageId = id || Date.now().toString();
      const messageExists = state.messagesByGroupId[groupId].some(
        (msg) => msg.id === messageId
      );
      if (messageExists) {
        console.log("⚠️ Duplicate message detected, skipping:", messageId);
        return;
      }

      console.log("✅ Adding new message:", messageId);
      state.messagesByGroupId[groupId].push({
        id: messageId,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    loadMessages: (
      state,
      action: PayloadAction<{ groupId: string; messages: ChatMessage[] }>
    ) => {
      const { groupId, messages } = action.payload;

      if (!state.messagesByGroupId[groupId]) {
        state.messagesByGroupId[groupId] = [];
      }

      const existingIds = new Set(
        state.messagesByGroupId[groupId].map((msg) => msg.id)
      );
      const newMessages = messages.filter((msg) => !existingIds.has(msg.id));

      state.messagesByGroupId[groupId] = [
        ...state.messagesByGroupId[groupId],
        ...newMessages,
      ];
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
  loadMessages,
  setSidebarOpen,
  toggleSidebar,
  setChatWidgetOpen,
  toggleChatWidget,
} = chatSlice.actions;

export default chatSlice.reducer;
