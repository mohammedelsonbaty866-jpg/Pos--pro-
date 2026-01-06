import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
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

const body = document.getElementById("productsBody");
const addBtn = document.getElementById("addBtn");

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
      <td class="actions">
        <button onclick="deleteProduct('${d.id}')">حذف</button>
      </td>
    `;

    body.appendChild(tr);
  });
}

addBtn.onclick = async () => {
  const name = document.getElementById("name").value;
  const unit = document.getElementById("unit").value;
  const buyPrice = +document.getElementById("buyPrice").value;
  const minPrice = +document.getElementById("minPrice").value;
  const maxPrice = +document.getElementById("maxPrice").value;

  if (!name) {
    alert("اكتب اسم الصنف");
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

  document.querySelectorAll("input").forEach(i => i.value = "");
  loadProducts();
};

window.deleteProduct = async (id) => {
  if (confirm("حذف الصنف؟")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};

loadProducts();
