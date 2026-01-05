// js/auth.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// تسجيل الدخول
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("اكتب الإيميل والباسورد");
    return;
  }

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      alert("المستخدم غير مسجل في النظام");
      return;
    }

    window.location.href = "index.html";
  } catch (err) {
    alert("خطأ في تسجيل الدخول");
    console.error(err);
  }
};

// تسجيل خروج
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// مراقبة الجلسة
onAuthStateChanged(auth, user => {
  if (!user && !location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
});
