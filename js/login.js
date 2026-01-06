// js/login.js
import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const remember = document.getElementById("remember");
const msg = document.getElementById("msg");

async function setRemember() {
  await setPersistence(
    auth,
    remember.checked ? browserLocalPersistence : browserSessionPersistence
  );
}

loginBtn.addEventListener("click", async () => {
  msg.textContent = "";
  try {
    await setRemember();
    const user = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    if (!user.user.emailVerified) {
      msg.textContent = "يرجى تأكيد البريد الإلكتروني";
      return;
    }

    location.href = "dashboard.html";
  } catch (e) {
    msg.textContent = "بيانات الدخول غير صحيحة";
  }
});

registerBtn.addEventListener("click", async () => {
  msg.textContent = "";
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    await sendEmailVerification(res.user);
    msg.style.color = "#4ade80";
    msg.textContent = "تم إنشاء الحساب – راجع بريدك للتأكيد";
  } catch {
    msg.textContent = "خطأ في إنشاء الحساب";
  }
});
