import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("reset");
const error = document.getElementById("error");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    error.innerText = "من فضلك أدخل البيانات";
    return;
  }

  loginBtn.innerText = "جاري الدخول...";
  loginBtn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (e) {
    error.innerText = "بيانات الدخول غير صحيحة";
    loginBtn.innerText = "دخول";
    loginBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("اكتب البريد الإلكتروني أولاً");
    return;
  }
  await sendPasswordResetEmail(auth, email);
  alert("تم إرسال رابط إعادة تعيين كلمة المرور");
});
