import { Request } from "express";
import { verifyToken, JWTPayload } from "../utils/jwt";
import sequelize from "../config/db";

export interface AuthContext {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authMiddleware = async (req: Request): Promise<AuthContext> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {}; // No user context
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify JWT token
    const payload = verifyToken(token);

    // Find user in database
    const User = sequelize.models.User;
    if (User) {
      const user = await User.findByPk(payload.userId);
      if (user) {
        const plainUser = user.get({ plain: true });
        delete plainUser.password;
        return { user: plainUser };
      }
    }

    return {}; // User not found
  } catch (error) {
    console.error("Auth middleware error:", error);
    return {}; // Invalid token or error occurred
  }
};
