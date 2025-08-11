import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

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

    // Fix: Use consistent password access method like in signup
    const userPlain = user.get({ plain: true });
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

export { userSignup, userLogin };
