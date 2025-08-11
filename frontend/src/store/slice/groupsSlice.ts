import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { groupAPI } from "../../services/api";

export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: "member" | "admin";
  joinedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  category: string;
  level: string;
  maxMembers?: number;
  isPrivate: boolean;
  memberCount: number;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  isMember?: boolean;
  userRole?: "member" | "admin";
  members?: GroupMember[];
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  category?: string;
  level?: string;
  maxMembers?: number;
  isPrivate?: boolean;
}

export interface SendMessageData {
  content: string;
  messageType?: "text" | "image" | "file" | "link";
  replyTo?: string;
}

export interface Message {
  id: string;
  content: string;
  messageType: "text" | "image" | "file" | "link";
  replyTo?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface GroupState {
  allGroups: Group[];
  myGroups: Group[];
  currentGroup: Group | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  allGroups: [],
  myGroups: [],
  currentGroup: null,
  messages: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllGroups = createAsyncThunk(
  "groups/fetchAllGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupAPI.getAllGroups();
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching all groups:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch groups");
    }
  }
);

export const fetchGroup = createAsyncThunk(
  "groups/fetchGroup",
  async (id: string) => {
    try {
      const response = await groupAPI.getGroup(id);

      type RawMember = {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        GroupMember?: { role?: "member" | "admin"; joinedAt?: string };
      };

      type RawGroup = {
        [key: string]: unknown;
        id: string;
        name: string;
        description?: string;
        category: string;
        level: string;
        maxMembers?: number;
        isPrivate: boolean;
        memberCount: number;
        createdBy?: {
          id: string;
          firstName: string;
          lastName: string;
          avatar?: string;
        } | null;
        creator?: {
          id: string;
          firstName: string;
          lastName: string;
          avatar?: string;
        } | null;
        createdAt: string;
        updatedAt: string;
        isMember?: boolean;
        userRole?: "member" | "admin";
        members?: RawMember[];
      };

      const raw: RawGroup = response.data as RawGroup;
      const normalizedMembers: GroupMember[] = Array.isArray(raw.members)
        ? raw.members.map((m) => ({
            id: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            avatar: m.avatar,
            role: m.GroupMember?.role,
            joinedAt: m.GroupMember?.joinedAt,
          }))
        : [];

      const createdBy = raw.createdBy ?? raw.creator ?? null;
      const { creator, members, ...rest } = raw;

      return {
        ...(rest as Omit<Group, "members">),
        createdBy,
        members: normalizedMembers,
      } as Group;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData: {
    name: string;
    description?: string;
    category: string;
    level: string;
    maxMembers?: number;
    isPrivate?: boolean;
  }) => {
    try {
      const response = await groupAPI.createGroup(groupData);
      return response.data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, data }: { id: string; data: UpdateGroupData }) => {
    try {
      const response = await groupAPI.updateGroup(id, data);
      return response.data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id: string) => {
    try {
      await groupAPI.deleteGroup(id);
      return id;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async (id: string) => {
    try {
      await groupAPI.joinGroup(id);
      return id;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async (id: string) => {
    try {
      await groupAPI.leaveGroup(id);
      return id;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const fetchMyGroups = createAsyncThunk(
  "groups/fetchMyGroups",
  async (_) => {
    try {
      const response = await groupAPI.getMyGroups();
      return response.data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "groups/sendMessage",
  async ({ groupId, data }: { groupId: string; data: SendMessageData }) => {
    try {
      const response = await groupAPI.sendMessage(groupId, data);
      return response.data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

export const fetchGroupMessages = createAsyncThunk(
  "groups/fetchGroupMessages",
  async ({
    groupId,
    page,
    limit,
  }: {
    groupId: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await groupAPI.getGroupMessages(groupId, page, limit);
      return response.data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allGroups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload || null;
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createGroup.fulfilled, (state, action) => {
        state.allGroups.unshift(action.payload);
        state.myGroups.unshift(action.payload);
      })

      .addCase(deleteGroup.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.allGroups = state.allGroups.filter(
          (group) => group.id !== deletedId
        );
        state.myGroups = state.myGroups.filter(
          (group) => group.id !== deletedId
        );
        if (state.currentGroup?.id === deletedId) {
          state.currentGroup = null;
          state.messages = [];
        }
      })

      .addCase(joinGroup.fulfilled, (state, action) => {
        const groupId = action.payload;
        const group = state.allGroups.find((g) => g.id === groupId);
        if (group) {
          group.isMember = true;
          group.memberCount += 1;
          if (!state.myGroups.find((g) => g.id === groupId)) {
            state.myGroups.push(group);
          }
        }
      })

      .addCase(leaveGroup.fulfilled, (state, action) => {
        const groupId = action.payload;
        const group = state.allGroups.find((g) => g.id === groupId);
        if (group) {
          group.isMember = false;
          group.memberCount = Math.max(0, group.memberCount - 1);
        }
        state.myGroups = state.myGroups.filter((g) => g.id !== groupId);
      })

      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.myGroups = action.payload;
      });
  },
});

export const { clearError, clearCurrentGroup, addMessage } = groupSlice.actions;
export default groupSlice.reducer;
