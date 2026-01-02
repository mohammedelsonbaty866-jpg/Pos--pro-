let cart = [];
let grandTotal = 0;

// تحميل المنتجات
function loadProducts() {
  const keyword = search.value || "";
  const tx = db.transaction("products", "readonly");
  tx.objectStore("products").getAll().onsuccess = e => {
    products.innerHTML = "";
    e.target.result
      .filter(p => p.name.includes(keyword))
      .forEach(p => {
        products.innerHTML += `
          <button onclick="addToCart(${p.id})">
            ${p.name}<br>${p.price} ج
          </button>
        `;
      });
  };
}

// إضافة للسلة
function addToCart(id) {
  const tx = db.transaction("products", "readonly");
  tx.objectStore("products").get(id).onsuccess = e => {
    const p = e.target.result;
    const item = cart.find(i => i.id === id);

    if (item) {
      item.qty++;
    } else {
      cart.push({ ...p, qty: 1 });
    }
    renderCart();
  };
}

// عرض السلة
function renderCart() {
  cart.innerHTML = "";
  grandTotal = 0;

  cart.forEach(i => {
    const total = i.qty * i.price;
    grandTotal += total;

    cartEl.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${total}</td>
      </tr>
    `;
  });

  total.innerText = grandTotal;
}

// حفظ الفاتورة
function saveSale() {
  if (!cart.length) {
    alert("السلة فارغة");
    return;
  }

  const customerId = customerSelect.value
    ? Number(customerSelect.value)
    : null;

  const invoice = {
    date: new Date().toLocaleString(),
    customerId,
    total: grandTotal,
    payment: payment.value,
    items: cart
  };

  // حفظ الفاتورة
  db.transaction("sales", "readwrite")
    .objectStore("sales")
    .add(invoice);

  // تحديث المخزون
  const pTx = db.transaction("products", "readwrite");
  const pStore = pTx.objectStore("products");

  cart.forEach(i => {
    pStore.get(i.id).onsuccess = e => {
      const p = e.target.result;
      p.stock -= i.qty;
      pStore.put(p);
    };
  });

  // تحديث رصيد العميل لو آجل
  if (invoice.payment === "آجل" && customerId) {
    const cTx = db.transaction("customers", "readwrite");
    const cStore = cTx.objectStore("customers");

    cStore.get(customerId).onsuccess = e => {
      const customer = e.target.result;
      customer.balance = (customer.balance || 0) + grandTotal;
      cStore.put(customer);
    };
  }

  alert("تم حفظ الفاتورة");
  cart = [];
  renderCart();
}
  // 3️⃣ تخزين الفاتورة للطباعة
  localStorage.setItem("printInvoice", JSON.stringify(invoiceData));

  // 4️⃣ فتح الفاتورة الحرارية
  window.open("invoice-print.html", "_blank");

  // 5️⃣ تفريغ السلة
  cart = [];
  renderCart();
}
}
const customerSelect = document.getElementById("customerSelect");

function loadCustomers() {
  const tx = db.transaction("customers", "readonly");
  tx.objectStore("customers").getAll().onsuccess = e => {
    customerSelect.innerHTML = `<option value="">عميل نقدي</option>`;
    e.target.result.forEach(c => {
      customerSelect.innerHTML += `
        <option value="${c.id}">${c.name}</option>
      `;
    });
  };
}
// تحميل أولي
setTimeout(() => {
  loadCustomers();
  loadProducts();
}, 500);
