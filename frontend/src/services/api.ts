export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export class ApiService {
  static async graphqlRequest<
    T,
    V extends Record<string, unknown> | undefined = undefined
  >(query: string, variables?: V, token?: string): Promise<T> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        throw new Error("No data received from server");
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async login(email: string, password: string) {
    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
            firstName
            lastName
          }
        }
      }
    `;

    return this.graphqlRequest<
      {
        login: {
          token: string;
          user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
          };
        };
      },
      { email: string; password: string }
    >(query, { email, password });
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const query = `
      mutation CreateUser($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
        createUser(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
          id
          email
          firstName
          lastName
        }
      }
    `;

    return this.graphqlRequest<
      {
        createUser: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
        };
      },
      { email: string; password: string; firstName: string; lastName: string }
    >(query, { email, password, firstName, lastName });
  }

  static async getProfile(token: string) {
    const query = `
      query {
        myProfile {
          id
          email
          firstName
          lastName
        }
      }
    `;

    return this.graphqlRequest<{
      myProfile: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    }>(query, undefined, token);
  }
}
