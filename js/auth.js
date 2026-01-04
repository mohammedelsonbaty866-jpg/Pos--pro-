import { auth } from "./firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// عناصر الصفحة
const phoneInput = document.getElementById("phone");
const codeInput = document.getElementById("code");
const sendCodeBtn = document.getElementById("sendCode");
const loginBtn = document.getElementById("login");

// متغير عام
let confirmationResult = null;

// تهيئة reCAPTCHA (مخفي)
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "sendCode",
  {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA verified");
    },
  }
);

// إرسال كود SMS
sendCodeBtn.addEventListener("click", async () => {
  try {
    let phone = phoneInput.value.trim();

    if (!phone.startsWith("+20")) {
      phone = "+20" + phone.substring(1);
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    alert("تم إرسال كود التحقق");
  } catch (error) {
    console.error(error);
    alert("خطأ في إرسال الكود");
  }
});

// تسجيل الدخول بالكود
loginBtn.addEventListener("click", async () => {
  try {
    const code = codeInput.value.trim();

    if (!confirmationResult) {
      alert("أرسل الكود أولاً");
      return;
    }

    const result = await confirmationResult.confirm(code);
    const user = result.user;

    console.log("تم تسجيل الدخول:", user.uid);

    // تحويل بعد الدخول
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert("كود غير صحيح");
  }
});
