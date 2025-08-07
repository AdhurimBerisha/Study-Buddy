import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Group {
  id: number;
  name: string;
  category: string;
  members: number;
  createdBy: string;
  description?: string;
  lastActivity?: string;
  unreadMessages?: number;
  pendingTasks?: number;
}

interface GroupState {
  allGroups: [];
  myGroups: Group[];
}
