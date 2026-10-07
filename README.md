# SpeakSure AI — "Speak English. Speak Confidently. Succeed."

**SpeakSure AI** is an enterprise-grade Progressive Web Application (PWA) designed for Indian college graduates preparing for campus placement drives, technical interviews, HR interviews, group discussions, and early corporate careers.

It operates as an encouraging, non-judgmental **Personal AI Spoken English & Placement Coach** helping students practice daily, overcome interview hesitation, expand technical vocabulary, and achieve placement readiness.

---

## 🏛️ Institutional 3-Month Semester Subscription Model

SpeakSure AI is offered to colleges, universities, and institutions via a **1-Semester (3-Month / 90-Day) Pass** purchased directly by College Management (**CEO, Chairman, Principal, Placement Director**).

- **50% OFF Offer Rate**: ~~₹50,000~~ → **₹25,000 only** per 3-Month Semester.
- **Unlimited Student Access**: Single institutional pass covers all students across BCA, B.Tech, MCA, MBA, and placement batches.
- **Dedicated Restricted Management Portal**: Secluded from general students, accessible via `http://localhost:3000?portal=admin` or passcode (**`ADMIN2026`**).
- **Payment Gateway**: Supports instant **UPI (`9113811578@upi`)**, Credit/Debit Cards, NetBanking, and PO Wire Transfers.
- **₹1 Live Test Payment Mode**: Interactive scannable UPI QR code mode for live testing.
- **Final 1-Month (30-Day) Renewal Window**: Highlights renewal options when `daysRemaining <= 30` or expired.
- **Automated Formal Email Receipts**: Formatted tax invoice & receipts emailed directly to purchaser (`info@clousurepointsolutions.com`).

---

## 🛠️ Tech Stack & Dependencies (With Exact Versions)

### 🎨 Frontend & User Interface
| Package / Library | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | Core UI Component Framework |
| **React DOM** | `^19.2.8` | React DOM Renderer |
| **Vite** | `^8.3.0` | Next-Gen Lightning-Fast Build Tool |
| **TailwindCSS** | `^4.3.3` | Utility-First Styling System (with `@tailwindcss/vite`) |
| **Lucide React** | `^1.52.0` | Modern UI Icon Suite |
| **Canvas Confetti** | `^1.9.4` | Milestone Gamification & Micro-animations |
| **clsx** | `^2.1.1` | Dynamic Conditional CSS Class Utility |

### 🔐 Authentication & Identity
| Package / Library | Version | Purpose |
| :--- | :--- | :--- |
| **@clerk/clerk-react** | `^5.61.10` | Student & Management User Auth SDK |
| **@clerk/react** | `^6.17.6` | React Auth Hooks & Session State |

### 🧠 Artificial Intelligence & Speech Services
| Package / Library | Version | Purpose |
| :--- | :--- | :--- |
| **@azure/openai** | `^2.0.0` | Azure OpenAI Model Integration (GPT-4o / Chat) |
| **microsoft-cognitiveservices-speech-sdk** | `^1.52.0` | Microsoft Azure Speech-to-Text & Pronunciation Assessment |

### ⚙️ Backend, Server & Database
| Package / Library | Version | Purpose |
| :--- | :--- | :--- |
| **Express** | `^5.2.1` | Node.js REST API Web Server |
| **tsx** | `^4.23.15` | TypeScript Execution Engine for Node.js |
| **cors** | `^2.8.6` | Cross-Origin Resource Sharing |
| **dotenv** | `^18.0.5` | Environment Variable Management |
| **@prisma/client** | `^7.10.0` | Type-Safe Database Client |
| **prisma** | `^7.10.0` | Database Migration & Schema CLI (PostgreSQL) |

### 🧪 Development, Tooling & Testing
| Package / Library | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | `~6.0.2` | Static Type Checker |
| **Vitest** | `^4.1.11` | Unit Testing Framework |
| **Oxlint** | `^1.81.0` | High-Performance JS/TS Linter |

---

## 🏗️ Architecture Flow & Diagrams

### 1. System Architecture Overview
```mermaid
graph TD
    User["🎓 Student / 🏛️ College Management"] -->|HTTPS| PWA["Progressive Web App (React 19 + Vite)"]
    PWA -->|Auth Tokens| Clerk["Clerk Authentication Service"]
    PWA -->|REST / API| ExpressServer["Express API Server (Port 5001)"]
    
    subgraph AI & Speech Services
        ExpressServer -->|Speech SDK| AzureSpeech["Azure Speech Service"]
        ExpressServer -->|OpenAI SDK| AzureOpenAI["Azure OpenAI GPT-4o"]
    end

    subgraph Data & Storage
        ExpressServer -->|Prisma ORM| PostgresDB["PostgreSQL Database"]
        PWA -->|Offline Storage| LocalStorage["IndexedDB / LocalStorage"]
    end
```

---

### 2. Institutional 3-Month Licensing & Payment Lifecycle
```mermaid
sequenceDiagram
    autonumber
    actor Admin as College Management (CEO/Principal)
    participant Portal as Admin Portal (Passcode: ADMIN2026)
    participant Gateway as Payment Gateway Modal
    participant Backend as Express API Server
    participant Email as Email Service (ClousurePoint Solutions)
    actor Student as College Student

    Admin->>Portal: Access via http://localhost:3000?portal=admin
    Admin->>Portal: Enter Details (College Name, Person Name, Designation)
    Admin->>Gateway: Select 1-Semester Pass (₹25,000 / 50% OFF) or ₹1 Test
    Gateway->>Admin: Render UPI QR Code (9113811578@upi)
    Admin->>Gateway: Scan & Authorize Payment
    Gateway->>Backend: POST /api/subscription/purchase
    Backend->>Email: Dispatch Formal Tax Invoice & Receipt
    Backend-->>Gateway: Return 90-Day License Key (e.g. CIT-2026-SEM1-8932)
    
    note over Student: 90 Days Active Window
    Student->>Portal: Access Daily Practice, AI Coach, Interviews & GD Room
    
    note over Student, Admin: Day 60 to Day 90 (Final 30 Days)
    Portal->>Admin: "Renew Pass" Window Highlights (Days <= 30)
    
    note over Student: After 90 Days (Expiry)
    Student->>Portal: Access Locked -> SubscriptionLockOverlay Displayed
```

---

### 3. Speech & Interview AI Analysis Pipeline
```mermaid
flowchart LR
    Audio["🎙️ Voice Audio Recording"] --> WebSpeech["Web Speech STT / Azure Speech"]
    WebSpeech --> Transcript["Speech Transcript + Duration + WPM"]
    Transcript --> Analyzer["Express Speech Analyzer Service"]
    Analyzer --> Grammer["Grammar Correction Engine"]
    Analyzer --> Fluency["Fluency & Filler Word Tracker"]
    Analyzer --> Vocab["Vocabulary Score Engine"]
    Grammer & Fluency & Vocab --> Score["Multi-Dimensional Score Card (/100)"]
    Score --> Output["Display Radar Chart & Practice Suggestions"]
```

---

## 🚀 Local Setup & Running Commands

```bash
# 1. Install Project Dependencies
npm install

# 2. Run Unit Test Suite
npm run test

# 3. Start Backend Express API Server (Port 5001)
npm run server

# 4. Start Vite Frontend Development Server (Port 3000)
npm run dev

# 5. Production Build
npm run build
```

---

## 🌐 Live URLs & Clerk Dashboard Configuration Guide

When deploying SpeakSure AI to production (*Vercel, Netlify, Render, or Azure Web Apps*), follow this guide to configure Live URLs and Clerk authentication keys:

### Step 1: Update Live URLs on Clerk Dashboard
1. Log in to [Clerk Dashboard](https://dashboard.clerk.com/).
2. Select your SpeakSure AI Application.
3. Go to **Configure > Domains & Paths**.
4. Under **Production Domain**, click **Add Custom Domain** or enter your live frontend URL (*e.g., `https://speaksure-ai.vercel.app`* or `https://speaksure.clousurepointsolutions.com`).
5. Under **Configure > User & Authentication > Paths**:
   - **Sign-in Path**: `/` or `/auth`
   - **Sign-up Path**: `/` or `/auth`
   - **After sign-in redirect**: `/`
   - **After sign-up redirect**: `/onboarding`
6. Go to **Configure > Webhooks** (if syncing user profiles with backend PostgreSQL) and set your target webhook URL:  
   `https://api-speaksure.clousurepointsolutions.com/api/webhooks/clerk`.

---

### Step 2: Environment Variable Updates in Code & `.env`

Update your production `.env` file or hosting environment variables (*Vercel Environment Variables / Render Environment Variables / Azure App Settings*):

```env
# 1. Clerk Live Authentication Keys (From Clerk Dashboard > API Keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY

# 2. Server Port & Production API URL
PORT=5001
VITE_API_BASE_URL=https://api-speaksure.clousurepointsolutions.com

# 3. Database URL (PostgreSQL Connection String)
DATABASE_URL="postgresql://username:password@your-db-host:5432/speaksure_db?sslmode=require"

# 4. Azure OpenAI & Speech Service Credentials
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=southindia
```

---

## 📬 Contact & Support

- **Official Billing & Support Email**: `info@clousurepointsolutions.com`