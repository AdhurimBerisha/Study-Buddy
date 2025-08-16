import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

const userSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    };
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      phone: phone ?? null,
    });
    const plain = user.get({ plain: true });
    delete (plain as any).password;
    return res.status(201).json(plain);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed";
    return res.status(400).json({ message });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const userPlain = user.get({ plain: true });

    if (!userPlain.password) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please use Google to sign in.",
      });
    }

    const isValid = await bcrypt.compare(password, userPlain.password);

    if (!isValid)
      return res.status(401).json({ message: "Invalid email or password" });

    delete (userPlain as any).password;
    const token = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
    });
    return res.json({ token, user: userPlain });
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
      });
    } else if (!(user as any).googleId) {
      await user.update({
        googleId,
        avatar: picture || (user as any).avatar,
      });
    } else if (picture && !(user as any).avatar) {
      await user.update({ avatar: picture });
    }

    const userPlain = user.get({ plain: true });
    delete (userPlain as any).password;

    const jwtToken = generateToken({
      userId: userPlain.id,
      email: userPlain.email,
    });

    return res.json({ token: jwtToken, user: userPlain });
  } catch (e) {
    console.error("Google auth error:", e);
    const message =
      e instanceof Error ? e.message : "Google authentication failed";
    return res.status(400).json({ message });
  }
};

export { userSignup, userLogin, googleAuth };
