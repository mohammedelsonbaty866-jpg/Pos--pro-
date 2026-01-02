const supplierSelect = document.getElementById("supplierSelect");
const productSelect = document.getElementById("productSelect");
const qtyInput = document.getElementById("purchaseQty");
const priceInput = document.getElementById("purchasePrice");
const paymentSelect = document.getElementById("purchasePayment");
const tableBody = document.getElementById("purchasesTable");

/* تحميل الموردين */
function loadSuppliers() {
  const tx = db.transaction("suppliers", "readonly");
  tx.objectStore("suppliers").getAll().onsuccess = e => {
    supplierSelect.innerHTML = "<option value=''>اختر المورد</option>";
    e.target.result.forEach(s => {
      supplierSelect.innerHTML += `
        <option value="${s.id}">${s.name}</option>
      `;
    });
  };
}

/* تحميل الأصناف */
function loadProducts() {
  const tx = db.transaction("products", "readonly");
  tx.objectStore("products").getAll().onsuccess = e => {
    productSelect.innerHTML = "<option value=''>اختر الصنف</option>";
    e.target.result.forEach(p => {
      productSelect.innerHTML += `
        <option value="${p.id}">${p.name}</option>
      `;
    });
  };
}

/* إضافة فاتورة شراء */
function addPurchase() {
  if (!supplierSelect.value || !productSelect.value)
    return alert("اختر المورد والصنف");

  const qty = Number(qtyInput.value);
  const price = Number(priceInput.value);
  const total = qty * price;

  const purchase = {
    supplierId: Number(supplierSelect.value),
    productId: Number(productSelect.value),
    qty,
    price,
    total,
    payment: paymentSelect.value,
    date: new Date().toLocaleDateString()
  };

  /* حفظ الفاتورة */
  db.transaction("purchases", "readwrite")
    .objectStore("purchases")
    .add(purchase);

  /* تحديث المخزون */
  const pTx = db.transaction("products", "readwrite");
  const pStore = pTx.objectStore("products");

  pStore.get(purchase.productId).onsuccess = e => {
    const product = e.target.result;
    product.stock = (product.stock || 0) + qty;
    pStore.put(product);
  };

  /* تحديث رصيد المورد لو آجل */
  if (purchase.payment === "آجل") {
    const sTx = db.transaction("suppliers", "readwrite");
    const sStore = sTx.objectStore("suppliers");

    sStore.get(purchase.supplierId).onsuccess = e => {
      const supplier = e.target.result;
      supplier.balance = (supplier.balance || 0) + total;
      sStore.put(supplier);
    };
  }

  alert("تم حفظ فاتورة الشراء");
  qtyInput.value = "";
  priceInput.value = "";

  setTimeout(loadPurchases, 300);
}

/* تحميل المشتريات */
function loadPurchases() {
  tableBody.innerHTML = "";
  db.transaction("purchases", "readonly")
    .objectStore("purchases")
    .getAll().onsuccess = e => {
      e.target.result.forEach(p => {
        tableBody.innerHTML += `
          <tr>
            <td>${p.date}</td>
            <td>${p.qty}</td>
            <td>${p.total}</td>
            <td>${p.payment}</td>
          </tr>
        `;
      });
    };
}

/* تحميل أولي */
setTimeout(() => {
  loadSuppliers();
  loadProducts();
  loadPurchases();
}, 500);
