# 🚑 PulseRoute — Emergency Ambulance Dispatch Platform

[![Live Website](https://img.shields.io/badge/Live%20Website-Vercel-success?style=for-the-badge&logo=vercel)](https://pulseroute-eta.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/GitHub-Frontend%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/haniful360/pulseroute-frontend)
[![Backend Repo](https://img.shields.io/badge/GitHub-Backend%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/haniful360/pulseroute-backend)
[![API Documentation](https://img.shields.io/badge/API%20Docs-Swagger%20UI-blue?style=for-the-badge&logo=swagger)](https://pulseroute-backend.vercel.app/api-docs)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Bubbles-purple?style=for-the-badge&logo=video)](https://app.usebubbles.com/hWzURS9VPq62mbqDwLpVey/recording-oct-10-2026)

**PulseRoute** is an enterprise-grade, emergency healthcare ambulance dispatch and fleet management web application. Built with **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Leaflet Maps**, PulseRoute bridges the gap between emergency patients, ambulance drivers, and healthcare administrators with real-time GPS tracking, instant WebSocket dispatching, and automated cashless Stripe payments.

---

## 📌 Quick Links & Project Resources

| Resource | URL / Details |
| :--- | :--- |
| **🚑 Project Name** | **PulseRoute — Emergency Ambulance Dispatch Platform** |
| **🌐 Live Application** | [https://pulseroute-eta.vercel.app](https://pulseroute-eta.vercel.app) |
| **💻 Frontend Repository** | [https://github.com/haniful360/pulseroute-frontend](https://github.com/haniful360/pulseroute-frontend) |
| **⚙️ Backend Repository** | [https://github.com/haniful360/pulseroute-backend](https://github.com/haniful360/pulseroute-backend) |
| **📖 Backend API & Docs** | [https://pulseroute-backend.vercel.app](https://pulseroute-backend.vercel.app) & [Swagger Docs](https://pulseroute-backend.vercel.app/api-docs) |
| **🎥 Project Demo Video** | [Watch Walkthrough Video (Bubbles)](https://app.usebubbles.com/hWzURS9VPq62mbqDwLpVey/recording-oct-10-2026) |
| **🔐 Super Admin Portal** | [https://pulseroute-eta.vercel.app/super-admin/login](https://pulseroute-eta.vercel.app/super-admin/login) |

---

## 🔑 Demo & Testing Credentials

Use these verified credentials to explore administrative features and test platform capabilities:

| Role | Login URL | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | [`/super-admin/login`](https://pulseroute-eta.vercel.app/super-admin/login) | `haniful@gmail.com` | `haniful123` | Full administrative control: Live Fleet Radar, Driver KYC verification, trip dispatch audit, pricing & commission settings, revenue ops, and payout management |

---

## 🌟 Key Features by Role

### 1. 🧑‍⚕️ Patient / Caller Experience
- **Instant Ambulance Booking**: Select emergency pickup location, hospital destination, and choose ambulance tier (`BASIC`, `AC`, `ICU`, `CCU`, `FREEZER`, `NEONATAL`).
- **Interactive Geospatial Maps**: Interactive Leaflet maps with dynamic route tracing, distance & ETA calculations.
- **Live Trip Radar**: Real-time GPS ambulance tracking powered by WebSockets (Socket.IO).
- **100% Cashless Payments**: Frictionless credit/debit card checkout via Stripe integration.
- **Trip History & PDF Invoices**: Download official medical transport receipts with full fare breakdown using jsPDF.

### 2. 🚑 Driver Cockpit & Operations
- **Live Duty Radar**: Toggle online/duty availability with instant auditory dispatch siren alerts.
- **Trip Dispatch Workflow**: One-tap accept/reject countdown timer, turn-by-turn navigation route, and state triggers (*En Route -> Arrived -> In-Transit -> Completed*).
- **Driver Stripe Wallet**: Real-time earnings breakdown, platform commission tracking, net balance, and payout withdrawal requests.
- **Fleet & KYC Compliance**: Driver license and emergency vehicle document upload with instant verification status badges.

### 3. 🛡️ Super Admin Management Suite
- **Executive KPI Dashboard**: High-level telemetry of platform revenue, active dispatches, driver response rate, and fleet health.
- **Live Fleet Radar**: Real-time map displaying all online ambulances, current dispatches, and emergency cluster heatmaps.
- **Driver & Fleet KYC Approval**: Review submitted vehicle permits, driver certifications, and toggle verification statuses.
- **Financial & Revenue Operations**: Configure dynamic base fares, per-km rates, severity multipliers, and platform commission percentages.
- **Payout Settlement Engine**: Inspect, approve, and disburse driver payout requests.

### 4. 🌐 Public Landing & Information Portal
- High-converting, responsive landing pages highlighting platform safety standards, transparent fare calculators, driver recruitment onboarding (`/join-driver`), and 24/7 emergency helplines.

---

## 💻 Tech Stack & Architecture

### **Core Framework & Language**
- **Next.js 16** (App Router architecture, Server & Client Components)
- **React 19**
- **TypeScript 5**

### **Styling & Design System**
- **Tailwind CSS v4** + `@tailwindcss/postcss`
- **Radix UI Primitives** (Accessible modals, dropdowns, popovers, tabs)
- **Lucide React & React Icons**
- **Sonner** (Toast notifications)

### **Maps & Real-Time Communication**
- **Leaflet & React Leaflet** (Interactive maps, custom ambulance markers, routing polyline)
- **Socket.IO Client** (Live GPS coordinates streaming and instant dispatch alerts)

### **State, Forms & Validation**
- **React Hook Form** + **Zod** (Schema-driven form validation)
- **Redux Toolkit** / Context API (Global auth and trip state)

### **Payments & Utilities**
- **Stripe SDK** (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Recharts** (Interactive financial & revenue analytics charts)
- **jsPDF** (Automated trip invoice generation)

---

## 📂 Project Directory Structure

```text
pulseroute-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Authentication routes (Login, Register, OTP, Super Admin)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── super-admin/         # Super Admin login route
│   │   │   └── verify-otp/
│   │   ├── (main)/                  # Public pages (Home, About, Pricing, Safety, Contact)
│   │   ├── dashboard/               # Role-protected dashboard routes
│   │   │   ├── admin/               # Admin panel
│   │   │   ├── driver/              # Driver cockpit & wallet
│   │   │   ├── patient/             # Patient ambulance booking & trips
│   │   │   └── super-admin/         # Super Admin oversight & fleet radar
│   │   ├── globals.css              # Global styles & Tailwind v4 config
│   │   └── layout.tsx               # Root layout & providers
│   ├── components/                  # Shared UI components, modals, sidebar, navbar
│   │   ├── dashboard/               # Dashboard layout & navigation items
│   │   └── ui/                      # Base Radix & custom UI primitives
│   ├── services/                    # API service layers (Auth, Trip, Driver, Wallet, Admin)
│   ├── hooks/                       # Custom React hooks (Geolocation, Socket, Auth)
│   ├── types/                       # TypeScript interfaces & type definitions
│   └── utils/                       # Helper functions (Formatting, calculations, token storage)
├── public/                          # Static images, icons, and audio assets
├── .env.example                     # Environment variables template
├── package.json                     # Project dependencies & scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## ⚙️ Local Development & Setup Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v20.x or v22.x+ ([Download Node.js](https://nodejs.org/))
- **pnpm**: v9+ (Recommended: `npm install -g pnpm` or `corepack enable`)

---

### 2. Clone the Repository

```bash
git clone https://github.com/haniful360/pulseroute-frontend.git
cd pulseroute-frontend
```

---

### 3. Install Dependencies

```bash
pnpm install
```

---

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Backend API endpoints
BACKEND_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# WebSocket URL (Socket.IO)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Stripe Payment Gateway (Publishable Key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51UCG2ZGq4WtGBuFRXigLeicjwUgsp5lM1grFEx7Iyy2jOGuSdQanfYt8hxwLaopeuiDlHoCWoN1N3K0w7oPRzXBk00F9KAzs0o

# Optional: Google Maps / Auth integration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

> **Note for production testing**: You can set `NEXT_PUBLIC_BACKEND_API_URL=https://pulseroute-backend.vercel.app/api/v1` and `NEXT_PUBLIC_SOCKET_URL=https://pulseroute-backend.vercel.app` to connect directly to the live production backend.

---

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

### 6. Build for Production

```bash
# Type check and build Next.js optimized bundle
pnpm build

# Start production server
pnpm start
```

---

## 🚀 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `pnpm dev` | Starts the Next.js development server with hot-reload |
| `build` | `pnpm build` | Compiles and optimizes production bundle |
| `start` | `pnpm start` | Starts the Next.js production server |
| `lint` | `pnpm lint` | Runs ESLint to check for code quality and errors |
| `lint:fix` | `pnpm lint:fix` | Automatically fixes ESLint warnings and errors |
| `format` | `pnpm format` | Checks code formatting with Prettier |
| `format:fix` | `pnpm format:fix`| Fixes code formatting with Prettier |
| `typecheck` | `pnpm typecheck` | Validates TypeScript types across the project |

---

## 🛡️ Security & Best Practices

- **Strict JWT Token Management**: Secure storage and automatic expiration handling with refresh token rotation.
- **Route Guards & Middleware**: Role-Based Access Control (RBAC) preventing unauthorized access across patient, driver, admin, and super-admin boundaries.
- **Input Sanitization**: Client-side validation via Zod schemas before network dispatches.
- **Sensitive Key Protection**: Secret credentials and private keys are strictly kept server-side.

---

## 👨‍💻 Author & Acknowledgements

Developed with ❤️ by **[Haniful Islam](https://github.com/haniful360)**.

For questions, issues, or business inquiries, feel free to open an issue or reach out via [GitHub](https://github.com/haniful360).
