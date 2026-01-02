document.addEventListener("DOMContentLoaded", () => {
  initSales();
});

let cart = [];
let selectedProduct = null;

function initSales() {
  document.getElementById("productSearch").addEventListener("input", searchProduct);
  document.getElementById("addItemBtn").addEventListener("click", addItem);
  document.getElementById("saveInvoiceBtn").addEventListener("click", saveInvoice);
}

function searchProduct(e) {
  const term = e.target.value.toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  if (!term) return;

  const products = getProducts().filter(p =>
    p.name.toLowerCase().includes(term) || String(p.barcode || "").includes(term)
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
    const tr = document.createElement("tr");
    const sum = item.qty * item.price;
    total += sum;

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

function saveInvoice() {
  if (cart.length === 0) {
    alert("الفاتورة فارغة");
    return;
  }

  saveSale({
    items: cart,
    total: document.getElementById("totalAmount").textContent
  });

  cart = [];
  renderCart();
  alert("تم حفظ الفاتورة ✅");
}
