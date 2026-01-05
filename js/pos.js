import { db } from "./firebase-init.js";
import {
 collection, addDoc, Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let cart = [];
let total = 0;

const tbody = document.querySelector("#cartTable tbody");

window.addProduct = (p) => {
  cart.push(p);
  render();
};

function render(){
  tbody.innerHTML="";
  total=0;
  cart.forEach((i,idx)=>{
    total += i.price * i.qty;
    tbody.innerHTML += `
    <tr>
      <td>${i.name}</td>
      <td>${i.unit}</td>
      <td>${i.qty}</td>
      <td>${i.price}</td>
      <td onclick="remove(${idx})">✖</td>
    </tr>`;
  });
  document.getElementById("total").innerText=total;
  calcNet();
}

window.remove = (i)=>{
  cart.splice(i,1);
  render();
};

document.getElementById("discount").oninput = calcNet;
function calcNet(){
  let d = Number(discount.value||0);
  document.getElementById("net").innerText = total-d;
}

window.saveSale = async ()=>{
  if(cart.length===0) return alert("الفاتورة فاضية");

  const paymentType = paymentType.value;
  const customer = customerName.value;

  if(paymentType==="credit" && !customer)
    return alert("اسم العميل إجباري");

  const sale = {
    customer: customer||"نقدي",
    paymentType,
    items: cart,
    total,
    discount: Number(discount.value||0),
    net: total-Number(discount.value||0),
    createdAt: Timestamp.now()
  };
const productsGrid = document.getElementById("productsGrid");

const demoProducts = [
 {name:"بيبسي", price:10},
 {name:"مياه", price:5},
 {name:"شيبسي", price:7}
];

demoProducts.forEach(p=>{
 productsGrid.innerHTML += `
  <div class="product-card" onclick='addProduct(${JSON.stringify(p)})'>
    ${p.name}<br>
    <small>${p.price} ج</small>
  </div>`;
});
  try{
    await addDoc(collection(db,"sales"), sale);
    alert("تم الحفظ");
    cart=[];
    render();
  }catch{
    localStorage.setItem("offlineSale",JSON.stringify(sale));
    alert("تم الحفظ Offline");
  }
};

window.printInvoice=()=>window.print();
