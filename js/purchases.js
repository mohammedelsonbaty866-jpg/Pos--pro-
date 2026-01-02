// js/purchases.js

let purchaseItems = [];
let purchaseTotal = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadSuppliers();
  loadProducts();

  document
    .getElementById("addToPurchaseBtn")
    .addEventListener("click", addToPurchase);

  document
    .getElementById("savePurchaseBtn")
    .addEventListener("click", savePurchase);
});

/* ============ الموردين (بحث سريع) ============ */
function loadSuppliers() {
  const list = document.getElementById("suppliersList");
  list.innerHTML = "";

  getSuppliers().forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    list.appendChild(opt);
  });
}

/* ============ الأصناف (بحث سريع) ============ */
function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  getProducts().forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    list.appendChild(opt);
  });
}

/* ============ إضافة للفاتورة ============ */
function addToPurchase() {
  const productName = document
    .getElementById("purchaseProduct")
    .value.trim();
  const unit = document.getElementById("purchaseUnit").value;
  const qty = parseFloat(document.getElementById("purchaseQty").value);
  const price = parseFloat(
    document.getElementById("purchasePrice").value
  );

  if (!productName || qty <= 0 || price <= 0) {
    alert("أدخل الصنف والكمية وسعر الشراء");
    return;
  }

  const total = qty * price;

  purchaseItems.push({
    name: productName,
    unit,
    qty,
    price,
    total
  });

  renderPurchase();
}

/* ============ عرض الفاتورة ============ */
function renderPurchase() {
  const tbody = document.getElementById("purchaseItems");
  tbody.innerHTML = "";
  purchaseTotal = 0;

  purchaseItems.forEach((item, index) => {
    purchaseTotal += item.total;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
      <td>
        <button onclick="removePurchaseItem(${index})">✖</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("purchaseTotal").textContent =
    purchaseTotal.toFixed(2);
}

function removePurchaseItem(index) {
  purchaseItems.splice(index, 1);
  renderPurchase();
}

/* ============ حفظ المشتريات ============ */
function savePurchase() {
  if (purchaseItems.length === 0) {
    alert("فاتورة المشتريات فاضية");
    return;
  }

  const supplier =
    document.getElementById("purchaseSupplier").value || "مورد غير محدد";

  const purchases = getPurchases();

  purchases.push({
    id: Date.now(),
    supplier,
    items: purchaseItems,
    total: purchaseTotal,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("pos_purchases", JSON.stringify(purchases));

  alert("تم حفظ فاتورة المشتريات");

  purchaseItems = [];
  renderPurchase();
}
