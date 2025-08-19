import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface TutorAttributes {
  id: string;
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalLessons: number;
  isVerified: boolean;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TutorCreationAttributes
  extends Optional<
    TutorAttributes,
    | "id"
    | "rating"
    | "totalStudents"
    | "totalLessons"
    | "isVerified"
    | "avatar"
    | "createdAt"
    | "updatedAt"
  > {}

export class Tutor extends Model<TutorAttributes, TutorCreationAttributes> {}

Tutor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [10, 1000] },
    },
    expertise: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    totalStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "total_students",
      validate: { min: 0 },
    },
    totalLessons: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "total_lessons",
      validate: { min: 0 },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "tutors",
    timestamps: true,
  }
);

export default Tutor;
