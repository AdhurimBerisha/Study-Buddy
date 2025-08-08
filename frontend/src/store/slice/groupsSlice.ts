import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Group {
  id: number;
  name: string;
  category: string;
  members: number;
  level: string;
  description?: string;
  upcomingEvent?: string;
  isMember?: boolean;
  createdBy?: string;
  lastActivity?: string;
}

interface GroupState {
  allGroups: Group[];
  myGroups: Group[];
}

const initialState: GroupState = {
  allGroups: [
    {
      id: 101,
      name: "Dummy Group 1",
      category: "Test Category",
      members: 10,
      level: "Beginner",
      description: "This is a dummy group for testing",
      upcomingEvent: "Test Event - Tomorrow",
      isMember: false,
      createdBy: "someoneElse",
      lastActivity: "2025-08-01T12:00:00Z",
    },
    {
      id: 102,
      name: "Dummy Group 2",
      category: "Another Category",
      members: 5,
      level: "Advanced",
      description: "Another dummy group",
      upcomingEvent: "Test Event - Next Week",
      isMember: false,
      createdBy: "someoneElse",
      lastActivity: "2025-07-30T15:00:00Z",
    },
  ],
  myGroups: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<Group>) => {
      state.allGroups.push(action.payload);
      if (action.payload.isMember) {
        state.myGroups.push(action.payload);
      }
    },
    joinGroup: (state, action: PayloadAction<number>) => {
      const group = state.allGroups.find((g) => g.id === action.payload);
      if (group && !group.isMember) {
        group.isMember = true;
        group.members++;
        state.myGroups.push(group);
      }
    },
    leaveGroup: (state, action: PayloadAction<number>) => {
      const group = state.allGroups.find((g) => g.id === action.payload);
      if (group && group.isMember) {
        group.isMember = false;
        group.members = Math.max(0, group.members - 1);
        state.myGroups = state.myGroups.filter((g) => g.id !== action.payload);
      }
    },
  },
});

export const { createGroup, joinGroup, leaveGroup } = groupSlice.actions;
export default groupSlice.reducer;
