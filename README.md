# StudyBuddy — Your Pathway to a Tech Career

![StudyBuddy Website](./StudyBuddy.png)

StudyBuddy is a modern e-learning platform built for aspiring tech professionals. It offers expert-led courses, collaborative group learning, personalized study paths, real-time support, and career-focused resources, making it easier than ever to gain skills, connect with peers, and launch your tech career with confidence.

## Features

- Access a wide range of tech-focused learning resources
- Learn collaboratively in groups to enhance understanding
- Track your progress and set personal learning goals
- Engage with peers through real-time group study sessions
- Explore curated learning paths tailored to various tech careers

## Tech Stack

**Frontend:**
- React
- Redux for global state management
- Tailwind CSS for UI styling
- Google OAuth for third-party authentication

**Backend:**
- Node.js with Express.js
- MySQL database with Sequelize ORM
- Google OAuth verification for validating Google ID tokens

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/AdhurimBerisha/Study-Buddy.git
   ```

2. Install dependencies for frontend and backend

   ```bash
   cd frontend
   npm install

   cd backend
   npm install
   ```

3. Set up environment variables (see below)

## Environment Variables

This project requires a few environment variables to run properly.

- For the **api**, create a `.env` file.  
- For the **client**, create a `.env` file.

### backend `.env` variables include:

- `CLOUDINARY_NAME` — your_cloud_name
- `CLOUDINARY_API_KEY` — your_api_key
- `CLOUDINARY_SECRET_KEY` — your_api_secret
- `JWT_SECRET` — your_jwt_secret

- `MYSQL_HOST` — your_mysql_host
- `MYSQL_USER` — your_mysql_user
- `MYSQL_PASSWORD` — your_mysql_password
- `MYSQL_DB` — your_mysql_database

- `GOOGLE_CLIENT_ID` — your_google_client_id_here  

### frontend `.env` variables include:
- `VITE_API_URL` — http://localhost:8080/api
- `VITE_SOCKET_URL` — http://localhost:8080
- `VITE_EMAILJS_SERVICE_ID` — your_service_id_here
- `VITE_EMAILJS_TEMPLATE_ID` — your_template_id_here
- `VITE_EMAILJS_PUBLIC_KEY` — your_public_key_here
- `VITE_GOOGLE_CLIENT_ID` — your_google_client_id_here 

4. Run the development servers

   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev
   ```
