import bcrypt from "bcryptjs";
import User from "../models/User";
import Tutor from "../models/Tutor";

export const createAdminAccount = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
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

    const adminPlain = admin.get({ plain: true });
    delete (adminPlain as any).password;

    console.log("Admin account created successfully:", adminPlain);
    return adminPlain;
  } catch (error) {
    console.error("Failed to create admin account:", error);
    throw error;
  }
};

export const createTutorAccount = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password and create tutor user
    const hashed = await bcrypt.hash(password, 12);
    const tutorUser = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      phone: phone || null,
      role: "tutor",
    });

    // Create tutor profile
    const tutorProfile = await Tutor.create({
      userId: (tutorUser as any).id,
      bio: "Experienced tutor with expertise in various subjects.",
      expertise: ["General Education", "Mathematics", "Science"],
      hourlyRate: 25.0,
      rating: 0,
      totalStudents: 0,
      totalLessons: 0,
      isVerified: false,
    });

    const tutorUserPlain = tutorUser.get({ plain: true });
    delete (tutorUserPlain as any).password;

    console.log("Tutor account and profile created successfully:", {
      user: tutorUserPlain,
      profile: tutorProfile.get({ plain: true }),
    });

    return { user: tutorUserPlain, profile: tutorProfile.get({ plain: true }) };
  } catch (error) {
    console.error("Failed to create tutor account:", error);
    throw error;
  }
};

// Example usage (uncomment to use):
/*
import { createAdminAccount, createTutorAccount } from './utils/createAccounts';

// Create an admin account
createAdminAccount(
  'admin@studybuddy.com',
  'admin123',
  'Admin',
  'User'
);

// Create a tutor account
createTutorAccount(
  'tutor@studybuddy.com',
  'tutor123',
  'John',
  'Doe',
  '+1234567890'
);
*/
