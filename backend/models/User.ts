import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface UserAttributes {
  id: string;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  googleId?: string | null;
  role: "user" | "tutor" | "admin";
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "phone"
    | "avatar"
    | "googleId"
    | "isEmailVerified"
    | "emailVerificationToken"
    | "emailVerificationExpires"
    | "createdAt"
    | "updatedAt"
  > {}

export class User extends Model<UserAttributes, UserCreationAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("user", "tutor", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

export default User;
