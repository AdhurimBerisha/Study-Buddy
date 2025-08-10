import { userResolvers } from "./user";
import { authResolvers } from "./auth";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};
