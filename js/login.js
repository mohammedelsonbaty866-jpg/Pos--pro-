import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("resetBtn");
const remember = document.getElementById("remember");
const msg = document.getElementById("msg");

loginBtn.onclick = async () => {
  msg.innerText = "جاري تسجيل الدخول...";

  try {
    await setPersistence(
      auth,
      remember.checked
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    window.location.href = "dashboard.html";

  } catch (e) {
    msg.innerText = "بيانات الدخول غير صحيحة";
  }
};

resetBtn.onclick = async () => {
  if (!email.value) {
    alert("اكتب الإيميل الأول");
    return;
  }
  await sendPasswordResetEmail(auth, email.value);
  alert("تم إرسال رسالة إعادة تعيين كلمة المرور");
};
