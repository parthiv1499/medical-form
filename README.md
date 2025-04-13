# Medical Form Application

A comprehensive medical form application with user authentication and conversation history.

## Features

- User registration and login
- Medical symptom form submission
- AI-powered symptom analysis using OpenAI's API
- Conversation history tracking
- Secure authentication

## Tech Stack

### Frontend
- React
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Installation

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas account)

### Setup Environment Variables

Create or modify the `.env` file in the root directory:

```
REACT_APP_OPENAI_API_KEY=your_openai_api_key
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REACT_APP_API_URL=http://localhost:5000/api
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

### Start the Frontend React Application

```bash
npm start
```

The application will run on `http://localhost:3000`, and the backend API on `http://localhost:5000`.

## Usage

1. Register a new account or login with existing credentials
2. Fill out the medical form with your symptoms
3. Submit the form to receive an AI-generated analysis
4. View your consultation history anytime by clicking on "Consultation History" in the navigation

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

### Conversations
- GET `/api/conversations` - Get all user conversations (protected)
- POST `/api/conversations` - Create a new conversation (protected)
- POST `/api/conversations/generate` - Generate AI response and save conversation (protected)

## Security

- Passwords are hashed using bcrypt
- JWT authentication for protected routes
- MongoDB for secure data storage

