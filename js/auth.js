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

window.onload = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    { size: "invisible" }
  );
};

document.getElementById("sendCode").onclick = async () => {
  const phone = document.getElementById("phone").value;
  confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    window.recaptchaVerifier
  );
  alert("تم إرسال الكود");
};

document.getElementById("verifyCode").onclick = async () => {
  const code = document.getElementById("code").value;
  const result = await confirmationResult.confirm(code);
  const uid = result.user.uid;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("غير مسجل في النظام");
    return;
  }

  const role = snap.data().role;

  if (role === "admin") {
    location.href = "pages/dashboard.html";
  } else {
    location.href = "pages/sales.html";
  }
};
