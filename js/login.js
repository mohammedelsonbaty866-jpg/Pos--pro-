// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== Firebase Config ===== */

Wepap pos pro

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.firebasestorage.app",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/* ===== Init ===== */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ===== Elements ===== */
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const rememberCheck = document.getElementById("remember");
const msg = document.getElementById("msg");

/* ===== Login ===== */
window.login = async () => {
  try {
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      showMsg("اكتب البريد وكلمة المرور", "error");
      return;
    }

    await setPersistence(
      auth,
      rememberCheck.checked
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      showMsg("من فضلك أكد البريد الإلكتروني أولاً", "error");
      return;
    }

    location.href = "dashboard.html";
  } catch (err) {
    showMsg("بيانات الدخول غير صحيحة", "error");
  }
};

/* ===== Register ===== */
window.register = async () => {
  try {
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      showMsg("اكتب البريد وكلمة المرور", "error");
      return;
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCred.user);

    showMsg("تم إنشاء الحساب ✔️ تحقق من بريدك", "success");
  } catch (err) {
    showMsg("خطأ أثناء إنشاء الحساب", "error");
  }
};

/* ===== Helper ===== */
function showMsg(text, type) {
  msg.textContent = text;
  msg.className = `msg ${type}`;
}
