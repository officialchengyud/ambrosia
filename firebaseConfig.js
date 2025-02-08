// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔥 Your Firebase Config (from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBUSSrpb-tWiZ9TdS4b7uLuSz40d7g5cWU",
    authDomain: "ambrosia-6b91e.firebaseapp.com",
    projectId: "ambrosia-6b91e",
    storageBucket: "ambrosia-6b91e.firebasestorage.app",
    messagingSenderId: "1067287090057",
    appId: "1:1067287090057:web:adc944d6b433e380594758"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
