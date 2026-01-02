let cart = [];
let total = 0;

// تحميل البيانات
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCustomers();
  loadReps();

  btnAddItem.addEventListener("click", addItem);
  btnSaveInvoice.addEventListener("click", saveInvoice);
  btnPrint.addEventListener("click", printInvoice);
});

// تحميل الأصناف
function loadProducts() {
  productSelect.innerHTML = "";
  db.transaction("products", "readonly")
    .objectStore("products")
    .getAll().onsuccess = e => {
      e.target.result.forEach(p => {
        productSelect.innerHTML += `
          <option value="${p.id}"
            data-price="${p.price}">
            ${p.name}
          </option>`;
      });
    };
}

// إضافة صنف
function addItem() {
  const opt = productSelect.selectedOptions[0];
  const qtyVal = Number(qty.value);

  if (!qtyVal) return alert("أدخل الكمية");

  const price = Number(opt.dataset.price);
  const item = {
    id: Number(opt.value),
    name: opt.text,
    price,
    qty: qtyVal,
    total: price * qtyVal
  };

  cart.push(item);
  renderInvoice();
  qty.value = "";
}

// رسم الفاتورة
function renderInvoice() {
  invoiceItems.innerHTML = "";
  total = 0;

  cart.forEach((i, index) => {
    total += i.total;
    invoiceItems.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.price}</td>
        <td>${i.qty}</td>
        <td>${i.total}</td>
        <td>
          <button class="btn btn-danger btn-icon"
            onclick="removeItem(${index})">🗑️</button>
        </td>
      </tr>`;
  });

  document.getElementById("total").innerText = total;
}

function removeItem(i) {
  cart.splice(i, 1);
  renderInvoice();
}
