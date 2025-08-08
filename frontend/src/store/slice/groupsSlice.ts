import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Group {
  id: number;
  name: string;
  category: string;
  isMember: boolean;
  members: number;
  createdBy: string;
  description?: string;
  lastActivity?: string;
}

interface GroupState {
  allGroups: Group[];
  myGroups: Group[];
}

const initialState: GroupState = {
  allGroups: [],
  myGroups: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<Group>) => {
      state.allGroups.push(action.payload);

      // Automatically add to `myGroups` if created by user
      if (action.payload.isMember) {
        state.myGroups.push(action.payload);
      }
    },
    joinGroup: (state, action: PayloadAction<number>) => {
      const group = state.allGroups.find((g) => g.id === action.payload);
      if (group && !group.isMember) {
        group.isMember = true;
        group.members += 1;
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
    // Optional: fetch all groups (for simulation)
    setAllGroups: (state, action: PayloadAction<Group[]>) => {
      state.allGroups = action.payload;
      state.myGroups = action.payload.filter((g) => g.isMember);
    },
  },
});

export const { createGroup, joinGroup, leaveGroup, setAllGroups } =
  groupSlice.actions;

export default groupSlice.reducer;
