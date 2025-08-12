import User from "./User";
import Group from "./Group";
import GroupMember from "./GroupMember";
import Message from "./Message";
import Course from "./Course";
import Lesson from "./Lesson";
import LessonProgress from "./LessonProgress";
import Purchase from "./Purchase";

// Course - User relationships
Course.belongsTo(User, {
  foreignKey: "createdBy",
  as: "instructor",
});

User.hasMany(Course, {
  foreignKey: "createdBy",
  as: "createdCourses",
});

// Course - Lesson relationships
Course.hasMany(Lesson, {
  foreignKey: "courseId",
  as: "lessons",
});

Lesson.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

// User - Lesson Progress relationships
User.hasMany(LessonProgress, {
  foreignKey: "userId",
  as: "lessonProgress",
});

LessonProgress.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

LessonProgress.belongsTo(Lesson, {
  foreignKey: "lessonId",
  as: "lesson",
});

LessonProgress.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

// Purchase relationships
User.hasMany(Purchase, {
  foreignKey: "userId",
  as: "purchases",
});

Purchase.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Course.hasMany(Purchase, {
  foreignKey: "courseId",
  as: "purchases",
});

Purchase.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

// Group relationships
User.hasMany(Group, {
  foreignKey: "createdBy",
  as: "createdGroups",
});

Group.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: "groupId",
  otherKey: "userId",
  as: "members",
});

User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: "userId",
  otherKey: "groupId",
  as: "groups",
});

// Message relationships
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

Group.hasMany(Message, {
  foreignKey: "groupId",
  as: "messages",
});

Message.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
});

export {
  User,
  Group,
  GroupMember,
  Message,
  Course,
  Lesson,
  LessonProgress,
  Purchase,
};
