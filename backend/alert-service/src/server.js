require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/orm");

const alertRoute = require("./routes/alert.route");
const cryptoRoute = require("./routes/crypto.route");

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
app.use("/api/alert", alertRoute);
app.use("/api/crypto", cryptoRoute);

//error handling middleware

//start server
app.listen(process.env.PORT, () => {
  console.log(`\nAlert microservice is running on port ${process.env.PORT}`);
});

module.exports = app;
