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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "phone" | "avatar" | "googleId" | "createdAt" | "updatedAt"
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
      validate: { len: [6, 255] },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
      validate: { len: [1, 50] },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name",
      validate: { len: [0, 50] },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { is: /^[+]?[1-9][\d\s\-()]+$/ },
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "google_id",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default User;
