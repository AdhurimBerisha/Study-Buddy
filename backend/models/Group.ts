import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

export interface GroupAttributes {
  id: string;
  name: string;
  description?: string;
  category: string;
  level: string;
  maxMembers?: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GroupCreationAttributes
  extends Optional<
    GroupAttributes,
    "id" | "description" | "maxMembers" | "createdAt" | "updatedAt"
  > {}

export class Group extends Model<GroupAttributes, GroupCreationAttributes> {}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 50] },
    },
    level: {
      type: DataTypes.ENUM(
        "Beginner",
        "Intermediate",
        "Advanced",
        "All Levels"
      ),
      allowNull: false,
      defaultValue: "All Levels",
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 2, max: 1000 },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "groups",
    timestamps: true,
    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["level"],
      },
      {
        fields: ["createdBy"],
      },
    ],
  }
);

export default Group;
