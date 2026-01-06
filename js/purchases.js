import { db } from "./firebase-init.js";
import {
 collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const body = document.getElementById("productsBody");
const unitsDiv = document.getElementById("units");

loadProducts();

async function loadProducts(){
  body.innerHTML = "";
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(doc=>{
    const p = doc.data();
    body.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.barcode}</td>
        <td>${p.units.map(u=>u.name).join(" , ")}</td>
        <td>${p.stock}</td>
        <td><i class="fa fa-edit"></i></td>
      </tr>`;
  });
}

window.addUnit = ()=>{
  unitsDiv.innerHTML += `
  <div class="unit">
    <input placeholder="الوحدة">
    <input type="number" placeholder="تحويل">
    <input type="number" placeholder="أدنى">
    <input type="number" placeholder="أقصى">
  </div>`;
};

window.saveProduct = async ()=>{
  const units = [...document.querySelectorAll(".unit")].map(u=>{
    const i=u.querySelectorAll("input");
    return {
      name:i[0].value,
      factor:+i[1].value,
      minPrice:+i[2].value,
      maxPrice:+i[3].value
    };
  });

  await addDoc(collection(db,"products"),{
    name:name.value,
    barcode:barcode.value,
    units,
    stock:+stock.value
  });

  closeModal();
  loadProducts();
};

window.openModal=()=>productModal.style.display="flex";
window.closeModal=()=>productModal.style.display="none";
