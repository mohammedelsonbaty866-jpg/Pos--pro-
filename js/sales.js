/***********************
 *  منطق شاشة المبيعات
 ***********************/

// ====== تحميل البيانات ======
let products   = JSON.parse(localStorage.getItem("products"))   || [];
let customers  = JSON.parse(localStorage.getItem("customers"))  || [];
let agents     = JSON.parse(localStorage.getItem("agents"))     || [];
let sales      = JSON.parse(localStorage.getItem("sales"))      || [];

let saleItems = [];
let saleTotal = 0;

// ====== عناصر الصفحة ======
const customerInput = document.getElementById("customerName");
const paymentType   = document.getElementById("paymentType");
const agentSelect   = document.getElementById("agentName");

const productInput  = document.getElementById("productName");
const unitSelect    = document.getElementById("unit");
const qtyInput      = document.getElementById("qty");

const invoiceBody   = document.getElementById("invoice");
const totalSpan     = document.getElementById("total");

// ============================
// تحميل المناديب
// ============================
function loadAgents() {
  agentSelect.innerHTML = "";
  agents.forEach(a => {
    agentSelect.innerHTML += `<option value="${a}">${a}</option>`;
  });
}
loadAgents();

// ============================
// تحميل الأصناف في البحث
// ============================
function loadProductsList() {
  const list = document.getElementById("productsList");
  list.innerHTML = "";
  products.forEach(p => {
    list.innerHTML += `<option value="${p.name}">`;
  });
}
loadProductsList();

// ============================
// عند اختيار صنف → تحميل الوحدات
// ============================
productInput.addEventListener("change", () => {
  const product = products.find(p => p.name === productInput.value);
  unitSelect.innerHTML = "";

  if (!product) return;

  Object.keys(product.units).forEach(u => {
    unitSelect.innerHTML += `<option value="${u}">${u}</option>`;
  });
});

// ============================
// إضافة صنف للفاتورة
// ============================
function addItem() {
  const product = products.find(p => p.name === productInput.value);
  if (!product) return alert("الصنف غير موجود");

  const unit = unitSelect.value;
  const qty  = Number(qtyInput.value);

  if (!unit || qty <= 0) return alert("بيانات غير صحيحة");

  if (product.units[unit].stock < qty)
    return alert("الكمية غير متوفرة في المخزون");

  saleItems.push({
    name: product.name,
    unit,
    qty,
    price: product.units[unit].price
  });

  renderInvoice();
}

// ============================
// رسم الفاتورة
// ============================
function renderInvoice() {
  invoiceBody.innerHTML = "";
  saleTotal = 0;

  saleItems.forEach((item, index) => {
    const rowTotal = item.qty * item.price;
    saleTotal += rowTotal;

    invoiceBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${rowTotal}</td>
        <td>
          <button onclick="removeItem(${index})">❌</button>
        </td>
      </tr>
    `;
  });

  totalSpan.innerText = saleTotal;
}

// ============================
// حذف صنف من الفاتورة
// ============================
function removeItem(index) {
  saleItems.splice(index, 1);
  renderInvoice();
}

// ============================
// حفظ الفاتورة
// ============================
function saveSale() {
  if (saleItems.length === 0)
    return alert("الفاتورة فاضية");

  if (paymentType.value === "credit" && !customerInput.value)
    return alert("اسم العميل مطلوب للبيع الآجل");

  // تحديث المخزون
  saleItems.forEach(item => {
    const product = products.find(p => p.name === item.name);
    product.units[item.unit].stock -= item.qty;
  });

  // حفظ العميل لو مش موجود
  if (paymentType.value === "credit") {
    const exists = customers.find(c => c.name === customerInput.value);
    if (!exists) {
      customers.push({
        id: Date.now(),
        name: customerInput.value,
        balance: saleTotal
      });
    } else {
      exists.balance += saleTotal;
    }
    localStorage.setItem("customers", JSON.stringify(customers));
  }

  // حفظ الفاتورة
  const saleData = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    customer: customerInput.value || "نقدي",
    payment: paymentType.value,
    agent: agentSelect.value,
    items: saleItems,
    total: saleTotal
  };

  sales.push(saleData);

  localStorage.setItem("sales", JSON.stringify(sales));
  localStorage.setItem("products", JSON.stringify(products));

  resetSale();
  alert("تم حفظ الفاتورة بنجاح");
}

// ============================
// إعادة ضبط الشاشة
// ============================
function resetSale() {
  saleItems = [];
  saleTotal = 0;
  customerInput.value = "";
  productInput.value = "";
  qtyInput.value = 1;
  invoiceBody.innerHTML = "";
  totalSpan.innerText = "0";
}

// ============================
// طباعة الفاتورة
// ============================
function printInvoice() {
  window.print();
}
