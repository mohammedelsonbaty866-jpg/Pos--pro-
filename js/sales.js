document.addEventListener("DOMContentLoaded", () => {
  initSales();
});

let cart = [];
let selectedProduct = null;

function initSales() {
  document.getElementById("productSearch").addEventListener("input", searchProduct);
  document.getElementById("addItemBtn").addEventListener("click", addItem);
  document.getElementById("saveInvoiceBtn").addEventListener("click", saveInvoice);
  document.getElementById("printInvoiceBtn").addEventListener("click", printInvoice);

  document.getElementById("addCustomerBtn").addEventListener("click", openCustomerModal);
  document.getElementById("saveCustomerBtn").addEventListener("click", saveCustomer);

  loadCustomers();
}

// ---------- Products ----------
function searchProduct(e) {
  const term = e.target.value.toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  if (!term) return;

  const products = getProducts().filter(p =>
    p.name.toLowerCase().includes(term) ||
    String(p.barcode || "").includes(term)
  );

  products.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - ${p.price}`;
    li.onclick = () => {
      selectedProduct = p;
      document.getElementById("productSearch").value = p.name;
      results.innerHTML = "";
    };
    results.appendChild(li);
  });
}

function addItem() {
  if (!selectedProduct) {
    alert("اختر صنف أولًا");
    return;
  }

  const qty = parseInt(document.getElementById("qty").value);
  const existing = cart.find(i => i.id === selectedProduct.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      qty
    });
  }

  selectedProduct = null;
  document.getElementById("productSearch").value = "";
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cartItems");
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const sum = item.qty * item.price;
    total += sum;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${sum}</td>
      <td><button onclick="removeItem(${index})">X</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// ---------- Customers ----------
function loadCustomers() {
  const select = document.getElementById("customerSelect");
  select.innerHTML = `<option value="">عميل نقدي</option>`;

  getCustomers().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

function openCustomerModal() {
  document.getElementById("customerModal").style.display = "flex";
}

function closeCustomerModal() {
  document.getElementById("customerModal").style.display = "none";
  document.getElementById("newCustomerName").value = "";
}

function saveCustomer() {
  const name = document.getElementById("newCustomerName").value.trim();
  if (!name) {
    alert("اكتب اسم العميل");
    return;
  }

  addCustomer({ name });
  closeCustomerModal();
  loadCustomers();
}

// ---------- Save Invoice ----------
function saveInvoice() {
  if (cart.length === 0) {
    alert("الفاتورة فارغة");
    return;
  }

  const paymentType = document.getElementById("paymentType").value;
  const customerId = document.getElementById("customerSelect").value;

  if (paymentType === "credit" && !customerId) {
    alert("يجب اختيار عميل في حالة البيع الآجل");
    return;
  }

  saveSale({
    items: cart,
    customerId: customerId || null,
    paymentType,
    total: Number(document.getElementById("totalAmount").textContent)
  });

  cart = [];
  renderCart();
  alert("تم حفظ الفاتورة ✅");
}

// ---------- Print ----------
function printInvoice() {
  if (cart.length === 0) {
    alert("لا يوجد بيانات للطباعة");
    return;
  }

  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>فاتورة</title>
      <style>
        body {
          font-family: Arial;
          direction: rtl;
          width: 80mm;
        }
        h3 { text-align: center; }
        hr { border: 1px dashed #000; }
      </style>
    </head>
    <body>
      <h3>فاتورة بيع</h3>
      <hr>
  `;

  cart.forEach(i => {
    html += `
      <div>
        ${i.name} × ${i.qty}
        <span style="float:left">${i.qty * i.price}</span>
      </div>
    `;
  });

  html += `
      <hr>
      <strong>
        الإجمالي:
        <span style="float:left">
          ${document.getElementById("totalAmount").textContent}
        </span>
      </strong>
    </body>
    </html>
  `;

  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";

  document.body.appendChild(frame);

  frame.contentDocument.open();
  frame.contentDocument.write(html);
  frame.contentDocument.close();

  frame.onload = () => {
    frame.contentWindow.focus();
    frame.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(frame);
    }, 1000);
  };
}
