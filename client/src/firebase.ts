// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-79ca0.firebaseapp.com",
  projectId: "mern-estate-79ca0",
  storageBucket: "mern-estate-79ca0.appspot.com",
  messagingSenderId: "180536958404",
  appId: "1:180536958404:web:b5b93eeeadbd9918751891",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
