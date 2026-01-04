// Firebase v9 COMPAT (ضروري لسهولة auth)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.appspot.com",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed"
};

const app = initializeApp(firebaseConfig);

window.auth = getAuth(app);
window.db = getFirestore(app);

console.log("🔥 Firebase initialized");
