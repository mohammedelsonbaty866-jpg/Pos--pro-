// ============================
// عناصر الصفحة
// ============================
const returnType = document.getElementById("returnType");
const partyLabel = document.getElementById("partyLabel");
const partyName = document.getElementById("partyName");

const returnProduct = document.getElementById("returnProduct");
const returnUnit = document.getElementById("returnUnit");
const returnQty = document.getElementById("returnQty");
const returnPrice = document.getElementById("returnPrice");

const addReturnBtn = document.getElementById("addReturnBtn");
const returnItems = document.getElementById("returnItems");
const returnTotal = document.getElementById("returnTotal");
const saveReturnBtn = document.getElementById("saveReturnBtn");

// ============================
// بيانات مؤقتة
// ============================
let items = [];
let total = 0;

// ============================
// تحميل العملاء / الموردين
// ============================
function loadParties() {
  const list = document.getElementById("partyList");
  list.innerHTML = "";

  const key = returnType.value === "sale" ? "customers" : "suppliers";
  const data = JSON.parse(localStorage.getItem(key)) || [];

  data.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    list.appendChild(option);
  });
}

// ============================
// تحميل الأصناف
// ============================
function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    list.appendChild(option);
  });
}

// ============================
// تغيير نوع المرتجع
// ============================
returnType.addEventListener("change", () => {
  if (returnType.value === "sale") {
    partyLabel.textContent = "اسم العميل (بحث سريع)";
  } else {
    partyLabel.textContent = "اسم المورد (بحث سريع)";
  }
  partyName.value = "";
  loadParties();
});

// ============================
// إضافة صنف
// ============================
addReturnBtn.addEventListener("click", () => {
  const name = returnProduct.value;
  const unit = returnUnit.value;
  const qty = Number(returnQty.value);
  const price = Number(returnPrice.value);

  if (!name || qty <= 0 || price <= 0) {
    alert("تأكد من إدخال البيانات");
    return;
  }

  const subtotal = qty * price;

  items.push({ name, unit, qty, price, subtotal });
  total += subtotal;

  renderTable();
  clearInputs();
});

// ============================
// عرض الجدول
// ============================
function renderTable() {
  returnItems.innerHTML = "";

  items.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.subtotal}</td>
      <td><button onclick="removeItem(${index})">حذف</button></td>
    `;

    returnItems.appendChild(tr);
  });

  returnTotal.textContent = total;
}

// ============================
// حذف صنف
// ============================
window.removeItem = function(index) {
  total -= items[index].subtotal;
  items.splice(index, 1);
  renderTable();
};

// ============================
// مسح الحقول
// ============================
function clearInputs() {
  returnProduct.value = "";
  returnQty.value = 1;
  returnPrice.value = "";
}

// ============================
// حفظ المرتجع
// ============================
saveReturnBtn.addEventListener("click", () => {
  if (!partyName.value || items.length === 0) {
    alert("البيانات غير مكتملة");
    return;
  }

  const returns = JSON.parse(localStorage.getItem("returns")) || [];

  returns.push({
    type: returnType.value,
    party: partyName.value,
    items,
    total,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("returns", JSON.stringify(returns));

  alert("تم حفظ المرتجع بنجاح");

  // إعادة ضبط
  items = [];
  total = 0;
  renderTable();
  partyName.value = "";
});

// ============================
// تحميل أولي
// ============================
loadParties();
loadProducts();
