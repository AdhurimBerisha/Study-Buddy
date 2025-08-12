import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface CourseEnrollmentAttributes {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt?: Date;
  completedAt?: Date | null;
  progress: number; // 0-100
  lastAccessedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseEnrollmentCreationAttributes
  extends Optional<
    CourseEnrollmentAttributes,
    | "id"
    | "enrolledAt"
    | "completedAt"
    | "progress"
    | "lastAccessedAt"
    | "createdAt"
    | "updatedAt"
  > {}

export class CourseEnrollment extends Model<
  CourseEnrollmentAttributes,
  CourseEnrollmentCreationAttributes
> {
  // Sequelize will automatically create getters/setters for all attributes
  // The interface is just for type checking, not implementation
}

CourseEnrollment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "course_id",
      references: {
        model: "courses",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    enrolledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "enrolled_at",
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "completed_at",
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_accessed_at",
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
    tableName: "course_enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["course_id", "user_id"],
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["course_id"],
      },
    ],
  }
);

export default CourseEnrollment;
