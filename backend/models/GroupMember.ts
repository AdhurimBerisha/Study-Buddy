import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface GroupMemberAttributes {
  id: string;
  groupId: string;
  userId: string;
  role: "member" | "moderator" | "admin";
  joinedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GroupMemberCreationAttributes
  extends Optional<
    GroupMemberAttributes,
    "id" | "joinedAt" | "createdAt" | "updatedAt"
  > {}

export class GroupMember extends Model<
  GroupMemberAttributes,
  GroupMemberCreationAttributes
> {
  // Sequelize will automatically create getters/setters for all attributes
  // The interface is just for type checking, not implementation
}

GroupMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "groups",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("member", "moderator", "admin"),
      allowNull: false,
      defaultValue: "member",
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "group_members",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["groupId", "userId"],
      },
      {
        fields: ["groupId"],
      },
      {
        fields: ["userId"],
      },
    ],
  }
);

export default GroupMember;
