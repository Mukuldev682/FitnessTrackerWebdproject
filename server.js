require('dotenv').config();
const express        = require('express');
const http           = require('http');
const socketIo       = require('socket.io');
const session        = require('express-session');
const flash          = require('connect-flash');
const methodOverride = require('method-override');
const path           = require('path');

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server);

// ── Database ──────────────────────────────────────────
const connectDB = require('./config/db');
connectDB();

// ── Middleware ────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'fitlive_secret',
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

app.use(flash());

// ── View Engine ───────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Global template variables ─────────────────────────
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.user        = req.session.user || null;
  next();
});

// ── Routes ────────────────────────────────────────────
app.use('/',           require('./routes/auth'));
app.use('/dashboard',  require('./routes/dashboard'));
app.use('/diet',       require('./routes/diet'));
app.use('/workout',    require('./routes/workout'));
app.use('/',   require('./routes/password'));
app.use('/weight',     require('./routes/weight'));
app.use('/goals',      require('./routes/goals'));
app.use('/googlefit',  require('./routes/googlefit'));
app.use('/ai',         require('./routes/ai'));           // AI features

// ── Socket.io – Real-Time Health Data ─────────────────
const User = require('./models/User');
const { getLiveHealthData } = require('./services/googleFitService');

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  let userId   = null;
  let simState = { heartRate: 72, steps: 0, caloriesBurned: 0 };

  // Client registers its userId so we can fetch Google Fit data for it
  socket.on('register-user', (uid) => {
    userId = uid;
    console.log('Socket user registered:', uid);
  });

  const interval = setInterval(async () => {
    try {
      if (userId) {
        const dbUser = await User.findById(userId)
          .select('googleFitConnected googleAccessToken googleRefreshToken googleTokenExpiry _id');

        if (dbUser && dbUser.googleFitConnected) {
          // ── Real Google Fit data ──────────────────
          const data = await getLiveHealthData(dbUser);
          socket.emit('health-data', {
            source:         'google_fit',
            heartRate:      data.heartRate      ?? simState.heartRate,
            steps:          data.steps          ?? simState.steps,
            caloriesBurned: data.caloriesBurned ?? simState.caloriesBurned,
            weight:         data.weight         ?? null,
            timestamp:      new Date().toLocaleTimeString()
          });
          return;
        }
      }

      // ── Simulated fallback ────────────────────────
      simState.heartRate = Math.max(55, Math.min(140,
        Math.round(simState.heartRate + (Math.random() - 0.45) * 4)
      ));
      simState.steps          += Math.floor(Math.random() * 3);
      simState.caloriesBurned  = Math.round(simState.steps * 0.04);

      socket.emit('health-data', {
        source:         'simulated',
        heartRate:      simState.heartRate,
        steps:          simState.steps,
        caloriesBurned: simState.caloriesBurned,
        weight:         null,
        timestamp:      new Date().toLocaleTimeString()
      });

    } catch (err) {
      console.error('Socket interval error:', err.message);
    }
  }, 3000); // every 3 seconds (Google Fit API rate-limit friendly)

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    clearInterval(interval);
  });
});

// ── Start Server ──────────────────────────────────────
const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Sample route (test)
app.get("/", (req, res) => {
  res.send("API is working on Vercel 🚀");
});

// 👉 If you have routes, add them like:
// const userRoutes = require("../routes/userRoutes");
// app.use("/api/users", userRoutes);

// ❌ DO NOT use app.listen()

// ✅ Export for Vercel
module.exports = serverless(app);
