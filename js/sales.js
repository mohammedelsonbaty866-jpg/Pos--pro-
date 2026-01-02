// js/sales.js

let invoiceItems = [];
let totalAmount = 0;
let currentPayment = "نقدي";

document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  loadProducts();

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

/* ============ العملاء (بحث سريع) ============ */
function loadCustomers() {
  const list = document.getElementById("customersList");
  list.innerHTML = "";

  getCustomers().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
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
    opt.dataset.id = p.id;
    list.appendChild(opt);
  });
}

/* ============ ربط وحدة القياس بالسعر ============ */
function getPriceByUnit(product, unit) {
  switch (unit) {
    case "كجم":
      return product.priceKg || product.price || 0;
    case "علبة":
      return product.priceBox || product.price || 0;
    case "كرتونة":
      return product.priceCarton || product.price || 0;
    case "باكيت":
      return product.pricePacket || product.price || 0;
    default:
      return product.price || 0;
  }
}

/* ============ إضافة للفاتورة ============ */
function addToInvoice() {
  const productName = document.getElementById("saleProduct").value.trim();
  const unit = document.getElementById("saleUnit").value;
  const qty = parseFloat(document.getElementById("saleQty").value);

  if (!productName || qty <= 0) {
    alert("اختار الصنف والكمية");
    return;
  }

  const product = getProducts().find(p => p.name === productName);
  if (!product) {
    alert("الصنف غير موجود");
    return;
  }

  const price = getPriceByUnit(product, unit);
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

/* ============ عرض الفاتورة ============ */
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

  document.getElementById("totalAmount").textContent =
    totalAmount.toFixed(2);
}

function removeItem(index) {
  invoiceItems.splice(index, 1);
  renderInvoice();
}

/* ============ حفظ الفاتورة ============ */
function saveInvoice() {
  if (invoiceItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const customer =
    document.getElementById("saleCustomer").value || "عميل نقدي";

  const invoices = getInvoices();
  invoices.push({
    id: Date.now(),
    customer,
    payment: currentPayment,
    items: invoiceItems,
    total: totalAmount,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("pos_invoices", JSON.stringify(invoices));

  alert("تم حفظ الفاتورة");

  invoiceItems = [];
  renderInvoice();
}

/* ============ طباعة ============ */
function printInvoice() {
  const customer =
    document.getElementById("saleCustomer").value || "عميل نقدي";

  let html = `
    <h2>فاتورة بيع</h2>
    <p><b>العميل:</b> ${customer}</p>
    <p><b>طريقة الدفع:</b> ${currentPayment}</p>
    <hr>
    <table border="1" width="100%">
      <tr>
        <th>الصنف</th>
        <th>الوحدة</th>
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

/* ============ نقدي / آجل ============ */
function setPayment(type) {
  currentPayment = type;
  document.getElementById("paymentType").textContent = type;
}
