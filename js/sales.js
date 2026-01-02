// js/sales.js

let invoiceItems = [];
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadCustomersToSales();
  loadProductsToSales();

  document
    .getElementById("addToInvoiceBtn")
    .addEventListener("click", addToInvoice);

  document
    .getElementById("saveInvoiceBtn")
    .addEventListener("click", saveInvoice);

  document
    .getElementById("printInvoiceBtn")
    .addEventListener("click", printInvoice);
});

/* ================= العملاء ================= */

function loadCustomersToSales() {
  const select = document.getElementById("saleCustomer");
  const customers = getCustomers();

  select.innerHTML = `<option value="">عميل نقدي</option>`;

  customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

/* ================= الأصناف ================= */

function loadProductsToSales() {
  const select = document.getElementById("saleProduct");
  const products = getProducts();

  select.innerHTML = `<option value="">اختر الصنف</option>`;

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
}

/* ================= إضافة للفاتورة ================= */

function addToInvoice() {
  const productId = document.getElementById("saleProduct").value;
  const unit = document.getElementById("saleUnit").value;
  const qty = parseFloat(document.getElementById("saleQty").value);

  if (!productId || qty <= 0) {
    alert("اختار الصنف والكمية");
    return;
  }

  const product = getProducts().find(p => p.id == productId);
  if (!product) return;

  // ربط القياس بالسعر
  let price = 0;
  if (unit === "كجم") price = product.priceKg || product.price;
  if (unit === "علبة") price = product.priceBox || product.price;
  if (unit === "كرتونة") price = product.priceCarton || product.price;
  if (unit === "باكيت") price = product.pricePacket || product.price;

  const total = price * qty;

  invoiceItems.push({
    name: product.name,
    unit,
    qty,
    price,
    total
  });

  renderInvoice();
}

/* ================= عرض الفاتورة ================= */

function renderInvoice() {
  const tbody = document.getElementById("invoiceItems");
  tbody.innerHTML = "";
  totalAmount = 0;

  invoiceItems.forEach((item, index) => {
    totalAmount += item.total;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
      <td>
        <button onclick="removeItem(${index})">✖</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
}

function removeItem(index) {
  invoiceItems.splice(index, 1);
  renderInvoice();
}

/* ================= حفظ ================= */

function saveInvoice() {
  if (invoiceItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const customer =
    document.getElementById("saleCustomer").value || "عميل نقدي";
  const paymentType = document.getElementById("paymentType").value;

  const invoices = getInvoices();
  invoices.push({
    id: Date.now(),
    customer,
    paymentType,
    items: invoiceItems,
    total: totalAmount,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("pos_invoices", JSON.stringify(invoices));

  alert("تم حفظ الفاتورة");

  invoiceItems = [];
  renderInvoice();
}

/* ================= طباعة ================= */

function printInvoice() {
  const customer =
    document.getElementById("saleCustomer").value || "عميل نقدي";
  const paymentType = document.getElementById("paymentType").value;

  let html = `
    <h2>فاتورة بيع</h2>
    <p><strong>العميل:</strong> ${customer}</p>
    <p><strong>الدفع:</strong> ${paymentType}</p>
    <hr>
    <table border="1" width="100%">
      <tr>
        <th>الصنف</th>
        <th>القياس</th>
        <th>الكمية</th>
        <th>السعر</th>
        <th>الإجمالي</th>
      </tr>
  `;

  invoiceItems.forEach(i => {
    html += `
      <tr>
        <td>${i.name}</td>
        <td>${i.unit}</td>
        <td>${i.qty}</td>
        <td>${i.price}</td>
        <td>${i.total}</td>
      </tr>
    `;
  });

  html += `
    </table>
    <h3>الإجمالي: ${totalAmount}</h3>
  `;

  const w = window.open("", "", "width=400");
  w.document.write(html);
  w.print();
  w.close();
}
