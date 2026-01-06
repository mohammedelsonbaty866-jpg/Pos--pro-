import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// نفس إعدادات مشروعك
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

async function loadProducts(){
  body.innerHTML = "";
  const snap = await getDocs(productsRef);
  snap.forEach(d=>{
    const p = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td><span class="badge">${p.unit}</span></td>
      <td>${p.buyPrice}</td>
      <td>${p.minPrice}</td>
      <td>${p.maxPrice}</td>
      <td class="actions">
        <button onclick="editProduct('${d.id}','${p.name}','${p.unit}',${p.buyPrice},${p.minPrice},${p.maxPrice})">تعديل</button>
        <button onclick="deleteProduct('${d.id}')">حذف</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

addBtn.addEventListener("click", async ()=>{
  const name = nameInput.value.trim();
  const unit = unitSelect.value;
  const buyPrice = +buyPriceInput.value;
  const minPrice = +minPriceInput.value;
  const maxPrice = +maxPriceInput.value;

  if(!name) return alert("اكتب اسم الصنف");
  if(minPrice > maxPrice) return alert("الحد الأدنى أكبر من الأقصى");

  await addDoc(productsRef,{
    name, unit, buyPrice, minPrice, maxPrice,
    createdAt: Date.now()
  });

  document.querySelectorAll("input").forEach(i=>i.value="");
  loadProducts();
});

window.deleteProduct = async(id)=>{
  if(confirm("تأكيد الحذف؟")){
    await deleteDoc(doc(db,"products",id));
    loadProducts();
  }
};

window.editProduct = async(id,n,u,b,min,max)=>{
  const name = prompt("اسم الصنف", n);
  if(!name) return;
  const buyPrice = +prompt("سعر الشراء", b);
  const minPrice = +prompt("أقل سعر بيع", min);
  const maxPrice = +prompt("أقصى سعر بيع", max);
  if(minPrice > maxPrice) return alert("الحد الأدنى أكبر من الأقصى");

  await updateDoc(doc(db,"products",id),{
    name, unit:u, buyPrice, minPrice, maxPrice
  });
  loadProducts();
};

// عناصر
const nameInput = document.getElementById("name");
const unitSelect = document.getElementById("unit");
const buyPriceInput = document.getElementById("buyPrice");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

loadProducts();
