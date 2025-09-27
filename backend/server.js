require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const diaryRoutes = require("./routes/diaryRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// test route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// diary routes
app.use("/api/diary", diaryRoutes);

// error handler
app.use(errorHandler);

// connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
