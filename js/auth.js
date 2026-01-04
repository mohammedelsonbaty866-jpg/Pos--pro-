import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

let confirmationResult;

// reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "invisible",
    callback: () => {}
  }
);

// إرسال الكود
document.getElementById("sendCodeBtn").addEventListener("click", () => {
  const phone = document.getElementById("phone").value;

  if (!phone.startsWith("+")) {
    alert("اكتب الرقم بصيغة دولية مثال: +2010xxxxxxx");
    return;
  }

  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("تم إرسال الكود");
    })
    .catch((error) => {
      console.error(error);
      alert("خطأ في إرسال الكود");
    });
});

// تأكيد الكود
document.getElementById("verifyCodeBtn").addEventListener("click", () => {
  const code = document.getElementById("code").value;

  if (!confirmationResult) {
    alert("ابعت الكود الأول");
    return;
  }

  confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      alert("تم تسجيل الدخول ✔️");

      // مثال تحويل
      // window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      alert("كود غير صحيح");
    });
});
