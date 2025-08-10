import { gql } from "graphql-tag";

export const authSchema = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): User!
    login(email: String!, password: String!): AuthPayload!
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): AuthPayload!
    logout: Boolean!
  }
`;
