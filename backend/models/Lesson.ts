import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface LessonAttributes {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  duration?: number; // in minutes
  resources?: string; // JSON string for lesson resources
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonCreationAttributes
  extends Optional<
    LessonAttributes,
    "id" | "isActive" | "createdAt" | "updatedAt"
  > {}

export class Lesson extends Model<LessonAttributes, LessonCreationAttributes> {
  // Sequelize will automatically create getters/setters for all attributes
}

Lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255] },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1 },
    },
    resources: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON string containing lesson resources",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "lessons",
    timestamps: true,
    indexes: [
      {
        fields: ["courseId"],
      },
      {
        fields: ["courseId", "order"],
      },
    ],
  }
);

export default Lesson;
