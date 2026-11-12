# Premium Teas E-Commerce Platform 🍵

A fully decoupled, full-stack e-commerce application designed to mirror modern production architecture. The application features a robust Django REST API backend and a highly interactive Next.js frontend, complete with secure Stripe payment processing.

## 🚀 Tech Stack

- **Backend:** Python, Django, Django REST Framework (DRF), Stripe API, SQLite
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS

## ✨ Key Features

### Customer Storefront

- **Dynamic Catalog:** Responsive product grid with server-side category filtering.
- **Session-Based Cart:** Real-time cart state management using React Context and Django Sessions.
- **Cart Management:** Add, update quantities, and remove items seamlessly.
- **Seamless Checkout:** Custom checkout form that communicates with Django to create orders and redirects users to Stripe's secure hosted checkout.

### Payment & Backend Logic

- **Secure Payments:** Fully integrated with **Stripe Checkout**. Credit card data never touches our servers.
- **Asynchronous Webhooks:** Automated backend-to-backend communication. Stripe webhooks (verified via cryptographic signatures) automatically update order status from `Pending` to `Paid`.
- **Database Integrity:** Custom logic to freeze product prices at the exact moment of purchase to prevent later price changes from affecting past orders.

### Admin Dashboard

- **Order Management:** View detailed order history and line items.
- **CSV Export:** Custom Django Admin action to export selected orders to a CSV file for easy shipping/packaging.
- **Dynamic PDF Invoices:** Instantly generate downloadable PDF receipts with a visual "PAID" or "PENDING" stamp.

---

## 📂 Project Structure

```text
storefront/
├── backend/          # Django REST API
│   ├── cart/         # Session-based cart logic
│   ├── config/       # Main Django settings and URLs
│   ├── orders/       # Order models, CSV export, PDF generation
│   ├── payment/      # Stripe integration and Webhooks
│   └── shop/         # Product catalog and APIs
└── frontend/         # Next.js Application
    ├── app/          # App Router (pages, checkout, products)
    ├── components/   # Reusable UI components (Header, Buttons)
    ├── context/      # Global Cart State (React Context)
    └── lib/          # API utility functions
```

---

## 🛠️ Local Setup

### 1. Backend (Django)

```bash
cd backend
python -m venv env
# Windows: env\Scripts\activate | Mac/Linux: source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory and add your Stripe Test Keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_key_here
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 💳 Testing the Payment Flow (Stripe CLI)

To test the webhook functionality locally, you must use the Stripe CLI.

1. Install and login: `stripe login`
2. Start the webhook listener in a new terminal:
   ```bash
   stripe listen --forward-to 127.0.0.1:8000/payment/webhook/ --events checkout.session.completed
   ```
3. Add items to your cart, proceed to checkout, and use the test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** `12/30`
   - **CVC:** `123`
4. You will see the `checkout.session.completed` event fire in the CLI, and the order will be marked as **Paid** in the Django Admin.

---

_Built as a portfolio project to demonstrate modern full-stack decoupled architecture._
