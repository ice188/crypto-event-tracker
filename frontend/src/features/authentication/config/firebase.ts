import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const fcm_token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_KEY,
    });
    localStorage.setItem("fcm_token", fcm_token);
  }
}

let notificationYOffset = 20;
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  const notificationDiv = document.createElement("div");
  notificationDiv.style.position = "fixed";
  notificationDiv.style.left = "20px";
  notificationDiv.style.bottom = `${notificationYOffset}px`;
  notificationDiv.style.padding = "10px";
  notificationDiv.style.backgroundColor = "#fff";
  notificationDiv.style.border = "1px solid #ccc";
  notificationDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  notificationDiv.style.zIndex = "1000";
  notificationDiv.style.borderRadius = "8px";
  notificationDiv.style.maxWidth = "300px";
  notificationDiv.style.display = "flex";
  notificationDiv.style.alignItems = "center";

  const img = document.createElement("img");
  img.src = payload.notification?.image || "";
  img.style.width = "50px";
  img.style.height = "50px";
  img.style.borderRadius = "50%";
  img.style.marginRight = "10px";

  const textDiv = document.createElement("div");

  const text = document.createElement("p");
  text.textContent = payload.notification?.body || "";
  text.style.margin = "0";

  textDiv.appendChild(text);

  notificationDiv.appendChild(img);
  notificationDiv.appendChild(textDiv);

  document.body.appendChild(notificationDiv);

  notificationYOffset += 80;

  setTimeout(() => {
    notificationDiv.remove();
    notificationYOffset -= 80;
  }, 5000);
});
