import { auth, db } from "./firebase.js";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let confirmationResult;

window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "invisible",
    callback: () => {}
  }
);

document.getElementById("sendCode").addEventListener("click", async () => {
  const phone = document.getElementById("phone").value.trim();

  if (!phone) {
    alert("اكتب رقم التليفون");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    alert("تم إرسال الكود");
  } catch (e) {
    alert("خطأ في إرسال الكود");
    console.error(e);
  }
});

document.getElementById("verifyCode").addEventListener("click", async () => {
  const code = document.getElementById("code").value.trim();

  if (!code || !confirmationResult) {
    alert("أدخل الكود");
    return;
  }

  try {
    const result = await confirmationResult.confirm(code);
    const uid = result.user.uid;

    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      alert("غير مسجل في النظام");
      return;
    }

    location.href = "pages/sales.html";
  } catch (e) {
    alert("كود غير صحيح");
  }
});
