const express = require("express");
const env = require("./config/envConfig");
const cors = require("cors");
const connect = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const PaymentController = require("./controllers/PaymentController");

// database connection
connect();

// Configure CORS with credentials support
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT || 'http://localhost:3000', // Default if env not set
      'http://localhost:3001'
    ];
    
    if(allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      // For development, you can allow all origins
      // callback(null, origin);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'stripe-signature']
}));

// Webhook route must come before body parser middleware
app.post(
  "/api/webhook",
  express.raw({ type: 'application/json' }),
  PaymentController.checkOutSession
);

// Regular middleware for other routes
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to Vape Z" });
});

// user routes
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);

const port = env.PORT || 5000;

app.listen(port, () => {
  console.log(`Your server is running at port number: ${port}`);
});
