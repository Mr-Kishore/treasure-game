# Treasure Hunt Game

An educational treasure hunt game built with React, TypeScript, and Express.

## Features

- Student registration and authentication
- Age-appropriate treasure hunt levels (ages 4-18)
- Progress tracking and scoring
- SQLite database for data persistence
- Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- React Hook Form with Zod validation
- TanStack Query for data fetching

### Backend
- Node.js with Express
- SQLite database with better-sqlite3
- JWT authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd treasure-game
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

You have two options to run the application:

#### Option 1: Run both servers together (recommended)
```bash
npm run dev:all
```
This will start both the frontend (http://localhost:8080) and backend (http://localhost:3001) servers simultaneously.

#### Option 2: Run servers separately
Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

### Accessing the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001 (root endpoint)

## Project Structure

```
treasure-game/
├── src/                    # React frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service functions
│   └── types/             # TypeScript type definitions
├── server/                # Express backend source code
│   ├── index.js          # Main server file
│   └── db.js             # Database initialization and queries
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Student login

### Game
- `GET /api/game/levels` - Get available levels
- `GET /api/game/level/:id` - Get specific level details
- `POST /api/game/progress` - Update student progress

## Database

The application uses SQLite for data persistence. The database is automatically initialized when the backend server starts. It includes tables for:
- Students (user accounts)
- Levels (game content)
- Student Progress (tracking completion)

## Development

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report

### Environment Variables
- `JWT_SECRET` - Secret key for JWT token signing (defaults to a development key)

## Testing

This project includes a comprehensive test suite using Vitest and React Testing Library.

### Test Structure

```
src/test/
├── setup.ts                 # Test setup and global mocks
├── App.test.tsx            # App component and routing tests
├── api.test.ts             # API utility unit tests
├── api.integration.test.ts # Backend API integration tests
├── CountdownTimer.test.tsx # Component unit tests
├── GameStats.test.tsx      # Component unit tests
└── auth.e2e.test.tsx       # End-to-end authentication flow tests
```

### Running Tests

- **Watch mode**: `npm run test` - Runs tests in watch mode for development
- **Single run**: `npm run test:run` - Runs all tests once
- **Coverage**: `npm run test:coverage` - Generates coverage report
- **UI Mode**: `npm run test:ui` - Runs tests with visual interface

### Test Types

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test API endpoints with real database
3. **End-to-End Tests**: Test complete user flows and interactions

### Coverage

The test suite covers:
- Authentication flows (login, registration)
- API utilities and error handling
- Component rendering and behavior
- User interactions and form validation
- Route navigation and redirects

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.

## License

MIT License
