const productsGrid = document.getElementById("productsGrid");
const cartBody = document.getElementById("cartBody");
const totalEl = document.getElementById("total");
const netEl = document.getElementById("net");
const discountInput = document.getElementById("discount");

let cart = [];

// أصناف تجريبية (هتتربط بـ Firestore)
const products = [
 {id:1,name:"بيبسي",price:10},
 {id:2,name:"مياه",price:5},
 {id:3,name:"شيبسي",price:7},
 {id:4,name:"عصير",price:12}
];

products.forEach(p=>{
 productsGrid.innerHTML += `
  <div class="product-card" onclick="addProduct(${p.id})">
    ${p.name}
    <small>${p.price} ج</small>
  </div>
 `;
});

function addProduct(id){
 const p = products.find(x=>x.id===id);
 const item = cart.find(x=>x.id===id);

 if(item){
  item.qty++;
 }else{
  cart.push({...p,qty:1});
 }
 renderCart();
}

function renderCart(){
 cartBody.innerHTML="";
 let total=0;

 cart.forEach((i,idx)=>{
  total+=i.qty*i.price;
  cartBody.innerHTML+=`
   <tr>
    <td>${i.name}</td>
    <td>${i.qty}</td>
    <td>${i.price}</td>
    <td onclick="removeItem(${idx})">❌</td>
   </tr>
  `;
 });

 totalEl.innerText=total;
 calcNet();
}

function removeItem(i){
 cart.splice(i,1);
 renderCart();
}

discountInput.oninput=calcNet;

function calcNet(){
 const total=+totalEl.innerText;
 const discount=+discountInput.value||0;
 netEl.innerText= total-discount;
}

function saveInvoice(){
 const type=document.getElementById("paymentType").value;
 const customer=document.getElementById("customerName").value;

 if(type==="credit" && !customer){
  alert("اسم العميل مطلوب في البيع الآجل");
  return;
 }

 alert("✔ تم حفظ الفاتورة (جاهز للربط مع Firebase)");
 cart=[];
 renderCart();
 discountInput.value="";
}
import { db, auth } from "./firebase-init.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.saveInvoice = async function () {

  if(cart.length === 0){
    alert("الفاتورة فاضية");
    return;
  }

  if(saleType.value === "credit" && !customer.value){
    alert("اسم العميل إجباري في الآجل");
    return;
  }

  const user = auth.currentUser;
  if(!user){
    alert("يجب تسجيل الدخول");
    return;
  }

  const invoiceData = {
    items: cart,
    total: Number(document.getElementById("total").innerText),
    customer: customer.value || "نقدي",
    saleType: saleType.value,
    payment: paymentType,
    cashierId: user.uid,
    createdAt: serverTimestamp()
  };

  try{
    await addDoc(collection(db, "sales"), invoiceData);
    alert("✅ تم حفظ الفاتورة أونلاين");
    location.reload();
  }catch(e){
    console.error(e);
    alert("❌ خطأ في الحفظ");
  }
};
