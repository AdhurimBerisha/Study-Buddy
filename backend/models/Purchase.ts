import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db";

interface PurchaseAttributes {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: Date;
  amount: number;
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
  transactionId?: string;
}

interface PurchaseCreationAttributes
  extends Omit<PurchaseAttributes, "id" | "purchaseDate"> {
  id?: string;
  purchaseDate?: Date;
}

class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare courseId: string;
  declare purchaseDate: Date;
  declare amount: number;
  declare status: "completed" | "pending" | "failed";
  declare paymentMethod?: string;
  declare transactionId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Purchase.init(
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
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "failed"),
      allowNull: false,
      defaultValue: "completed",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Purchase",
    tableName: "purchases",
    timestamps: true,
  }
);

export default Purchase;
