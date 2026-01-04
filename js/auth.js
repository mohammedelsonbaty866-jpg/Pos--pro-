import { auth } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.recaptchaVerifier = new RecaptchaVerifier(
  'recaptcha-container',
  { size: 'invisible' },
  auth
);

document.getElementById("sendCode").addEventListener("click", async () => {
  const phone = document.getElementById("phone").value;

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    window.recaptchaVerifier
  );

  window.confirmationResult = confirmationResult;
  alert("تم إرسال الكود");
});

document.getElementById("login").addEventListener("click", async () => {
  const code = document.getElementById("code").value;
  await window.confirmationResult.confirm(code);
  alert("تم تسجيل الدخول");
});
