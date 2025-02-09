// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// 🔥 Your Firebase Config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBUSSrpb-tWiZ9TdS4b7uLuSz40d7g5cWU",
  authDomain: "ambrosia-6b91e.firebaseapp.com",
  projectId: "ambrosia-6b91e",
  storageBucket: "ambrosia-6b91e.firebasestorage.app",
  messagingSenderId: "1067287090057",
  appId: "1:1067287090057:web:adc944d6b433e380594758",
};

// Function to sign in a user
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    // console.error("Login error:", error.message);
    return null;
  }
};

// Function to sign out a user
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

// Function to register a new user
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User registered:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error.message);
    return null;
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, onAuthStateChanged, loginUser, logoutUser, registerUser };
