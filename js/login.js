import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btn = document.getElementById("loginBtn");

btn.addEventListener("click", async () => {
  const email = email.value.trim();
  const password = password.value;

  if (!email || !password) {
    alert("اكمل البيانات");
    return;
  }

  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (e) {
    alert("بيانات غير صحيحة");
  }

  btn.disabled = false;
});
