import { gql } from "graphql-tag";

// User interfaces
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// GraphQL schema
export const userSchema = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    hello: String!
    users: [User!]!
    myProfile: User!
  }
`;
