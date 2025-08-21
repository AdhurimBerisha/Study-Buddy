import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { handleError } from "../helpers/errorHelper";
import emailService from "../services/emailService";
import {
  generateVerificationToken,
  generateVerificationExpiry,
} from "../utils/verificationToken";
import { Op } from "sequelize";

const getRedirectPath = (role: string) => {
  if (role === "admin") {
    return "/dashboard";
  } else if (role === "tutor") {
    return "/dashboard";
  } else {
    return "/";
  }
};

const userSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Email, password, firstName, and lastName are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const verificationExpiry = generateVerificationExpiry();

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: "user",
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
      isEmailVerified: false,
    });

    const userPlain = user.get({ plain: true }) as any;

    try {
      await emailService.sendVerificationEmail(
        email,
        verificationToken,
        firstName
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    const token = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
      role: userPlain.role,
    });

    res.status(201).json({
      success: true,
      message:
        "User created successfully. Please check your email to verify your account.",
      token,
      user: userPlain,
      redirectTo: getRedirectPath(userPlain.role),
      requiresEmailVerification: true,
    });
  } catch (e) {
    console.error("Error during user creation:", e);
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

    if (!userPlain.password) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please use Google to sign in.",
      });
    }

    const isValid = await bcrypt.compare(password, userPlain.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!userPlain.isEmailVerified) {
      return res.status(401).json({
        message:
          "Please verify your email address before logging in. Check your inbox for a verification email.",
        requiresEmailVerification: true,
        email: userPlain.email,
      });
    }

    delete userPlain.password;

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
      if ((user as any).role !== "user") {
        return res.status(403).json({
          message: "Admin and tutor accounts cannot use Google sign-in",
        });
      }

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

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

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

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

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

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const userWithToken = await User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (userWithToken && userWithToken.get("isEmailVerified")) {
      return res.json({
        success: true,
        message: "Email is already verified! You can log in to your account.",
        alreadyVerified: true,
      });
    }

    if (!userWithToken) {
      return res.json({
        success: true,
        message:
          "This verification link has already been used. Your email is verified and you can log in to your account.",
        alreadyVerified: true,
        tokenConsumed: true,
      });
    }

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    return res.json({
      success: true,
      message:
        "Email verified successfully! You can now log in to your account.",
    });
  } catch (e) {
    console.error("Error in verifyEmail:", e);
    handleError(res, e, "Error verifying email");
  }
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.get("isEmailVerified")) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = generateVerificationToken();
    const verificationExpiry = generateVerificationExpiry();

    await user.update({
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    });

    try {
      await emailService.sendVerificationEmail(
        email,
        verificationToken,
        user.get("firstName") as string
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again later.",
      });
    }

    return res.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (e) {
    handleError(res, e, "Error resending verification email");
  }
};

export {
  userSignup,
  userLogin,
  googleAuth,
  promoteToAdmin,
  createAdminAccount,
  createTutorAccount,
  verifyEmail,
  resendVerificationEmail,
};
