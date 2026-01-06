import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔴 حط إعدادات Firebase بتاعتك */
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const msg = document.getElementById("msg");

window.login = async () => {
  try{
    const email = email.value;
    const pass = password.value;

    await setPersistence(
      auth,
      remember.checked ? browserLocalPersistence : browserSessionPersistence
    );

    const userCred = await signInWithEmailAndPassword(auth,email,pass);

    if(!userCred.user.emailVerified){
      msg.innerHTML = "يرجى تأكيد البريد الإلكتروني";
      msg.className = "msg error";
      return;
    }

    location.href = "dashboard.html";
  }catch(e){
    msg.innerHTML = "بيانات الدخول غير صحيحة";
    msg.className = "msg error";
  }
};

window.register = async () => {
  try{
    const emailVal = email.value;
    const passVal = password.value;

    const userCred = await createUserWithEmailAndPassword(auth,emailVal,passVal);
    await sendEmailVerification(userCred.user);

    msg.innerHTML = "تم إنشاء الحساب ✔️ تحقق من بريدك";
    msg.className = "msg success";
  }catch(e){
    msg.innerHTML = "خطأ في إنشاء الحساب";
    msg.className = "msg error";
  }
};
