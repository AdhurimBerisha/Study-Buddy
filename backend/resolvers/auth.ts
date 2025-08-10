import sequelize from "../config/db";
import { CreateUserInput } from "../schema/user";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const authResolvers = {
  Mutation: {
    createUser: async (
      _: any,
      {
        email,
        firstName,
        lastName,
        password,
      }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    ) => {
      try {
        const User = sequelize.models.User;
        if (User) {
          const saltRounds = 12;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          console.log("🔍 Creating user with:", { email, firstName, lastName });
          const user = await User.create({
            email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
          });
          console.log("✅ User created:", user.toJSON());
          const plainUser = user.get({ plain: true });
          console.log("🔍 Returning plain user:", plainUser);
          return plainUser;
        }
        throw new Error("User model not found");
      } catch (error: any) {
        console.error("❌ Error creating user:", error);
        console.error("❌ Full error details:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
      }
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        const User = sequelize.models.User;
        if (!User) {
          throw new Error("User model not found");
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          user.getDataValue("password")
        );
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        const plainUser = user.get({ plain: true });
        delete plainUser.password;

        const token = generateToken({
          userId: plainUser.id,
          email: plainUser.email,
        });

        console.log("🎉 User successfully logged in:", plainUser.email);

        return {
          token,
          user: plainUser,
        };
      } catch (error: any) {
        console.error("❌ Login error:", error);
        throw new Error(error.message);
      }
    },

    register: async (
      _: any,
      {
        email,
        password,
        firstName,
        lastName,
      }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    ) => {
      throw new Error("Registration not implemented yet");
    },

    logout: async () => {
      return true;
    },
  },
};
