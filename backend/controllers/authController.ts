import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { handleError } from "../helpers/errorHelper";

// Helper function to determine redirect path
const getRedirectPath = (role: string) => {
  if (role === "admin") {
    return "/dashboard";
  } else if (role === "tutor") {
    return "/dashboard";
  } else {
    return "/"; // Regular users go to main website
  }
};

const userSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Email, password, firstName, and lastName are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with default role
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: "user",
    });

    const userPlain = user.get({ plain: true }) as any;

    // Generate token with role
    const token = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
      role: userPlain.role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: userPlain,
      redirectTo: getRedirectPath(userPlain.role),
    });
  } catch (e) {
    handleError(res, e, "Error creating user");
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userPlain = user.get({ plain: true }) as any;

    // Check if this is a Google-only account
    if (!userPlain.password) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please use Google to sign in.",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, userPlain.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    delete userPlain.password;

    // Generate token with role only
    const token = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
      role: userPlain.role,
    });

    return res.json({
      token,
      user: userPlain,
      redirectTo: getRedirectPath(userPlain.role),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    return res.status(400).json({ message });
  }
};

const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body as { token: string };

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const {
      email,
      given_name,
      family_name,
      sub: googleId,
      picture,
      name,
    } = payload;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email not found in Google token" });
    }

    let firstName = "Google";
    let lastName = "User";

    if (given_name && family_name) {
      firstName = given_name.trim().replace(/\s+/g, " ");
      lastName = family_name.trim().replace(/\s+/g, " ");
    } else if (given_name && !family_name) {
      firstName = given_name.trim().replace(/\s+/g, " ");
      lastName = "";
    } else if (name) {
      const nameParts = name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      } else if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = "";
      }
    }

    if (firstName === "Google" && email.includes("@gmail.com")) {
      const emailPrefix = email.split("@")[0];
      if (emailPrefix && emailPrefix !== "anbupsycho") {
        firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        lastName = "";
      }
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new regular user account
      user = await User.create({
        email,
        firstName,
        lastName,
        password: null,
        googleId,
        avatar: picture || null,
        role: "user",
      });
    } else {
      // Check if this is an admin/tutor account
      if ((user as any).role !== "user") {
        return res.status(403).json({
          message: "Admin and tutor accounts cannot use Google sign-in",
        });
      }

      // Update existing user
      if (!(user as any).googleId) {
        await user.update({
          googleId,
          avatar: picture || (user as any).avatar,
        });
      } else if (picture && !(user as any).avatar) {
        await user.update({ avatar: picture });
      }
    }

    const userPlain = user.get({ plain: true }) as any;
    delete userPlain.password;

    const jwtToken = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
      role: userPlain.role,
    });

    return res.json({
      token: jwtToken,
      user: userPlain,
      redirectTo: getRedirectPath(userPlain.role),
    });
  } catch (e) {
    console.error("Google auth error:", e);
    const message =
      e instanceof Error ? e.message : "Google authentication failed";
    return res.status(400).json({ message });
  }
};

const createAdminAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password and create admin
    const hashed = await bcrypt.hash(password, 12);
    const admin = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: "admin",
    });

    const adminPlain = admin.get({ plain: true }) as any;
    delete adminPlain.password;

    return res.status(201).json({
      message: "Admin account created successfully",
      admin: adminPlain,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create admin account";
    return res.status(400).json({ message });
  }
};

const createTutorAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password and create tutor
    const hashed = await bcrypt.hash(password, 12);
    const tutor = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      phone: phone || null,
      role: "tutor",
    });

    const tutorPlain = tutor.get({ plain: true }) as any;
    delete tutorPlain.password;

    return res.status(201).json({
      message: "Tutor account created successfully",
      tutor: tutorPlain,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create tutor account";
    return res.status(400).json({ message });
  }
};

const promoteToAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.body;

    // Only existing admins can promote users to admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can promote users" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      role: "admin",
    });

    const userPlain = user.get({ plain: true }) as any;
    delete userPlain.password;

    return res.json({
      message: "User promoted to admin successfully",
      user: userPlain,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to promote user";
    return res.status(400).json({ message });
  }
};

export {
  userSignup,
  userLogin,
  googleAuth,
  promoteToAdmin,
  createAdminAccount,
  createTutorAccount,
};
