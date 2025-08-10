# StudyBuddy Backend

## File Structure

```
backend/
├── config/
│   ├── db.ts          # Database configuration with Sequelize
│   └── apollo.ts      # Apollo Server configuration
├── models/
│   └── User.ts        # User model definition
├── schema/
│   └── index.ts       # GraphQL schema definitions
├── resolvers/
│   ├── index.ts       # Main resolvers file
│   └── user.ts        # User-specific resolvers
├── types/
│   └── graphql.ts     # TypeScript type definitions
├── server.ts          # Main server file
└── package.json
```

## GraphQL API

### Queries

- `hello`: Returns a greeting message
- `users`: Returns all users

### Mutations

- `createUser(email, firstName, lastName)`: Creates a new user

### Example Usage

```graphql
# Create a user
mutation {
  createUser(email: "john@example.com", firstName: "John", lastName: "Doe") {
    id
    email
    firstName
    lastName
  }
}

# Get all users
query {
  users {
    id
    email
    firstName
    lastName
  }
}
```

## Running the Server

```bash
npm run dev
```

The GraphQL playground will be available at: http://localhost:8080/graphql
