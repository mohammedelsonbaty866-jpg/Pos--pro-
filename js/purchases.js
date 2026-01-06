import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm";

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
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importExcel = document.getElementById("importExcel");

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
  const name = nameInput.value;
  if (!name) return alert("اكتب اسم الصنف");

  await addDoc(productsRef, {
    name,
    unit: unit.value,
    buyPrice: +buyPrice.value,
    minPrice: +minPrice.value,
    maxPrice: +maxPrice.value,
    createdAt: Date.now()
  });

  document.querySelectorAll("#productForm input").forEach(i => i.value = "");
  loadProducts();
};

window.deleteProduct = async (id) => {
  if (confirm("حذف الصنف؟")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};

// تصدير Excel
exportBtn.onclick = async () => {
  const snap = await getDocs(productsRef);
  const data = [];
  snap.forEach(d => data.push(d.data()));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, "products.xlsx");
};

// استيراد Excel
importBtn.onclick = () => importExcel.click();

importExcel.onchange = async (e) => {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  for (const r of rows) {
    await addDoc(productsRef, r);
  }

  loadProducts();
};

loadProducts();
