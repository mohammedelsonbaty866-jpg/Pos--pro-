/*********************************
 * invoice.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  loadInvoice();
});

function loadInvoice() {
  const invoice = POS_DB.getLastSale();
  const settings = POS_DB.DB.settings || {};

  if (!invoice) return;

  // Store Info
  document.getElementById("storeName").textContent =
    settings.storeName || "POS PRO";

  document.getElementById("storePhone").textContent =
    settings.storePhone || "";

  if (settings.storeLogo) {
    const logo = document.getElementById("storeLogo");
    logo.src = settings.storeLogo;
    logo.style.display = "block";
  }

  // Invoice Info
  document.getElementById("invNo").textContent = invoice.id;
  document.getElementById("invDate").textContent = invoice.date;
  document.getElementById("invCustomer").textContent =
    invoice.customer || "نقدي";

  document.getElementById("invPayment").textContent =
    invoice.payment;

  document.getElementById("invTotal").textContent =
    UI.formatCurrency(invoice.total);

  // Items
  const tbody = document.getElementById("items");
  tbody.innerHTML = "";

  invoice.items.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${UI.formatCurrency(item.price)}</td>
      <td>${UI.formatCurrency(item.qty * item.price)}</td>
    `;
    tbody.appendChild(tr);
  });
}
