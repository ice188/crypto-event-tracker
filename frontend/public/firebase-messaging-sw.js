importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyAchpZ1IxTo6zATWhkMn05PLldxR7s3ipQ",
  authDomain: "finpulse-653e2.firebaseapp.com",
  databaseURL: "https://finpulse-653e2-default-rtdb.firebaseio.com",
  projectId: "finpulse-653e2",
  storageBucket: "finpulse-653e2.firebasestorage.app",
  messagingSenderId: "69334135331",
  appId: "1:69334135331:web:04bf6112a5096480dbb796",
  measurementId: "G-NXSEHLYYZ7",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = "New Notification";
  const notificationOptions = {
    title: payload.notification.title,
    body: payload.notification.body,
    image: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
