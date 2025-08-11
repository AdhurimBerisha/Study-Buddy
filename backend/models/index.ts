import User from "./User";
import Group from "./Group";
import GroupMember from "./GroupMember";
import Message from "./Message";

// User - Group relationships (many-to-many through GroupMember)
User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: "userId",
  as: "groups",
});

Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: "groupId",
  as: "members",
});

// User - GroupMember relationships
User.hasMany(GroupMember, {
  foreignKey: "userId",
  as: "groupMemberships",
});

GroupMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Group - GroupMember relationships
Group.hasMany(GroupMember, {
  foreignKey: "groupId",
  as: "memberships",
});

GroupMember.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
});

// Group - Message relationships
Group.hasMany(Message, {
  foreignKey: "groupId",
  as: "messages",
});

Message.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
});

// User - Message relationships
User.hasMany(Message, {
  foreignKey: "userId",
  as: "messages",
});

Message.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Message - Message relationships (for replies)
Message.hasMany(Message, {
  foreignKey: "replyTo",
  as: "replies",
});

Message.belongsTo(Message, {
  foreignKey: "replyTo",
  as: "parentMessage",
});

// Group creator relationship
Group.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Group, {
  foreignKey: "createdBy",
  as: "createdGroups",
});

export { User, Group, GroupMember, Message };
