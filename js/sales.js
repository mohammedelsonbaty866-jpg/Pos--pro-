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

  const date = new Date().toLocaleString("ar-EG");

  let html = `
  <html dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>فاتورة</title>
    <style>
      body {
        font-family: Arial;
        font-size: 12px;
        margin: 0;
        padding: 10px;
      }
      h2 {
        text-align: center;
        margin: 5px 0;
      }
      .info {
        margin-bottom: 10px;
      }
      .info div {
        margin: 3px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 5px;
      }
      th, td {
        border: 1px solid #000;
        padding: 4px;
        text-align: center;
      }
      .total {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
      }
      .footer {
        margin-top: 15px;
        text-align: center;
        font-size: 11px;
      }
    </style>
  </head>

  <body>

    <h2>فاتورة بيع</h2>

    <div class="info">
      <div><b>العميل:</b> ${customer}</div>
      <div><b>طريقة الدفع:</b> ${currentPayment}</div>
      <div><b>التاريخ:</b> ${date}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>الصنف</th>
          <th>الوحدة</th>
          <th>الكمية</th>
          <th>السعر</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </table>

    <div class="total">
      الإجمالي: ${totalAmount.toFixed(2)}
    </div>

    <div class="footer">
      شكراً لتعاملكم معنا
    </div>

  </body>
  </html>
  `;

  const w = window.open("", "", "width=350");
  w.document.write(html);
  w.document.close();
  w.print();
  w.close();
}
/* ============ نقدي / آجل ============ */
function setPayment(type) {
  currentPayment = type;
  document.getElementById("paymentType").textContent = type;
}
