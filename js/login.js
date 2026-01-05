import { auth, db } from "./firebase-init.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorBox.textContent = "من فضلك أدخل البيانات";
    return;
  }

  try {
    // تسجيل الدخول
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // جلب بيانات المستخدم من Firestore
    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      errorBox.textContent = "لا يوجد صلاحية لهذا الحساب";
      return;
    }

    const role = userDoc.data().role;

    // توجيه حسب الصلاحية
    if (role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "rep-sales.html";
    }

  } catch (err) {
    errorBox.textContent = "بيانات الدخول غير صحيحة";
    console.error(err);
  }
});
