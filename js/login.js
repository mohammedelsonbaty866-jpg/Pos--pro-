// =====================
// بيانات تجريبية (مؤقتًا)
// =====================
const products = [
  {
    id: "1",
    name: "سكر 1 كيلو",
    minPrice: 20,
    maxPrice: 30
  },
  {
    id: "2",
    name: "زيت 1 لتر",
    minPrice: 60,
    maxPrice: 75
  },
  {
    id: "3",
    name: "أرز 5 كيلو",
    minPrice: 120,
    maxPrice: 150
  }
];

// =====================
// عناصر DOM
// =====================
const productGrid = document.getElementById("productGrid");
const invoiceBody = document.getElementById("invoiceBody");
const subTotalEl = document.getElementById("subTotal");
const finalTotalEl = document.getElementById("finalTotal");
const discountEl = document.getElementById("discount");
const extraEl = document.getElementById("extra");

// =====================
// حالة الفاتورة
// =====================
let invoiceItems = [];

// =====================
// تحميل الأصناف
// =====================
function loadProducts() {
  productGrid.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h4>${p.name}</h4>
      <span>${p.minPrice} - ${p.maxPrice} ج</span>
    `;
    card.addEventListener("click", () => addToInvoice(p));
    productGrid.appendChild(card);
  });
}

// =====================
// إضافة للفاتورة
// =====================
function addToInvoice(product) {
  let item = invoiceItems.find(i => i.id === product.id);

  if (item) {
    item.qty++;
  } else {
    invoiceItems.push({
      ...product,
      qty: 1,
      price: product.minPrice
    });
  }

  renderInvoice();
}

// =====================
// رسم الفاتورة
// =====================
function renderInvoice() {
  invoiceBody.innerHTML = "";

  invoiceItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>

      <td class="qty-controls">
        <button data-action="minus">-</button>
        ${item.qty}
        <button data-action="plus">+</button>
      </td>

      <td>
        <input type="number" class="price-input"
          value="${item.price}"
          min="${item.minPrice}"
          max="${item.maxPrice}">
      </td>

      <td>
        <i class="fa-solid fa-trash remove-btn"></i>
      </td>
    `;

    // الكمية
    tr.querySelector('[data-action="plus"]').onclick = () => {
      item.qty++;
      renderInvoice();
    };

    tr.querySelector('[data-action="minus"]').onclick = () => {
      if (item.qty > 1) item.qty--;
      renderInvoice();
    };

    // السعر
    tr.querySelector(".price-input").onchange = (e) => {
      let val = Number(e.target.value);
      if (val < item.minPrice) val = item.minPrice;
      if (val > item.maxPrice) val = item.maxPrice;
      item.price = val;
      renderInvoice();
    };

    // حذف
    tr.querySelector(".remove-btn").onclick = () => {
      invoiceItems.splice(index, 1);
      renderInvoice();
    };

    invoiceBody.appendChild(tr);
  });

  calcTotals();
}

// =====================
// الحسابات
// =====================
function calcTotals() {
  let subTotal = invoiceItems.reduce(
    (sum, i) => sum + i.qty * i.price, 0
  );

  let discount = Number(discountEl.value) || 0;
  let extra = Number(extraEl.value) || 0;

  let finalTotal = subTotal - discount + extra;
  if (finalTotal < 0) finalTotal = 0;

  subTotalEl.textContent = subTotal.toFixed(2);
  finalTotalEl.textContent = finalTotal.toFixed(2);
}

// =====================
// Events
// =====================
discountEl.oninput = calcTotals;
extraEl.oninput = calcTotals;

// =====================
// تشغيل
// =====================
loadProducts();
