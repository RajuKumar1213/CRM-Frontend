import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWe7QGbtmu__zOpaFSv0d_fZZNj1C91a4",
  authDomain: "dropheaven-79767.firebaseapp.com",
  projectId: "dropheaven-79767",
  storageBucket: "dropheaven-79767.firebasestorage",
  messagingSenderId: "760280365072",
  appId: "1:760280365072:web:3712981ce651e6d7f83295",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


