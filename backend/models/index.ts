import User from "./User";
import Group from "./Group";
import GroupMember from "./GroupMember";
import Message from "./Message";
import Course from "./Course";
import Lesson from "./Lesson";
import LessonProgress from "./LessonProgress";
import Purchase from "./Purchase";
import Tutor from "./Tutor";

User.hasOne(Tutor, {
  foreignKey: "userId",
  as: "tutorProfile",
});

Tutor.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Tutor.hasMany(Course, {
  foreignKey: "tutorId",
  as: "courses",
});

Course.belongsTo(Tutor, {
  foreignKey: "tutorId",
  as: "tutor",
});

Course.belongsTo(User, {
  foreignKey: "tutorId",
  as: "tutorUser",
});

User.hasMany(Course, {
  foreignKey: "tutorId",
  as: "tutorCourses",
});

Course.hasMany(Lesson, {
  foreignKey: "courseId",
  as: "lessons",
});

Lesson.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

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

GroupMember.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
});

GroupMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Group.hasMany(GroupMember, {
  foreignKey: "groupId",
  as: "groupMembers",
});

User.hasMany(GroupMember, {
  foreignKey: "userId",
  as: "groupMemberships",
});

User.hasMany(Message, {
  foreignKey: "userId",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "userId",
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
  Tutor,
};
