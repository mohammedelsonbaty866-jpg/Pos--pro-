import { db, auth } from "./firebase-init.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ====== State ====== */
window.cart = [];
let paymentType = "cash";
let transferData = null;

/* ====== Helpers ====== */
function $(id){ return document.getElementById(id); }

/* ====== Product Search (Mock – مربوط بعدين بالأصناف) ====== */
window.searchProduct = function(value){
  // هنا لاحقًا نربط بالأصناف من Firestore
  // دلوقتي مجرد مثال
  if(value.length < 2) return;
};

/* ====== Cart ====== */
function renderCart(){
  const body = $("cartBody");
  body.innerHTML = "";
  let total = 0;

  cart.forEach((item,i)=>{
    total += item.price * item.qty;

    body.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>
          <input type="number" min="1" value="${item.qty}"
            onchange="updateQty(${i},this.value)">
        </td>
        <td>
          <input type="number" value="${item.price}"
            onchange="updatePrice(${i},this.value)">
        </td>
        <td>
          <button onclick="removeItem(${i})">❌</button>
        </td>
      </tr>
    `;
  });

  $("totalAmount").innerText = total.toFixed(2);
}

window.updateQty = (i,val)=>{
  cart[i].qty = Number(val);
  renderCart();
};

window.updatePrice = (i,val)=>{
  const price = Number(val);

  const min = cart[i].minPrice;
  const max = cart[i].maxPrice;

  if(price < min || price > max){
    alert(`⚠️ السعر خارج النطاق (${min} - ${max})`);
  }

  cart[i].price = price;
  renderCart();
};

window.removeItem = (i)=>{
  cart.splice(i,1);
  renderCart();
};

window.clearCart = ()=>{
  cart = [];
  renderCart();
};

/* ====== Sale Type ====== */
window.handleSaleType = ()=>{
  if($("saleType").value === "credit"){
    $("customerName").placeholder = "اسم العميل (إجباري)";
  }else{
    $("customerName").value = "";
  }
};

/* ====== Payment ====== */
window.handlePaymentType = ()=>{
  paymentType = $("paymentType").value;
  if(paymentType === "transfer"){
    $("transferModal").classList.remove("hidden");
  }
};

window.closeTransfer = ()=>{
  $("transferModal").classList.add("hidden");
};

window.confirmTransfer = ()=>{
  transferData = {
    type: $("transferType").value,
    account: $("transferAccount").value,
    ref: $("transferRef").value || ""
  };
  closeTransfer();
};

/* ====== Save Invoice (ONLINE + OFFLINE) ====== */
window.saveInvoice = async ()=>{
  if(cart.length === 0){
    alert("الفاتورة فاضية");
    return;
  }

  if($("saleType").value === "credit" && !$("customerName").value){
    alert("اسم العميل إجباري في البيع الآجل");
    return;
  }

  const user = auth.currentUser;
  if(!user){
    alert("يجب تسجيل الدخول");
    return;
  }

  const invoice = {
    items: cart,
    total: Number($("totalAmount").innerText),
    customer: $("customerName").value || "نقدي",
    saleType: $("saleType").value,
    paymentType,
    transfer: transferData,
    cashierId: user.uid,
    createdAt: serverTimestamp()
  };

  try{
    await addDoc(collection(db,"sales"), invoice);
    alert("✅ تم حفظ الفاتورة");
    clearCart();
  }catch(e){
    // Offline fallback
    const offline = JSON.parse(localStorage.getItem("offlineSales")||"[]");
    offline.push(invoice);
    localStorage.setItem("offlineSales",JSON.stringify(offline));
    alert("⚠️ تم الحفظ أوفلاين – سيُزامن عند الاتصال");
  }
};

/* ====== Print ====== */
window.printInvoice = ()=>{
  window.print();
};

/* ====== Sync Offline ====== */
window.addEventListener("online", async ()=>{
  const offline = JSON.parse(localStorage.getItem("offlineSales")||"[]");
  if(!offline.length) return;

  for(const inv of offline){
    await addDoc(collection(db,"sales"), inv);
  }
  localStorage.removeItem("offlineSales");
});
