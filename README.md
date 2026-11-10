# Premium Teas E-Commerce Platform

A modern, fully decoupled full-stack e-commerce application for a premium tea shop. 

## 🚀 Tech Stack
*   **Backend:** Python, Django, Django REST Framework (DRF)
*   **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
*   **Database:** SQLite (Development)

## ✨ Features
*   **Product Catalog:** Dynamic product listing and detail pages with image serving.
*   **Session-Based Cart:** Persistent shopping cart using Django sessions.
*   **Cart Management:** Add, update quantities, and remove items in real-time.
*   **Admin Dashboard:** Full Django Admin integration to manage products and categories.
*   **Responsive UI:** Styled with Tailwind CSS for mobile and desktop.

## 🛠️ Local Setup

### Backend (Django)
1. `cd backend`
2. `python -m venv env`
3. `source env/bin/activate` (or `env\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend (Next.js)
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file with `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
4. `npm run dev`
