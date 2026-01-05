import { db } from "./firebase-init.js";
import {
  collection, addDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productsRef = collection(db, "products");

const modal = document.getElementById("productModal");
const list = document.getElementById("productsList");

window.openModal = () => modal.style.display = "flex";
window.closeModal = () => modal.style.display = "none";

window.saveProduct = async () => {

  const data = {
    name: name.value,
    barcode: barcode.value,
    unit: unit.value,
    minPrice: +minPrice.value,
    maxPrice: +maxPrice.value,
    cost: +cost.value,
    stock: +stock.value,
    createdAt: new Date()
  };

  await addDoc(productsRef, data);
  closeModal();
};

onSnapshot(productsRef, snap => {
  list.innerHTML = "";
  snap.forEach(doc => {
    const p = doc.data();
    list.innerHTML += `
      <div class="product-card">
        <h4>${p.name}</h4>
        <small>وحدة: ${p.unit}</small><br>
        <small>سعر: ${p.minPrice} - ${p.maxPrice}</small><br>
        <small>مخزون: ${p.stock}</small>
      </div>
    `;
  });
});
