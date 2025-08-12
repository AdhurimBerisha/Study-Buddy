import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { groupAPI } from "../../services/api";
import {
  updateGroupInArrays,
  removeGroupFromArrays,
} from "../helpers/groupHelpers";

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

export interface GroupState {
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

export const fetchAllGroups = createAsyncThunk(
  "groups/fetchAllGroups",
  async () => {
    const response = await groupAPI.getAllGroups();
    return response.data;
  }
);

export const fetchGroup = createAsyncThunk(
  "groups/fetchGroup",
  async (id: string) => {
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
    const response = await groupAPI.createGroup(groupData);
    return response.data;
  }
);

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, data }: { id: string; data: UpdateGroupData }) => {
    const response = await groupAPI.updateGroup(id, data);
    return response.data;
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id: string) => {
    await groupAPI.deleteGroup(id);
    return id;
  }
);

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async (id: string) => {
    await groupAPI.joinGroup(id);
    return id;
  }
);

export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async (id: string) => {
    await groupAPI.leaveGroup(id);
    return id;
  }
);

export const fetchMyGroups = createAsyncThunk(
  "groups/fetchMyGroups",
  async () => {
    const response = await groupAPI.getMyGroups();
    return response.data;
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

      .addCase(updateGroup.fulfilled, (state, action) => {
        updateGroupInArrays(state, action.payload);
      })

      .addCase(deleteGroup.fulfilled, (state, action) => {
        removeGroupFromArrays(state, action.payload);
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
        if (state.currentGroup?.id === groupId) {
          state.currentGroup.isMember = true;
          state.currentGroup.memberCount += 1;
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
