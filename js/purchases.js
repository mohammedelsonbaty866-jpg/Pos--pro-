import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.appspot.com",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "products");

document.addEventListener("DOMContentLoaded", () => {

  const body = document.getElementById("productsBody");
  const addBtn = document.getElementById("addBtn");

  if (!body || !addBtn) {
    console.error("عناصر الصفحة غير موجودة");
    return;
  }

  async function loadProducts() {
    body.innerHTML = "";

    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    snap.forEach(d => {
      const p = d.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.unit}</td>
        <td>${p.buyPrice}</td>
        <td>${p.minPrice}</td>
        <td>${p.maxPrice}</td>
        <td>
          <button class="del-btn">حذف</button>
        </td>
      `;

      tr.querySelector(".del-btn").addEventListener("click", async () => {
        if (confirm("حذف الصنف؟")) {
          await deleteDoc(doc(db, "products", d.id));
          loadProducts();
        }
      });

      body.appendChild(tr);
    });
  }

  addBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const unit = document.getElementById("unit").value;
    const buyPrice = Number(document.getElementById("buyPrice").value);
    const minPrice = Number(document.getElementById("minPrice").value);
    const maxPrice = Number(document.getElementById("maxPrice").value);

    if (!name) {
      alert("اسم الصنف مطلوب");
      return;
    }

    if (minPrice > maxPrice) {
      alert("الحد الأدنى أكبر من الأقصى");
      return;
    }

    await addDoc(productsRef, {
      name,
      unit,
      buyPrice,
      minPrice,
      maxPrice,
      createdAt: Date.now()
    });

    document.querySelectorAll(".form input").forEach(i => i.value = "");
    loadProducts();
  });

  loadProducts();
});
