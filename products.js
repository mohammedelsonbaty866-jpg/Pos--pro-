import { db } from "./firebase-init.js";
import {
  collection, addDoc, getDocs, updateDoc,
  doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const col = collection(db, "products");
let editId = null;

window.saveProduct = async () => {
  const product = {
    name: name.value,
    barcode: barcode.value,
    unit: {
      main: mainUnit.value,
      sub: subUnit.value,
      factor: +unitFactor.value || 1
    },
    buyPrice: +buyPrice.value,
    sellPrice: +sellPrice.value,
    minSellPrice: +minSell.value,
    maxSellPrice: +maxSell.value,
    stock: +stock.value,
    createdAt: serverTimestamp()
  };

  if (editId) {
    await updateDoc(doc(db, "products", editId), product);
    editId = null;
  } else {
    await addDoc(col, product);
  }

  clearForm();
  loadProducts();
};

window.loadProducts = async () => {
  const q = search.value.toLowerCase();
  const snap = await getDocs(col);
  productsTable.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    if (!p.name.toLowerCase().includes(q)) return;

    productsTable.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.unit.main}${p.unit.sub ? " / " + p.unit.sub : ""}</td>
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
  const snap = await getDocs(col);
  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      editId = id;

      name.value = p.name;
      barcode.value = p.barcode;
      mainUnit.value = p.unit.main;
      subUnit.value = p.unit.sub;
      unitFactor.value = p.unit.factor;
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
