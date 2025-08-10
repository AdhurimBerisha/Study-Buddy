import { baseApi } from "./baseApi";

interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

interface LoginResponse {
  token: string;
  user: UserDto;
}

interface RegisterResponse {
  createUser: UserDto;
}

interface ProfileResponse {
  myProfile: UserDto;
}

type GqlEnvelope<T> = { data: T; errors?: Array<{ message: string }> };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: ({ email, password }) => ({
          url: "",
          method: "POST",
          body: JSON.stringify({
            query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                user { id email firstName lastName phone }
              }
            }
          `,
            variables: { email, password },
          }),
        }),
        transformResponse: (response: GqlEnvelope<{ login: LoginResponse }>) =>
          response.data.login,
      }
    ),

    register: builder.mutation<
      RegisterResponse["createUser"],
      {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
      }
    >({
      query: (input) => ({
        url: "",
        method: "POST",
        body: JSON.stringify({
          query: `
            mutation CreateUser($email: String!, $password: String!, $firstName: String!, $lastName: String!, $phone: String) {
              createUser(email: $email, password: $password, firstName: $firstName, lastName: $lastName, phone: $phone) {
                id email firstName lastName phone
              }
            }
          `,
          variables: input,
        }),
      }),
      transformResponse: (response: GqlEnvelope<RegisterResponse>) =>
        response.data.createUser,
    }),

    myProfile: builder.query<ProfileResponse["myProfile"], void>({
      query: () => ({
        url: "",
        method: "POST",
        body: JSON.stringify({
          query: `
            query { myProfile { id email firstName lastName phone } }
          `,
        }),
      }),
      transformResponse: (response: GqlEnvelope<ProfileResponse>) =>
        response.data.myProfile,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMyProfileQuery } =
  authApi;
