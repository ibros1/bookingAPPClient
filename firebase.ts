// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmNXg6Hd5jh0QsTN2UqhvLuJDQKO9cPNE",
  authDomain: "bookingapp-1c7ba.firebaseapp.com",
  projectId: "bookingapp-1c7ba",
  storageBucket: "bookingapp-1c7ba.firebasestorage.app",
  messagingSenderId: "528798335110",
  appId: "1:528798335110:web:37f900c402956dcefb9107",
  measurementId: "G-7KHMJQLLBQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
