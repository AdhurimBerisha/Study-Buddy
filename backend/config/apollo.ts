import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../schema";
import { resolvers } from "../resolvers";

export const createApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  return server;
};
