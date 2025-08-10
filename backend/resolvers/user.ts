import sequelize from "../config/db";
import { CreateUserInput } from "../schema/user";

export const userResolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    users: async () => {
      try {
        const User = sequelize.models.User;
        if (User) {
          return await User.findAll();
        }
        return [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  },

  Mutation: {
    // User profile management operations
  },
};
