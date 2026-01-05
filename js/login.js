// js/login.js
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("من فضلك اكتب الإيميل وكلمة المرور");
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      alert("لا يوجد صلاحيات لهذا المستخدم");
      return;
    }

    const userData = userDoc.data();
    localStorage.setItem("user", JSON.stringify(userData));

    // دخول السيستم
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("خطأ في تسجيل الدخول");
    console.error(err);
  }
});
