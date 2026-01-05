import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById("loginBtn");
const loader = document.getElementById("loader");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("أدخل البيانات كاملة");
    return;
  }

  loader.style.display = "block";
  btn.disabled = true;

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      alert("لا يوجد صلاحيات");
      return;
    }

    localStorage.setItem("user", JSON.stringify(userDoc.data()));
    window.location.href = "dashboard.html";

  } catch (e) {
    alert("بيانات غير صحيحة");
  } finally {
    loader.style.display = "none";
    btn.disabled = false;
  }
});
