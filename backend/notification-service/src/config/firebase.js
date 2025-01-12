const admin = require("firebase-admin");
const { initializeApp,  applicationDefault } = require('firebase-admin/app');

initializeApp({
  credential: applicationDefault(),
});

const messaging = admin.messaging();
module.exports = { messaging };