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

  const user = JSON.parse(localStorage.getItem("user"));

  db.transaction("sales", "readwrite")
    .objectStore("sales")
    .add({
      date: new Date().toLocaleString(),
      items: cart,
      total: grandTotal,
      payment: payment.value,
      agent: user?.username || "admin"
    });

  // تحديث المخزون
  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");

  cart.forEach(i => {
    store.get(i.id).onsuccess = e => {
      const p = e.target.result;
      p.stock -= i.qty;
      store.put(p);
    };
  });

  alert("تم حفظ الفاتورة");
  cart = [];
  renderCart();
}

// تحميل أولي
setTimeout(loadProducts, 500);
