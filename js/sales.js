// ============================
// عناصر الصفحة
// ============================
const saleProduct = document.getElementById("saleProduct");
const saleUnit = document.getElementById("saleUnit");
const saleQty = document.getElementById("saleQty");
const salePrice = document.getElementById("salePrice");

const addSaleBtn = document.getElementById("addSaleBtn");
const saveSaleBtn = document.getElementById("saveSaleBtn");

const saleItemsTable = document.getElementById("saleItems");
const saleTotalEl = document.getElementById("saleTotal");

// ============================
// بيانات الفاتورة
// ============================
let saleItems = [];
let saleTotal = 0;

// ============================
// تحميل الأصناف (بحث سريع)
// ============================
function loadProducts() {
  const list = document.getElementById("productsList");
  if (!list) return;

  list.innerHTML = "";
  const products = JSON.parse(localStorage.getItem("products")) || [];

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    list.appendChild(opt);
  });
}

// ============================
// إضافة صنف للفاتورة
// ============================
addSaleBtn.addEventListener("click", () => {
  const name = saleProduct.value.trim();
  const unit = saleUnit.value;
  const qty = Number(saleQty.value);
  const price = Number(salePrice.value);

  if (!name || qty <= 0 || price <= 0) {
    alert("تأكد من إدخال بيانات الصنف");
    return;
  }

  const total = qty * price;

  saleItems.push({
    name,
    unit,
    qty,
    price,
    total
  });

  renderSale();
  clearInputs();
});

// ============================
// عرض الفاتورة
// ============================
function renderSale() {
  saleItemsTable.innerHTML = "";
  saleTotal = 0;

  saleItems.forEach((item, index) => {
    saleTotal += item.total;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
      <td>
        <button onclick="removeSaleItem(${index})">حذف</button>
      </td>
    `;
    saleItemsTable.appendChild(tr);
  });

  saleTotalEl.textContent = saleTotal.toFixed(2);
}

// ============================
// حذف صنف
// ============================
window.removeSaleItem = function(index) {
  saleItems.splice(index, 1);
  renderSale();
};

// ============================
// مسح الحقول
// ============================
function clearInputs() {
  saleProduct.value = "";
  saleQty.value = 1;
  salePrice.value = "";
}

// ============================
// حفظ الفاتورة + تحديث المخزون
// ============================
saveSaleBtn.addEventListener("click", () => {
  if (saleItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const customer =
    document.getElementById("saleCustomer")?.value || "نقدي";

  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  const saleData = {
    id: Date.now(),
    customer,
    items: saleItems,
    total: saleTotal,
    date: new Date().toLocaleString()
  };

  sales.push(saleData);
  localStorage.setItem("sales", JSON.stringify(sales));

  // 🔥 خصم من المخزون
  saleItems.forEach(item => {
    updateStock(
      item.name,
      item.unit,
      item.qty,
      "sale"
    );
  });

  alert("تم حفظ الفاتورة وتحديث المخزون");

  // إعادة ضبط
  saleItems = [];
  saleTotal = 0;
  renderSale();
});

// ============================
// تحميل أولي
// ============================
loadProducts();
