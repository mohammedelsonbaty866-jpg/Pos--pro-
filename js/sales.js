/*********************************
 * sales.js
 *********************************/

let cart = [];
let total = 0;

/*********************************
 * عند تحميل الصفحة
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
  initSales();
});

function initSales() {
  document.getElementById("invoiceNo").textContent =
    "فاتورة رقم: " + POS_DB.getNextInvoiceNumber();

  UI.fillSelect(
    "customerSelect",
    POS_DB.DB.customers,
    "id",
    "name"
  );

  UI.fillSelect(
    "productSelect",
    POS_DB.DB.products,
    "id",
    "name"
  );

  renderCart();
}

/*********************************
 * إضافة صنف
 *********************************/
function addToCart() {
  const productId = document.getElementById("productSelect").value;
  const qty = Number(document.getElementById("qty").value);

  if (!productId || qty <= 0) {
    UI.showAlert("اختر الصنف والكمية", "error");
    return;
  }

  const product = POS_DB.getItem("products", productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty
    });
  }

  renderCart();
}

/*********************************
 * حذف صنف
 *********************************/
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

/*********************************
 * عرض العربة
 *********************************/
function renderCart() {
  total = 0;

  const rows = cart.map((item, i) => {
    const rowTotal = item.price * item.qty;
    total += rowTotal;

    return {
      index: i + 1,
      name: item.name,
      qty: item.qty,
      price: UI.formatCurrency(item.price),
      total: UI.formatCurrency(rowTotal),
      delete: "حذف"
    };
  });

  const tbody = document.getElementById("cartItems");
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach((row, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.index}</td>
      <td>${row.name}</td>
      <td>${row.qty}</td>
      <td>${row.price}</td>
      <td>${row.total}</td>
      <td>
        <button onclick="removeFromCart('${cart[i].id}')">✖</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent =
    UI.formatCurrency(total);
}

/*********************************
 * حفظ الفاتورة
 *********************************/
function addItemToInvoice() {
  alert("إضافة للفاتورة شغالة ✅");
}

function saveInvoice() {
  alert("حفظ الفاتورة شغال ✅");
}
  if (cart.length === 0) {
    UI.showAlert("الفاتورة فارغة", "error");
    return;
  }

  const invoice = {
    id: POS_DB.generateId("INV"),
    number: POS_DB.getNextInvoiceNumber(),
    date: new Date().toISOString(),
    customerId: document.getElementById("customerSelect").value || null,
    paymentType: document.getElementById("paymentType").value,
    items: cart,
    total,
    status: "saved"
  };

  POS_DB.DB.invoices.push(invoice);
  POS_DB.commit();

  UI.showAlert("تم حفظ الفاتورة بنجاح");

  window.location.href = "invoice.html?id=" + invoice.id;
}
