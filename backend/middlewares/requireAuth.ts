import type { Request, Response, NextFunction } from "express";
import sequelize from "../config/db";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatar?: string | null;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    const User = sequelize.models.User;
    if (!User) return res.status(500).json({ message: "User model not found" });
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = (user as any).toJSON();
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
