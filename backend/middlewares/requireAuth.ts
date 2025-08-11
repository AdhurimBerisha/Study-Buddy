import type { Request, Response, NextFunction } from "express";
import sequelize from "../config/db";
import { verifyToken } from "../utils/jwt";

// Extend Express Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: any; // You can make this more specific based on your User model type
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
    req.user = user.get({ plain: true });
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
