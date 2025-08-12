import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface LessonProgressAttributes {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent?: number; // in seconds
  lastAccessedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonProgressCreationAttributes
  extends Optional<
    LessonProgressAttributes,
    "id" | "isCompleted" | "createdAt" | "updatedAt"
  > {}

export class LessonProgress extends Model<
  LessonProgressAttributes,
  LessonProgressCreationAttributes
> {
  // Sequelize will automatically create getters/setters for all attributes
}

LessonProgress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "lessons",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
      comment: "Time spent on lesson in seconds",
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
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
    tableName: "lesson_progress",
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "courseId"],
      },
      {
        fields: ["userId", "lessonId"],
        unique: true,
      },
      {
        fields: ["courseId"],
      },
    ],
  }
);

export default LessonProgress;
