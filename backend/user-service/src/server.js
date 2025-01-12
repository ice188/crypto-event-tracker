require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/orm");
const googleAuthRoute = require("./routes/google.auth.route");
const githubAuthRoute = require("./routes/github.auth.route");
const loginRoute = require("./routes/auth.route");

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

//routes
app.use("/api/auth/google", googleAuthRoute);
app.use("/api/auth/github", githubAuthRoute);
app.use("/api/auth", loginRoute);
//error handling middleware

//start server
app.listen(process.env.PORT, () => {
  console.log(`\nUser microservice is running on port ${process.env.PORT}`);
});

module.exports = app;
