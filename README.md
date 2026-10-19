# StudyCord 🎓⚡
> **The Premier Interactive Learning & Competitive Quiz Platform**

StudyCord is a modern, high-performance web and progressive web application (PWA) designed for students, learners, and trivia enthusiasts. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**, StudyCord combines academic rigor with gamified mechanics, real-time multiplayer battles, and rich interactive quiz modes.

---

## 🌟 Key Features

### 1. 🎯 Dynamic Quiz Zone
- **Multi-Level Progression**: 10 progressive difficulty tiers per topic, scaling questions dynamically from introductory to master level.
- **Curated Academic & Trivia Categories**:
  - General Knowledge (World Trivia, Inventions, Arts, Mythology)
  - Science & Technology (Physics, Computer Science & AI, Chemistry, Biology)
  - Mathematics & Logic (Speed Math, Algebra, Geometry, Logic Puzzles)
  - History & Geography (Ancient Civilizations, World Capitals, Warfare)
  - Sports & Games (Football, Olympics, Basketball, Esports)
  - Elite Masterclasses (Astrophysics, Quantum Mechanics, Philosophy)

### 2. ⚔️ Competitive Battle Zone
- **1 vs 1 Head-to-Head Duels**: Real-time matchmaking with players worldwide. Live opponent scoring effects, quick-chat reaction bubbles, and wagered coin stakes.
- **4-Player Group Battles**: Create private rooms with custom 6-digit invite codes, configure entry fees, and challenge friends in real-time lobbies with automated contestant backfilling.

### 3. 🧩 Specialized Quiz Modes
- **Fun 'N' Learn**: In-depth reading comprehension passages paired with analytical inquiry.
- **Guess The Word**: Word riddle gameplay with interactive letter tiles and hints.
- **Audio Questions**: Auditory recognition testing acoustic reasoning.
- **Maths Mania**: LaTeX equation-driven problem solving with on-screen scratchpad calculators.
- **Multi Match**: Dual-column drag-and-connect concept pairing.
- **Self-Challenge**: Custom study sessions where learners configure question counts and timers.

### 4. 🪙 Virtual Learning Economy
- **Starter Coin Grant**: 250 coins on signup + 50 coins for referral invite codes.
- **In-Quiz Lifelines**: 50/50, Audience Poll, Time Reset, and Skip Lifelines.
- **Daily Rewards**: Interactive scratch cards yielding bonus coin boosts.
- **Coin Store**: In-app purchase tiers for competitive tournament reserves.

### 5. 🏆 Leaderboards & Badges
- **Global Rankings**: All-Time, Monthly, and Daily leaderboards with tier badges (Bronze, Silver, Gold, Diamond, Grandmaster).
- **Milestone Badges**: Dynamic unlockable accolades for quiz streaks, battle victories, and study achievements.

### 6. 🛡️ Comprehensive Admin Portal
- Accessible via `/admin` for administrators to manage questions, categories, contests, system settings, and user balances with JWT authentication.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router), React 18 |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with full Dark/Light theme switching |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Canvas Confetti |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with seamless resilient memory-fallback |
| **Audio & Haptics** | Web Audio API acoustic synthesis + HTML5 Audio fallback |
| **PWA** | Service Worker caching, Web App Manifest, Installable on mobile & desktop |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17 or later
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/thecoachmanuel/studycord.git
cd studycord
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

Example configuration in `.env.local`:
```env
# Database Configuration (MongoDB Atlas or Local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.0dnl6.mongodb.net/studycord_db?retryWrites=true&w=majority

# Admin Credentials
ADMIN_EMAIL=admin@studycord.com
ADMIN_PASSWORD=your_secure_password
ADMIN_JWT_SECRET=your_jwt_secret_key

# Public App Configurations
NEXT_PUBLIC_APP_NAME="StudyCord"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_VERSION="2.3.7"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
studycord/
├── public/                 # Static assets, SVG icons, audio sound effects, PWA manifest
├── scripts/                # Database seeding, questions generators, verification tools
├── src/
│   ├── app/                # Next.js App Router (pages & API endpoints)
│   │   ├── api/            # Backend REST API endpoints (battle, users, questions, etc.)
│   │   ├── battle/         # 1v1 and Group Battle rooms & matchmaking
│   │   ├── category/       # Category and subcategory exploration
│   │   ├── levels/         # Level selector grid
│   │   ├── quiz/           # Real-time quiz gameplay engine
│   │   ├── admin/          # Management portal
│   │   └── ...
│   ├── components/         # Modular UI components (Tabs, Common, Layout)
│   ├── context/            # Global React contexts (Auth, Theme, UserDetails, Settings)
│   ├── lib/                # Database layer, quiz engine rules, translations, sound manager
│   └── types/              # TypeScript interface definitions
└── tailwind.config.ts      # Tailwind design system configuration
```

---

## 🔒 Security Best Practices
- Secret environment credentials (`.env`, `.env.local`) are strictly excluded via `.gitignore`.
- Database connections use connection pooling and SRV resolution failover.
- Admin portal access is guarded by JWT authentication.

---

## 📄 License
This project is proprietary and maintained by the StudyCord team.
