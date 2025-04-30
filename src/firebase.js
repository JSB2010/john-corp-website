// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtk4Xbgg2ScOBHgiMKwvSTtBO4PCprIFc",
  authDomain: "john-corp.firebaseapp.com",
  projectId: "john-corp",
  storageBucket: "john-corp.firebasestorage.app",
  messagingSenderId: "121985220638",
  appId: "1:121985220638:web:1837aa94640c642f292e0f",
  measurementId: "G-1Z942LZXRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup
};
