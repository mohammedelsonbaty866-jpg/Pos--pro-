import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const msg = document.getElementById("msg");

registerBtn.onclick = async () => {
  msg.innerText = "جاري إنشاء الحساب...";

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await sendEmailVerification(cred.user);

    msg.innerText = "تم إنشاء الحساب ✔ راجع بريدك لتأكيد الإيميل";
  } catch (e) {
    msg.innerText = "خطأ في البيانات أو الإيميل مستخدم";
  }
};
