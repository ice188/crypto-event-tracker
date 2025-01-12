const { messaging } = require("../config/firebase");
const asyncHandler = require("express-async-handler");
const { QUEUE, getChannel } = require("../config/rabbitmq");

const onMessage = async (alert, token) => {
  const { coin_name, coin_image, alert_type, threshold_type, target_value } = alert;

  const message = {
    notification: {
      title: "Custom Alert",
      body: `${alert_type} of ${coin_name} is ${threshold_type} ${alert_type === "price" ? "$" : ""} ${target_value} ${alert_type === "price" ? "" : "%"}`,
      image: coin_image,
    },
    token,
    data: {
      coin_name,
      alert_type,
      threshold_type,
      target_value: target_value.toString(),
    },
  };

  try {
    const response = await messaging.send(message);
    console.log(`Notification sent successfully: ${response}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const startService = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "FCM token is required." });
  }

  const channel = await getChannel();
  channel.consume(QUEUE, async (msg) => {
    if (msg) {
      const alert = JSON.parse(msg.content.toString());
      await onMessage(alert, token); 
      channel.ack(msg); 
    }
  });

  console.log(`Notification service started`);
  res.status(200).json({ message: "Notification service started successfully." });
});

module.exports = { startService };
