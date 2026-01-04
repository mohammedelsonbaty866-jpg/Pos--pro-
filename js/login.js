import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 ده كان ناقص

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  // تحويل رقم التليفون لإيميل وهمي
  const email = phone + "@pos.com";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("تم تسجيل الدخول");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("خطأ في الدخول");
    console.log(err.message);
  }
});
