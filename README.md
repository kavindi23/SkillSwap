# SkillSwap

SkillSwap is a full-stack web application that allows students to exchange skills with each other.

Users can add skills they can teach, add skills they want to learn, discover matching students, send exchange requests, manage learning sessions, receive notifications, and review completed exchanges.

The application also includes an admin panel for monitoring users and exchanges.

## Features

### Student Features

- User registration and login
- Personal profile management
- Add skills to teach
- Add skills to learn
- Find matching students
- Send skill exchange requests
- Accept or reject exchange requests
- Manage active exchanges
- Schedule learning sessions
- Track completed sessions
- Receive notifications
- Submit reviews and ratings
- Responsive mobile and desktop interface

### Admin Features

- Admin dashboard
- View platform statistics
- View registered users
- Activate or deactivate user accounts
- Monitor skill exchanges
- View exchange status, sessions, and reviews
- Responsive admin interface

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Python
- FastAPI
- SQLAlchemy
- JWT Authentication

### Database

- PostgreSQL

## Project Structure

```text
SkillSwap/
│
├── backend/
│   └── app/
│       ├── core/
│       ├── db/
│       ├── models/
│       ├── routers/
│       ├── schemas/
│       └── services/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── service/
│
├── .gitignore
└── README.md
```

## Main Application Pages

### Student

- Dashboard
- My Profile
- My Skills
- Skill Matches
- Exchanges
- Notifications

### Admin

- Admin Dashboard
- User Management
- Exchange Management

## Running the Project Locally

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

### Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Environment Variables

The backend uses environment variables for sensitive configuration such as the database connection and authentication settings.

Create a `.env` file inside the backend directory and configure the required values.

```env
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
```

Do not commit the `.env` file to GitHub.

## Responsive Design

SkillSwap is designed to work on both desktop and mobile devices.

The student and admin interfaces include responsive navigation and mobile-friendly layouts for dashboards, profiles, skills, exchanges, notifications, and administration pages.

## Future Improvements

Possible future improvements include:

- Profile pictures
- Real-time messaging
- Email notifications
- Advanced skill search and filtering
- Improved matching recommendations
- Cloud deployment

## Author

Developed as a full-stack web development project.