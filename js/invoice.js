/*********************************
 * invoice.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  loadInvoice();
});

/*********************************
 * تحميل الفاتورة
 *********************************/
function loadInvoice() {
  const params = new URLSearchParams(window.location.search);
  const invoiceId = params.get("id");

  if (!invoiceId) {
    UI.showAlert("فاتورة غير موجودة", "error");
    return;
  }

  const invoice = POS_DB.getItem("invoices", invoiceId);
  if (!invoice) {
    UI.showAlert("فاتورة غير موجودة", "error");
    return;
  }

  renderInvoice(invoice);
}

/*********************************
 * عرض البيانات
 *********************************/
function renderInvoice(inv) {
  const customer =
    POS_DB.getItem("customers", inv.customerId) || {};

  setText("invNo", inv.number);
  setText("invDate", UI.formatDate(inv.date));
  setText("invCustomer", customer.name || "نقدي");
  setText(
    "invPayment",
    inv.paymentType === "cash" ? "نقدي" : "آجل"
  );
  setText("invTotal", UI.formatCurrency(inv.total));

  const tbody = document.getElementById("items");
  if (!tbody) return;

  tbody.innerHTML = "";

  inv.items.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${UI.formatCurrency(item.price)}</td>
      <td>${UI.formatCurrency(item.price * item.qty)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/*********************************
 * أدوات مساعدة
 *********************************/
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
