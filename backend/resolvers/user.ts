import sequelize from "../config/db";

export const userResolvers = {
  Query: {
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
    myProfile: async (_: any, __: any, context: any) => {
      try {
        const userId = context.user?.id;

        if (!userId) {
          throw new Error("Authentication required");
        }

        const User = sequelize.models.User;
        if (!User) {
          throw new Error("User model not found");
        }

        const user = await User.findByPk(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const plainUser = user.get({ plain: true });
        delete plainUser.password;

        return plainUser;
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        throw new Error(error.message);
      }
    },
  },

  Mutation: {},
};
