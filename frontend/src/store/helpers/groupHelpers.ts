import type { GroupState, Group } from "../slice/groupsSlice";

export const updateGroupInArrays = (state: GroupState, updatedGroup: Group) => {
  state.allGroups = state.allGroups.map((group) =>
    group.id === updatedGroup.id ? updatedGroup : group
  );
  state.myGroups = state.myGroups.map((group) =>
    group.id === updatedGroup.id ? updatedGroup : group
  );
  if (state.currentGroup?.id === updatedGroup.id) {
    state.currentGroup = updatedGroup;
  }
};

export const removeGroupFromArrays = (state: GroupState, groupId: string) => {
  state.allGroups = state.allGroups.filter((group) => group.id !== groupId);
  state.myGroups = state.myGroups.filter((group) => group.id !== groupId);
  if (state.currentGroup?.id === groupId) {
    state.currentGroup = null;
    state.messages = [];
  }
};
