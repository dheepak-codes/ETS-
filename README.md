# Esports Tournament System (ETS)

A modern, full-stack Esports Tournament Management System supporting multi-game competitions, single-elimination tournament brackets, team registration, payment simulation, leaderboards, and administrative controls.

---

## 🚀 Quick Start (VS Code)

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Execution

1. **Clone / Open Project in VS Code**
   Open Visual Studio Code and open this folder.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

## 📜 Available NPM Scripts

- `npm run dev` - Starts the full-stack Express + Vite development server on port 3000.
- `npm run build` - Builds the React frontend and bundles the Express server into `dist/`.
- `npm run start` - Runs the production build (`node dist/server.cjs`).
- `npm run lint` - Runs TypeScript type checking (`tsc --noEmit`).

---

## 📁 Project Structure

```
├── database/               # MySQL Database Schemas & Seed Data
│   ├── ets_schema.sql      # Database DDL schema script
│   └── ets_seed.sql        # Database seed data script
│
├── java-backend/           # Java OOP & JDBC DAO Architecture (Reference / Core)
│   └── src/com/ets/        # Java Models, DAOs, Exceptions & Main Application
│
├── public/                 # Static Public Assets
│
├── src/                    # React + Vite Frontend Application
│   ├── components/         # UI Components (Brackets, Banners, Dashboards, Modals)
│   ├── types.ts            # TypeScript Types & Interfaces
│   ├── App.tsx             # Main React Application Container
│   ├── main.tsx            # Vite Entry Point
│   └── index.css           # Tailwind CSS Imports & Custom Styles
│
├── .env.example            # Environment Variable Template
├── index.html              # HTML Entry Point
├── package.json            # Project Dependencies & Scripts
├── server.ts               # Express Backend Server & API Routes
├── tsconfig.json           # TypeScript Configuration
└── vite.config.ts          # Vite Configuration
```

---

## ✨ Features Supported

- **Multi-Game Support**: PUBG Mobile, Valorant, Call of Duty, Free Fire, and Counter-Strike.
- **Single-Elimination Brackets**: Real-time bracket visualizer with automated round advancement.
- **Team Operations**: Create squads, invite players, manage member roles.
- **Simulated Payment Gateway**: Net Banking, Card, and UPI registration payment simulation.
- **Global Leaderboard & Badges**: Player rankings, win rates, and achievement badges.
- **Admin Dashboard**: Tournament creation, match score editing, user management, and report generation.
