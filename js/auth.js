import { auth, db } from "./firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha",
  { size: "normal" },
  auth
);

window.sendCode = async function () {
  const phone = document.getElementById("phone").value;

  if (!phone) {
    alert("اكتب رقم الموبايل");
    return;
  }

  // 🔍 تحقق أن المستخدم مضاف من الأدمن
  const ref = doc(db, "users", phone);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().active !== true) {
    alert("غير مسموح بالدخول");
    return;
  }

  window.confirmationResult =
    await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);

  alert("تم إرسال كود التفعيل");
};

window.confirmCode = async function () {
  const code = document.getElementById("code").value;

  if (!code) {
    alert("اكتب الكود");
    return;
  }

  await window.confirmationResult.confirm(code);

  // ✔️ بعد الدخول
  window.location.href = "pages/admin-users.html";
};
