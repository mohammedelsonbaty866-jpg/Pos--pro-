import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isLogin = true;

window.toggleMode = function(){
  isLogin = !isLogin;
  document.getElementById("title").innerText =
    isLogin ? "تسجيل الدخول" : "إنشاء حساب";
};

window.login = function(){
  const email = email.value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("rememberMe").checked;

  const persistence = remember
    ? browserLocalPersistence
    : browserSessionPersistence;

  setPersistence(auth, persistence).then(()=>{
    if(isLogin){
      return signInWithEmailAndPassword(auth,email,password);
    }else{
      return createUserWithEmailAndPassword(auth,email,password);
    }
  })
  .then(()=>{
    window.location.href="dashboard.html";
  })
  .catch(err=>{
    alert(err.message);
  });
};
