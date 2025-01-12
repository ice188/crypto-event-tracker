require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectRabbitMQ } = require("./config/rabbitmq");
const notifRoute = require("./routes/notification.route");

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use("/api/notification", notifRoute);

app.listen(process.env.PORT, async () => {
  await connectRabbitMQ();
  console.log(`Notification microservice is running on port ${process.env.PORT}`);
});

module.exports = app;
