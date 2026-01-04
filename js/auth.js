import { auth, db } from "./firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("auth.js loaded ✅");

window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha",
  { size: "normal" },
  auth
);

document.getElementById("sendBtn").onclick = async () => {
  const phone = document.getElementById("phone").value;

  if (!phone) {
    alert("اكتب رقم الموبايل");
    return;
  }

  const ref = doc(db, "users", phone);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("الرقم غير مسجل");
    return;
  }

  window.confirmationResult =
    await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);

  alert("تم إرسال الكود");
};

document.getElementById("loginBtn").onclick = async () => {
  const code = document.getElementById("code").value;

  if (!code) {
    alert("اكتب الكود");
    return;
  }

  await window.confirmationResult.confirm(code);

  alert("تم تسجيل الدخول");
  window.location.href = "pages/admin-users.html";
};
