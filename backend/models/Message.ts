import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

export interface MessageAttributes {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  messageType: "text" | "image" | "file" | "link";
  replyTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    "id" | "messageType" | "replyTo" | "createdAt" | "updatedAt"
  > {}

export class Message extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {}

Message.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file", "link"),
      allowNull: false,
      defaultValue: "text",
    },
    replyTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "messages",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
    indexes: [
      {
        fields: ["groupId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default Message;
