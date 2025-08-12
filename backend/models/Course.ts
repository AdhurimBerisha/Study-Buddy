import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string | null;
  totalLessons?: number | null;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseCreationAttributes
  extends Optional<
    CourseAttributes,
    "id" | "thumbnail" | "totalLessons" | "createdAt" | "updatedAt"
  > {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> {
  // Sequelize will automatically create getters/setters for all attributes
  // The interface is just for type checking, not implementation
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100] },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100] },
    },
    level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
      defaultValue: "beginner",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalLessons: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
      field: "total_lessons",
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "created_by",
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "courses",
    timestamps: true,
    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["level"],
      },
      {
        fields: ["created_by"],
      },
    ],
  }
);

export default Course;
