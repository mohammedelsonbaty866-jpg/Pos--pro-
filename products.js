import { db } from "./firebase-init.js";
import {
  collection, addDoc, getDocs,
  updateDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const colRef = collection(db, "products");
let editId = null;

window.saveProduct = async () => {
  const data = {
    name: name.value,
    barcode: barcode.value,
    category: category.value,
    buyPrice: +buyPrice.value,
    sellPrice: +sellPrice.value,
    minSellPrice: +minSell.value,
    maxSellPrice: +maxSell.value,
    stock: +stock.value,
    active: true,
    createdAt: serverTimestamp()
  };

  if (editId) {
    await updateDoc(doc(db, "products", editId), data);
    editId = null;
  } else {
    await addDoc(colRef, data);
  }

  clearForm();
  loadProducts();
};

window.loadProducts = async () => {
  const q = search.value.toLowerCase();
  const snap = await getDocs(colRef);
  productsTable.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    if (!p.name.toLowerCase().includes(q) && !p.barcode.includes(q)) return;

    productsTable.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.sellPrice}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editProduct('${d.id}')">✏️</button>
        </td>
      </tr>
    `;
  });
};

window.editProduct = async (id) => {
  const snap = await getDocs(colRef);
  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      editId = id;

      name.value = p.name;
      barcode.value = p.barcode;
      category.value = p.category;
      buyPrice.value = p.buyPrice;
      sellPrice.value = p.sellPrice;
      minSell.value = p.minSellPrice;
      maxSell.value = p.maxSellPrice;
      stock.value = p.stock;
    }
  });
};

function clearForm() {
  document.querySelectorAll("input").forEach(i => i.value = "");
}

loadProducts();
