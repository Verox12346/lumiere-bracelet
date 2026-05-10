require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/orders');

const app = express();

// ===== SECURITY MIDDLEWARE =====
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// CORS — allow your frontend domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',   // Live Server (VS Code)
  process.env.FRONTEND_URL,  // Your Vercel/GitHub Pages URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ===== ROUTES =====
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '✨ Lumiere Bracelet API is running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Lumiere Bracelet API running on port ${PORT}`);
});
