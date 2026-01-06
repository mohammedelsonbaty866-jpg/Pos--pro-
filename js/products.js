import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.appspot.com",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed"
};

/* Init Firebase */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* References */
const productsRef = collection(db, "products");
const body = document.getElementById("productsBody");

/* Inputs */
const nameInput = document.getElementById("name");
const unitInput = document.getElementById("unit");
const buyPriceInput = document.getElementById("buyPrice");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

/* Load Products */
async function loadProducts() {
  body.innerHTML = "";
  const snap = await getDocs(productsRef);

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
        <button onclick="deleteProduct('${d.id}')">حذف</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

/* ✅ FINAL ADD PRODUCT (محصّن) */
window.addProduct = async function () {
  try {
    const name = nameInput.value.trim();
    if (!name) {
      alert("⚠️ اكتب اسم الصنف");
      return;
    }

    await addDoc(productsRef, {
      name,
      unit: unitInput.value,
      buyPrice: Number(buyPriceInput.value || 0),
      minPrice: Number(minPriceInput.value || 0),
      maxPrice: Number(maxPriceInput.value || 0),
      createdAt: serverTimestamp()
    });

    document.querySelectorAll("input").forEach(i => i.value = "");
    loadProducts();
  } catch (e) {
    alert("❌ حصل خطأ – تأكد من الاتصال بالإنترنت");
    console.error(e);
  }
};

/* Delete */
window.deleteProduct = async function (id) {
  if (confirm("حذف الصنف؟")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};

/* Start */
document.addEventListener("DOMContentLoaded", loadProducts);
