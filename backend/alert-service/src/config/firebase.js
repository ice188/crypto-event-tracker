
const asyncHandler = require("express-async-handler");
const { initializeApp } = require("firebase/app");
const { getDatabase,ref, get} = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const getFromFirebase = asyncHandler(async (path) => {
  const snapshot = await get(ref(database, path));
  return snapshot.val(); 
});

module.exports = { getFromFirebase };
