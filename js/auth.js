// js/auth.js
import { auth } from "./firebase.js";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha-container",
  { size: "invisible" },
  auth
);

let confirmationResult;

window.sendCode = async () => {
  const phone = document.getElementById("phone").value;

  if (!phone.startsWith("+")) {
    alert("اكتب رقم الموبايل مع كود الدولة +20");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    document.getElementById("code-box").style.display = "block";
    alert("تم إرسال الكود");
  } catch (e) {
    alert(e.message);
  }
};

window.verifyCode = async () => {
  const code = document.getElementById("code").value;

  try {
    await confirmationResult.confirm(code);
window.location.href = "pages/dashboard.html";
  } catch {
    alert("كود غير صحيح");
  }
};
