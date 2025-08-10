import sequelize from "../config/db";
import { CreateUserInput } from "../schema/user";

export const authResolvers = {
  Mutation: {
    createUser: async (
      _: any,
      { email, firstName, lastName }: CreateUserInput
    ) => {
      try {
        const User = sequelize.models.User;
        if (User) {
          console.log("🔍 Creating user with:", { email, firstName, lastName });
          const user = await User.create({
            email,
            firstName: firstName,
            lastName: lastName,
            password: "temp123",
          });
          console.log("✅ User created:", user.toJSON());
          const plainUser = user.get({ plain: true });
          console.log("🔍 Returning plain user:", plainUser);
          return plainUser;
        }
        throw new Error("User model not found");
      } catch (error: any) {
        console.error("❌ Error creating user:", error);
        throw new Error(error.message);
      }
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      throw new Error("Login not implemented yet");
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
