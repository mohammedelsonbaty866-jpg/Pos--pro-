import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let saleItems = [];
let saleTotal = 0;

// 🔥 حفظ الفاتورة
document.getElementById("saveSaleBtn").onclick = async () => {
  if (saleItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const customerId = document.getElementById("customerId").value || null;
  const customerName = document.getElementById("customerName").value || "نقدي";
  const paidType = document.querySelector("input[name='paidType']:checked").value;

  // 1️⃣ حفظ الفاتورة
  const saleRef = await addDoc(collection(db, "sales"), {
    customerId,
    customerName,
    repId: localStorage.getItem("repId") || null,
    items: saleItems,
    total: saleTotal,
    paidType,
    treasuryId: "main",
    date: serverTimestamp()
  });

  // 2️⃣ تحديث المخزون
  for (const item of saleItems) {
    await updateDoc(doc(db, "products", item.productId), {
      stock: increment(-item.qty)
    });
  }

  // 3️⃣ تحديث الخزنة لو نقدي
  if (paidType === "cash") {
    await addDoc(collection(db, "cash"), {
      amount: saleTotal,
      type: "in",
      source: "sale",
      sourceId: saleRef.id,
      treasuryId: "main",
      date: serverTimestamp()
    });
  }

  // 4️⃣ تحديث كشف حساب العميل لو أجل
  if (paidType === "credit" && customerId) {
    await updateDoc(doc(db, "customers", customerId), {
      balance: increment(saleTotal)
    });
  }

  alert("تم حفظ الفاتورة وربطها بكل السيستم ✅");

  // Reset
  saleItems = [];
  saleTotal = 0;
  renderSale();
};

// 👇 مثال إضافة صنف
function addItem(product) {
  saleItems.push(product);
  saleTotal += product.price * product.qty;
  renderSale();
}

function renderSale() {
  document.getElementById("total").innerText = saleTotal;
}
