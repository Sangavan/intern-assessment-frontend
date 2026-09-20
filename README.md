# Intern Assessment - Frontend

A Next.js frontend with Tailwind CSS and JWT cookie authentication.

## Tech Stack
- Next.js 16
- Tailwind CSS
- Lucide React Icons
- Next Themes (dark/light mode)

## Live URL
https://intern-assessment-frontend-navy.vercel.app

## Backend URL
https://intern-assessment-backend.onrender.com

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/Sangavan/intern-assessment-frontend.git
cd intern-assessment-frontend

### 2. Install dependencies
npm install

### 3. Create .env.local file
NEXT_PUBLIC_API_URL=https://intern-assessment-backend.onrender.com

### 4. Run the app
npm run dev

Open http://localhost:3000

## Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | /login | User login |
| Register | /register | User registration |
| Dashboard | /dashboard | User management |

## Features
- JWT authentication with HTTP-only cookies
- Light/Dark mode toggle
- Skeleton loading effect
- Password show/hide toggle
- Register success/error messages
- Edit and delete profile
- View all users

## Deployment
- Frontend deployed on Vercel
- Backend deployed on Render