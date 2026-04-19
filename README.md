# FitLive – AI-Powered Real-Time Fitness Tracker
### Google Gemini AI + Google Fit | Team: Tech Titans | FS-VI-T122

---

## Run the Project

```bash
net start MongoDB        # Step 1: Start MongoDB (Windows)
npm install              # Step 2: Install packages (first time only)
npm start                # Step 3: Start the server
```
Then open: **http://localhost:3000**

---

## Enable AI Features — Get Free Gemini Key

### Step by step (1 minute):

**1.** Open: https://aistudio.google.com/app/apikey

**2.** Sign in with your Google account

**3.** Click **"Create API Key"** → **"Create API key in new project"**

**4.** Copy the key (it starts with `AIza...`)

**5.** Open the `.env` file in VS Code

**6.** Replace `YOUR_GEMINI_API_KEY_HERE` with your key:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**7.** Save the file

**8.** Restart server: press `Ctrl+C` in terminal, then run `npm start`

**9.** Go to http://localhost:3000/ai/coach — AI is now working!

### Free Tier (no credit card ever needed):
- 15 requests / minute
- 1,500 requests / day  
- $0.00 cost

---

## AI Features

| Feature | Where |
|---------|-------|
| 🧠 AI Fitness Coach (chat) | Sidebar → AI Coach |
| 🥗 Smart Meal Auto-fill | Diet Tracker → ✨ Auto-fill bar |
| 📊 Weekly Health Summary | AI Coach → Generate Summary |
| ⚠️ Anomaly Detection | Auto-loads on Dashboard |

---

## Troubleshooting AI

**"API key not set"** → You haven't added GEMINI_API_KEY to .env yet

**"Invalid API Key"** → The key in .env doesn't match — re-copy it from Google AI Studio

**"403 Forbidden"** → In Google Cloud Console, make sure "Generative Language API" is enabled for your project

**"Rate limit"** → Wait 60 seconds (free tier: 15 req/min)

**"Request timed out"** → Check your internet connection

---

## Connect Google Fit (for real health data)

1. Go to https://console.cloud.google.com → Enable **Fitness API**
2. OAuth consent → Add scopes: `fitness.activity.read`, `fitness.heart_rate.read`, `fitness.body.read`
3. Credentials → OAuth 2.0 Client ID → Web app → Redirect: `http://localhost:3000/googlefit/callback`
4. Add to `.env`: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
5. Restart → Login → Sidebar: Google Fit → Connect

---

## Project Structure

```
FitLiveV2/
├── ai/
│   ├── aiClient.js       ← Gemini API calls (fixed: key read at runtime)
│   ├── coachPrompts.js   ← All AI system prompts
│   └── aiHelpers.js      ← Pull user data from MongoDB
├── routes/
│   └── ai.js             ← All AI routes with full error handling
├── views/
│   └── coach.ejs         ← AI Coach chat page
├── server.js
├── .env                  ← Add your GEMINI_API_KEY here
└── package.json          ← No extra packages needed (uses built-in https)
```

---

## Team
| Name | Roll No | Email |
|------|---------|-------|
| Somya Joshi (Lead) | 23022853 | Joshisomya82@gmail.com |
| Vaishali Nain | 23022148 | Vaishalinain2004@gmail.com |
| Mukul Dev | 230213681 | mdev97455@gmail.com |
| Kshitiz Singh | 23011679 | kshitizsingh1408@gmail.com |
