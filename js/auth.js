// js/auth.js
import {
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "invisible"
  }
);

const sendBtn = document.getElementById("sendCode");
const loginBtn = document.getElementById("loginBtn");

let confirmationResultGlobal = null;

sendBtn.onclick = async () => {
  const phone = document.getElementById("phone").value.trim();
  if (!phone) {
    alert("اكتب رقم التليفون");
    return;
  }

  try {
    confirmationResultGlobal = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    alert("تم إرسال الكود");
  } catch (e) {
    alert(e.message);
  }
};

loginBtn.onclick = async () => {
  const code = document.getElementById("code").value.trim();
  if (!confirmationResultGlobal) {
    alert("ابعت الكود الأول");
    return;
  }

  try {
    const result = await confirmationResultGlobal.confirm(code);
    alert("تم تسجيل الدخول");

    // 👇 هنا تدخل على السيستم
    window.location.href = "dashboard.html";
  } catch (e) {
    alert("كود غلط");
  }
};
