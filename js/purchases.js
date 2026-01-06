import { db } from "./firebase-init.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("productsTable");
let editId = null;

// ===== LOAD =====
async function loadProducts(){
  table.innerHTML = "";
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(d=>{
    const p = d.data();
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.unit}</td>
        <td>${p.buy}</td>
        <td>${p.min}</td>
        <td>${p.max}</td>
        <td>${p.qty}</td>
        <td>
          <button onclick="editProduct('${d.id}')">✏️</button>
          <button onclick="deleteProduct('${d.id}')">🗑</button>
        </td>
      </tr>`;
  });
}
loadProducts();

// ===== MODAL =====
window.openProductModal = ()=>{
  editId = null;
  document.getElementById("productModal").style.display="flex";
};
window.closeModal = ()=>{
  document.getElementById("productModal").style.display="none";
};

// ===== SAVE =====
window.saveProduct = async ()=>{
  const data = {
    name: pName.value,
    barcode: pBarcode.value,
    unit: pUnit.value,
    buy: +pBuy.value,
    min: +pMin.value,
    max: +pMax.value,
    qty: +pQty.value,
    category: pCategory.value
  };

  if(editId){
    await updateDoc(doc(db,"products",editId),data);
  }else{
    await addDoc(collection(db,"products"),data);
  }
  closeModal();
  loadProducts();
};

// ===== DELETE =====
window.deleteProduct = async (id)=>{
  if(confirm("حذف الصنف؟")){
    await deleteDoc(doc(db,"products",id));
    loadProducts();
  }
};
