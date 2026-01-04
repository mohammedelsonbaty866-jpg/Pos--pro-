import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";

window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha-container",
  { size: "normal" },
  auth
);

// إرسال الكود
window.sendCode = async function () {
  let phone = document.getElementById("phone").value.trim();

  if (phone.startsWith("0")) {
    phone = "+20" + phone.slice(1);
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    window.confirmationResult = confirmationResult;
    alert("تم إرسال الكود");
  } catch (err) {
    console.error(err);
    alert("خطأ في إرسال الكود");
  }
};

// تأكيد الكود + حفظ المستخدم
window.verifyCode = async function () {
  const code = document.getElementById("code").value;

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      phone: user.phoneNumber,
      role: "cashier",
      createdAt: serverTimestamp()
    }, { merge: true });

    alert("تم تسجيل الدخول بنجاح");
    console.log("UID:", user.uid);

  } catch (e) {
    alert("كود غير صحيح");
  }
};
