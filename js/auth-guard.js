import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().active !== true) {
    alert("لا يوجد صلاحيات");
    await signOut(auth);
    window.location.href = "../index.html";
    return;
  }

  // اسم المستخدم لو حابب تظهره
  const nameEl = document.getElementById("username");
  if (nameEl) {
    nameEl.innerText = snap.data().name || "مستخدم";
  }
  import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});
});

// زر تسجيل الخروج
window.logout = async function () {
  await signOut(auth);
  window.location.href = "../index.html";
};
