import { auth, db } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const phoneInput = document.getElementById("phone");
const codeInput  = document.getElementById("code");
const btn        = document.getElementById("mainBtn");
const msg        = document.getElementById("msg");

let confirmationResult = null;

// reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha",
  { size: "normal" },
  auth
);

// زر واحد فقط
btn.onclick = async () => {
  // المرحلة 1: إرسال الكود
  if (!confirmationResult) {
    const phone = phoneInput.value.trim();

    if (!phone) {
      msg.innerText = "❌ اكتب رقم الموبايل";
      return;
    }

    const userRef = doc(db, "users", phone);
    const snap = await getDoc(userRef);

    // 2️⃣ رقم غير مسجل
    if (!snap.exists()) {
      msg.innerText = "❌ الرقم غير مسجل في النظام";
      return;
    }

    const userData = snap.data();

    // 4️⃣ منع الدخول لو غير نشط
    if (userData.active === false) {
      msg.innerText = "⛔ الحساب موقوف";
      return;
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    codeInput.style.display = "block";
    btn.innerText = "تأكيد الدخول";
    msg.innerText = "📩 تم إرسال كود التفعيل";
  }

  // المرحلة 2: تأكيد الكود
  else {
    const code = codeInput.value.trim();

    if (!code) {
      msg.innerText = "❌ اكتب كود التفعيل";
      return;
    }

    const result = await confirmationResult.confirm(code);
    const phone = result.user.phoneNumber;

    const userRef = doc(db, "users", phone);
    const snap = await getDoc(userRef);
    const userData = snap.data();

    // 3️⃣ حفظ آخر دخول
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });

    // 5️⃣ تحويل حسب الدور
    if (userData.role === "admin") {
      window.location.href = "pages/dashboard.html";
    } else {
      window.location.href = "pages/rep-sales.html";
    }
  }
};
