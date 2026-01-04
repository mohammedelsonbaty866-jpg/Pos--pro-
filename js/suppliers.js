/* ===============================
   Helpers
================================ */
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ===============================
   Load suppliers on page load
================================ */
document.addEventListener("DOMContentLoaded", renderSuppliers);

/* ===============================
   Save / Update Supplier
================================ */
function saveSupplier() {
  const id = document.getElementById("supplierId").value;
  const name = document.getElementById("supplierName").value.trim();
  const phone = document.getElementById("supplierPhone").value.trim();
  const company = document.getElementById("supplierCompany").value.trim();
  const balance = Number(document.getElementById("supplierBalance").value || 0);

  if (!name) {
    alert("اسم المورد مطلوب");
    return;
  }

  let suppliers = getData("suppliers");

  if (id) {
    // تعديل
    const supplier = suppliers.find(s => s.id == id);
    supplier.name = name;
    supplier.phone = phone;
    supplier.company = company;
  } else {
    // إضافة
    suppliers.push({
      id: Date.now(),
      name,
      phone,
      company,
      balance
    });

    // حركة افتتاحية
    addSupplierTransaction({
      supplierName: name,
      type: "opening",
      amount: balance
    });
  }

  setData("suppliers", suppliers);
  clearForm();
  renderSuppliers();
}

/* ===============================
   Render suppliers table
================================ */
function renderSuppliers() {
  const suppliers = getData("suppliers");
  const tbody = document.getElementById("suppliersTable");
  tbody.innerHTML = "";

  suppliers.forEach(s => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.company || "-"}</td>
      <td>${s.phone || "-"}</td>
      <td>${s.balance.toFixed(2)}</td>
      <td class="actions">
        <button onclick="editSupplier(${s.id})">✏️</button>
        <button onclick="showSupplierStatement(${s.id})">📄</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* ===============================
   Edit supplier
================================ */
function editSupplier(id) {
  const suppliers = getData("suppliers");
  const s = suppliers.find(x => x.id == id);

  document.getElementById("supplierId").value = s.id;
  document.getElementById("supplierName").value = s.name;
  document.getElementById("supplierPhone").value = s.phone;
  document.getElementById("supplierCompany").value = s.company;
  document.getElementById("supplierBalance").value = s.balance;
}

/* ===============================
   Clear form
================================ */
function clearForm() {
  document.getElementById("supplierId").value = "";
  document.getElementById("supplierName").value = "";
  document.getElementById("supplierPhone").value = "";
  document.getElementById("supplierCompany").value = "";
  document.getElementById("supplierBalance").value = "";
}

/* ===============================
   Supplier Transactions (GLOBAL)
================================ */
function addSupplierTransaction(tx) {
  let transactions = getData("supplierTransactions");

  transactions.push({
    id: Date.now(),
    supplierName: tx.supplierName,
    type: tx.type, // opening | purchase | payment | return
    amount: tx.amount,
    date: new Date().toLocaleString()
  });

  setData("supplierTransactions", transactions);
}

/* ===============================
   Show Supplier Statement
================================ */
function showSupplierStatement(supplierId) {
  const suppliers = getData("suppliers");
  const supplier = suppliers.find(s => s.id == supplierId);
  const transactions = getData("supplierTransactions")
    .filter(t => t.supplierName === supplier.name);

  let html = `
    <h3>كشف حساب المورد: ${supplier.name}</h3>
    <table border="1" width="100%" style="margin-top:10px">
      <tr>
        <th>التاريخ</th>
        <th>البيان</th>
        <th>مدين</th>
        <th>دائن</th>
      </tr>
  `;

  transactions.forEach(t => {
    html += `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.type === "purchase" ? t.amount : ""}</td>
        <td>${t.type === "payment" ? t.amount : ""}</td>
      </tr>
    `;
  });

  html += "</table>";
  const w = window.open("", "", "width=600,height=500");
  w.document.write(html);
}

/* ===============================
   🔗 ربط مع المشتريات
   (ينادى عليها من purchases.js)
================================ */
function onPurchaseSaved(purchase) {
  const suppliers = getData("suppliers");
  const supplier = suppliers.find(s => s.id == purchase.supplierId);

  const remain = purchase.total - purchase.paid;
  supplier.balance += remain;

  addSupplierTransaction({
    supplierName: supplier.name,
    type: "purchase",
    amount: purchase.total
  });

  setData("suppliers", suppliers);
}

/* ===============================
   🔗 ربط مع الخزنة
   (دفع لمورد)
================================ */
function paySupplier(supplierId, amount) {
  const suppliers = getData("suppliers");
  const treasury = getData("treasury");

  const supplier = suppliers.find(s => s.id == supplierId);
  supplier.balance -= amount;

  treasury.balance -= amount;

  addSupplierTransaction({
    supplierName: supplier.name,
    type: "payment",
    amount
  });

  setData("suppliers", suppliers);
  setData("treasury", treasury);
}

/* ===============================
   🔗 ربط مع التقارير
================================ */
function getSuppliersReport() {
  return getData("suppliers");
}
