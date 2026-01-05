import { auth, db } from "./firebase-init.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.go = page => location.href = page;

window.logout = async () => {
  await signOut(auth);
  location.href = "index.html";
};

onAuthStateChanged(auth, async user => {
  if(!user){
    location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db,"users",user.uid));
  const data = snap.data();

  document.getElementById("userName").innerText =
    data.name + " ("+data.role+")";

  if(data.role !== "admin"){
    document.querySelectorAll(".admin")
      .forEach(el => el.style.display="none");
  }
});

window.addEventListener("online",()=>status("online"));
window.addEventListener("offline",()=>status("offline"));

function status(s){
  const el=document.getElementById("status");
  el.className=s;
  el.innerText = s==="online"?"● Online":"● Offline";
}
