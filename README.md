# Voxify – AI Text-to-Speech Studio

> **"Transform your words into a voice."**  
> *A modern, production-grade full-stack Text-to-Speech web application powered by the browser-native Web Speech API. 100% Free, zero cloud keys, zero billing, and complete on-device privacy.*

---

### 🌐 Live Public Deployment
* **Live Web App:** [https://tushartaak.github.io/voxify-ai-tts-studio/](https://tushartaak.github.io/voxify-ai-tts-studio/)
* **Direct Studio Access:** [https://tushartaak.github.io/voxify-ai-tts-studio/studio](https://tushartaak.github.io/voxify-ai-tts-studio/studio)
* **GitHub Repository:** [https://github.com/tushartaak/voxify-ai-tts-studio](https://github.com/tushartaak/voxify-ai-tts-studio)
* **Automated CI/CD:** Continuous Deployment via GitHub Actions workflow (`.github/workflows/deploy.yml`)
* **Cost & Billing:** 100% Free forever • Zero API keys • Zero cloud credentials • Zero tracking

---

## 1. Project Title
**Voxify – AI Text-to-Speech Studio**

---

## 2. Project Overview
**Voxify** is a web-based Text-to-Speech application built to convert written text into natural-sounding spoken audio directly in the user's browser. Built with a responsive React SPA and a lightweight Express backend, Voxify operates completely without Google Cloud, third-party payment gateways, service accounts, or external API keys. It leverages the browser-native **Web Speech API (`window.speechSynthesis` and `SpeechSynthesisUtterance`)** to vocalize scripts with real-time word boundary synchronization, dynamic voice switching, cadence tuning, and responsive playback controls.

---

## 3. Problem Statement & Motivation
Most commercial text-to-speech platforms:
- Require mandatory cloud billing accounts, credit card entries, or expensive recurring subscriptions.
- Impose restrictive usage paywalls and external API token rate-limits.
- Transmit user prose and speech scripts across external servers, compromising privacy.
- Use fake mock audio or simulated waveform generators in non-cloud modes.

Voxify eliminates these barriers by delivering an authentic, zero-cost, local-first studio that harnesses the user's installed operating-system voices across macOS, Windows, Linux, Android, and iOS.

---

## 4. Project Objectives
- **100% Free & Zero Cloud Keys:** Operate with no Google Cloud account, no service accounts, and no paid third-party APIs.
- **Authentic Speech Synthesis:** Convert text into speech using real browser-native speech synthesis with zero artificial waveforms or fake duration bars.
- **Genuine Voice Detection:** Discover and list only genuine installed operating-system voices via `speechSynthesis.getVoices()` and `onvoiceschanged`.
- **Honest Feedback:** Clearly alert users when a selected language has no installed voice, or when no voices are present in the browser.
- **Full Playback Controls:** Provide Speak, Pause, Resume, and Stop controls with real-time spoken boundary progress tracking.
- **Privacy by Design:** Keep all script text strictly on the client device—zero audio bytes are transmitted to remote servers.
- **Hardened Full-Stack Architecture:** Maintain a decoupled Express backend for health checks (`GET /api/health`), rate limiting, and security headers.

---

## 5. Key Features
- **Smart Script Editor:**
  - Real-time character and word counters.
  - 5,000 character limit with visual threshold warnings (>85% amber, >100% red).
  - One-click multilingual script samples (English, Hindi, Gujarati, Marathi, Spanish, French, German).
  - Script clearing and whitespace trimming.
- **Genuine Voice & Language Selection:**
  - Automatic enumeration of operating-system installed voices.
  - Per-language voice count badges.
  - Actionable notices when no voices are installed for a language.
  - Instant voice preview with interactive Stop button.
- **Audio Modulation Controls:**
  - Speaking rate / speed slider (0.50x to 2.00x).
  - Pitch adjustment (-10 to +10 semitones).
  - Master volume slider (0% to 100%).
- **Speech Controls:**
  - Speak, Pause, Resume, Replay, and Stop actions.
  - Live progress bar driven by `SpeechSynthesisUtterance.onboundary`.
  - Honest disclosures explaining direct hardware playback.
- **System Settings & Diagnostics:**
  - Live Web Speech API support status.
  - Filterable directory of all installed browser voices.
  - One-click test voice phrase.
  - Express backend health ping.

---

## 6. Technology Stack

### Frontend (Client)
- **Framework:** React 18
- **Build Tool:** Vite 6
- **Routing:** React Router DOM (v7)
- **Styling:** Tailwind CSS 3 (Dark navy studio design system)
- **Icons:** Lucide React
- **Speech Engine:** Browser Web Speech API (`window.speechSynthesis`, `SpeechSynthesisUtterance`)
- **HTTP Client:** Axios
- **Testing:** Vitest, React Testing Library, jsdom

### Backend (Server)
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4)
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Health Check:** `/api/health`
- **Testing:** Vitest, Supertest

---

## 7. Architecture Overview

```
+-------------------------------------------------------------------------+
|                               VOXIFY CLIENT                             |
|  React 18 SPA + Vite + Tailwind CSS + Lucide Icons + Web Speech Engine  |
|                                                                         |
|  [Pages: Home, Studio, About, Settings]                                 |
|  [Components: TextEditor, VoiceSelector, AudioSettings, AudioPlayer]    |
|  [Hooks: useTTS]                                                        |
|  [Service: browserSpeechService.js (SpeechSynthesis Controller)]         |
+------------------------------------+------------------------------------+
                                     |
                Real-Time Audio      | Health & Diagnostics
                (On-Device Hardware) | (/api/health)
                                     v
+------------------------------------+------------------------------------+
|                         EXPRESS BACKEND GATEWAY                         |
|  Node.js + Express + Helmet + CORS + Rate Limiter                       |
|                                                                         |
|  GET /api/health  -> Returns server status & speech engine info         |
+-------------------------------------------------------------------------+
```
+------------------------------------+------------------------------------+
                                     | Axios REST Calls (/api)
                                     v
+-------------------------------------------------------------------------+
|                             EXPRESS BACKEND                             |
|         Node.js + Express + Helmet + CORS + Express-Rate-Limit          |
|                                                                         |
|  [Rate Limiter] -> [Input Validation] -> [Error Handler Middleware]     |
|                                                                         |
|  - GET  /api/health       -> Server uptime, status & active provider    |
|  - GET  /api/voices       -> Filtered voice catalogue                   |
|  - POST /api/tts          -> Speech synthesis & temporary audio save    |
|  - GET  /api/tts/audio/:id -> Byte-range audio streaming & download     |
+------------------------------------+------------------------------------+
                                     |
                    +----------------+----------------+
                    |                                 |
                    v                                 v
   [Google Cloud TTS Provider]          [Development Fallback Service]
   - @google-cloud/text-to-speech        - Transparent dev status
   - Cloud Neural2/Wavenet synthesis     - Pure Node PCM WAV generator
   - Secure server-side credential       - Web Speech API vocal preview
```

---

## 8. Project Folder Structure

```
voxify/
├── client/                           # Frontend React Application
│   ├── public/
│   │   └── favicon.svg               # Voxify brand wave logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive header & engine status pill
│   │   │   ├── Footer.jsx            # Footer with project & tech stack badges
│   │   │   ├── TextEditor.jsx        # Script editor, word/char counters & samples
│   │   │   ├── LanguageSelector.jsx  # Language dropdown with installed voice counts
│   │   │   ├── VoiceSelector.jsx     # Installed voice selector with instant preview
│   │   │   ├── AudioSettings.jsx     # Speed (0.5x-2x), pitch, and volume sliders
│   │   │   ├── GenerateButton.jsx    # "Speak Text" action button
│   │   │   ├── AudioPlayer.jsx       # Speech Controls with real-time boundary progress
│   │   │   ├── ErrorMessage.jsx      # User-friendly error alert box
│   │   │   ├── LoadingState.jsx      # Animated speaking visualizer
│   │   │   └── Toast.jsx             # Auto-dismissing status notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page with hero, mockup, & features
│   │   │   ├── Studio.jsx            # Primary 2-column speech studio interface
│   │   │   ├── About.jsx             # Architectural breakdown & learning outcomes
│   │   │   └── Settings.jsx          # Web Speech diagnostics & voice directory
│   │   ├── services/
│   │   │   ├── api.js                # Axios client for health checks
│   │   │   └── browserSpeechService.js # Singleton SpeechSynthesis controller
│   │   ├── hooks/
│   │   │   └── useTTS.js             # Centralized Web Speech state management hook
│   │   ├── utils/
│   │   │   ├── audioHelper.js        # Formatters & helper utilities
│   │   │   └── sampleTexts.js        # Multilingual preset scripts
│   │   ├── test/
│   │   │   ├── setup.js              # SpeechSynthesis & Jest-DOM polyfills
│   │   │   ├── TextEditor.test.jsx   # Unit tests for text editor
│   │   │   └── AudioPlayer.test.jsx  # Unit tests for speech controls
│   │   ├── App.jsx                   # React Router route registry
│   │   ├── main.jsx                  # React DOM entry
│   │   └── index.css                 # Tailwind directives & dark theme styles
│   ├── index.html                    # Single page HTML entry
│   ├── vite.config.js                # Vite configuration with /api proxy
│   ├── tailwind.config.js            # Tailwind theme configuration
│   ├── package.json                  # Client dependencies & scripts
│   └── .env.example                  # Client environment template
│
├── server/                           # Lightweight Backend Express Application
│   ├── config/
│   │   └── env.js                    # Server configuration & startup banner
│   ├── controllers/
│   │   └── healthController.js       # GET /api/health controller
│   ├── middleware/
│   │   ├── errorHandler.js           # Centralized AppError JSON handler
│   │   └── rateLimiter.js            # Express rate limiting
│   ├── routes/
│   │   └── healthRoutes.js           # Health endpoint router
│   ├── tests/
│   │   └── server.test.js            # Backend API health tests (Vitest + Supertest)
│   ├── server.js                     # Express app setup & listener
│   ├── package.json                  # Server dependencies & scripts
│   └── .env.example                  # Server environment template
│
├── .gitignore                        # Global ignore configuration
├── package.json                      # Root workspace scripts
└── README.md                         # Comprehensive documentation
```

---

## 9. Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Modern browser with Web Speech API support (Google Chrome, Microsoft Edge, Safari, Firefox, Opera)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/voxify-tts-studio.git
   cd "voxify-tts-studio"
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   *Alternatively:*
   ```bash
   npm install
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

---

## 10. Environment Setup

### Server Environment (`server/.env`)
Copy the template file:
```bash
cp server/.env.example server/.env
```

Contents:
```env
PORT=5050
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MAX_TEXT_LENGTH=5000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```
> **Note:** Zero Google Cloud keys, billing accounts, or credentials are required. Voxify operates 100% free out-of-the-box.

### Client Environment (`client/.env`)
In development, the Vite dev server proxies `/api` requests to `http://localhost:5050` automatically. For production, set:
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 11. Running the Application

Start both frontend and backend concurrently with a single command:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5050](http://localhost:5050)
- **Health Endpoint:** [http://localhost:5050/api/health](http://localhost:5050/api/health)

Individual component commands:
- Run only backend: `npm run server`
- Run only frontend: `npm run client`

---

## 12. Browser Web Speech API Architecture

### How Speech Synthesis Works
Voxify uses the W3C standard **Web Speech API (`SpeechSynthesis`)** built into modern web browsers:
1. **Dynamic Voice Loading:** On startup, `browserSpeechService` queries `window.speechSynthesis.getVoices()` and registers an `onvoiceschanged` listener to dynamically discover newly installed operating-system voices.
2. **Language Matching:** Voices are categorized by standard BCP-47 language tags (`en-US`, `hi-IN`, `gu-IN`, `mr-IN`, etc.).
3. **Synthesis Engine:** When the user clicks **"Speak Text"**, an instance of `SpeechSynthesisUtterance` is configured with the selected text, voice, rate (0.5x–2.0x), pitch, and volume.
4. **Boundary Synchronization:** Real-time speech progress is tracked via `utterance.onboundary` events, mapping character indices directly to the on-screen progress indicator.
5. **Keep-Alive Controller:** A background interval prevents Chromium browsers from prematurely pausing long utterances after 15 seconds.

### Technical Disclosures
- **On-Device Hardware Playback:** Audio is rendered directly through your device's audio hardware with zero latency and complete privacy.
- **No Mock Downloads:** Unlike cloud-based TTS which returns static MP3 files, the browser Web Speech API streams audio straight to device speakers without generating a static audio file.
- **No Fake Seeking:** Speech is rendered on the fly in real-time; seeking scrubbers are disabled to prevent artificial or simulated playback behaviors.

---

## 13. API Documentation

### Health Check Endpoint
- **Endpoint:** `GET /api/health`
- **Description:** Verifies server health, uptime, and engine mode.
- **Authentication:** None.
- **Example Response:**
  ```json
  {
    "success": true,
    "status": "ok",
    "message": "Voxify API is running",
    "timestamp": "2026-09-14T12:00:00.000Z",
    "version": "1.0.0",
    "speechEngine": "browser-native-web-speech-api",
    "provider": {
      "activeEngine": "Web Speech API (Browser Native)",
      "billingRequired": false,
      "cloudCredentialsRequired": false,
      "maxCharacters": 5000
    }
  }
  ```

---

## 14. Testing Instructions

### Run Backend API Test Suite
```bash
npm run test --prefix server
```
*Validates health endpoints, rate limiting, and 404 handling using Supertest and Vitest.*

### Run Frontend Component Test Suite
```bash
npm run test --prefix client
```
*Validates text editor character/word counting, limit warnings, voice selection, and speech control state transitions.*

### Run All Tests
```bash
npm run test
```

---

## 15. Deployment Instructions

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Push your repository to GitHub.
2. Import the repository and set the **Root Directory** to `client`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Configure Environment Variable:
   ```env
   VITE_API_URL=https://your-voxify-server.onrender.com
   ```

### Backend (Render / Railway / Fly.io)
1. In Render or Railway, create a new **Web Service** pointing to the repository.
2. Set **Root Directory** to `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Set Environment Variables:
   ```env
   PORT=5050
   NODE_ENV=production
   CLIENT_ORIGIN=https://your-voxify-client.vercel.app
   ```

---

## 16. Internship Project Learning Outcomes
1. **System Architecture Design:** Architecting a clean full-stack application with modular service abstractions and separation of concerns.
2. **Browser-Native API Mastery:** Integrating the W3C Web Speech API (`SpeechSynthesisUtterance`, `onvoiceschanged`, `onboundary`) with robust edge-case handling.
3. **Local-First Privacy Engineering:** Processing speech entirely on the client's device with zero external data transmission.
4. **Accessible Frontend Engineering:** Building accessible speech controls, real-time reactive metrics, and screen-reader compatible interfaces.
5. **Zero-Billing Cost Optimization:** Designing a production-ready application that eliminates external cloud billing and API key overhead.
