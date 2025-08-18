# Dashboard System

This dashboard system provides role-based access control for different user types in the StudyBuddy platform.

## User Account Types

### Regular Users (accountType: "regular")

- **Default role**: "user"
- **Google sign-in**: ✅ Allowed
- **Dashboard access**: ❌ No access (redirected to main website)
- **Can use**: All regular platform features (courses, groups, learning, etc.)

### Admin Accounts (accountType: "admin")

- **Role**: "admin"
- **Google sign-in**: ❌ Not allowed (password-only)
- **Dashboard access**: ✅ Full admin dashboard
- **Features**:
  - User management (view all users, promote to admin)
  - Course overview and moderation
  - Platform statistics and analytics
  - System-wide controls

### Tutor Accounts (accountType: "tutor")

- **Role**: "tutor"
- **Google sign-in**: ❌ Not allowed (password-only)
- **Dashboard access**: ✅ Tutor dashboard
- **Features**:
  - Course management (create, edit, view)
  - Student progress tracking
  - Revenue and rating analytics
  - Student communication tools

## How It Works

1. **Account Creation**:

   - Regular users: Sign up through normal registration (Google sign-in allowed)
   - Admin/Tutor accounts: Created through special endpoints or utility scripts
   - No Google sign-in for admin/tutor accounts

2. **Login & Redirection**:

   - Single login form for all account types
   - Automatic redirection based on account type:
     - Regular users → Home page (/)
     - Admin accounts → Dashboard (/dashboard)
     - Tutor accounts → Dashboard (/dashboard)

3. **Access Control**:
   - Dashboard link only visible to admin/tutor users
   - Protected routes ensure proper access
   - Role-based component rendering

## Creating Admin/Tutor Accounts

### Option 1: API Endpoints

```bash
# Create admin account
POST /auth/create-admin
{
  "email": "admin@studybuddy.com",
  "password": "securepassword",
  "firstName": "Admin",
  "lastName": "User"
}

# Create tutor account
POST /auth/create-tutor
{
  "email": "tutor@studybuddy.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Option 2: Utility Script

```typescript
import { createAdminAccount, createTutorAccount } from "./utils/createAccounts";

// Create admin
await createAdminAccount("admin@studybuddy.com", "admin123", "Admin", "User");

// Create tutor
await createTutorAccount(
  "tutor@studybuddy.com",
  "tutor123",
  "John",
  "Doe",
  "+1234567890"
);
```

## Navigation

- **Desktop**: Dashboard link appears in user profile dropdown (top-right)
- **Mobile**: Dashboard link appears in mobile menu under user profile
- **Access**: Only visible to users with admin/tutor account types or tutor role

## Technical Implementation

- **Backend**:
  - `accountType` field in User model (ENUM: 'regular', 'admin', 'tutor')
  - Role-based authentication and authorization
  - Separate endpoints for admin/tutor account creation
- **Frontend**:
  - Automatic redirection after login
  - Conditional navigation rendering
  - Protected dashboard routes
- **Security**:
  - Admin/tutor accounts cannot use Google sign-in
  - Password-only authentication for privileged accounts
  - Role-based access control

## Future Enhancements

- Real-time data updates
- Advanced analytics and reporting
- Bulk operations for admins
- Enhanced tutor tools and student management
- Integration with external analytics services
- Account type conversion workflows
