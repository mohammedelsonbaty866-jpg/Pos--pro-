/* ===============================
   متغيرات أساسية
================================ */
let saleItems = [];
let total = 0;

// المندوب الحالي (من تسجيل الدخول)
const currentRep = localStorage.getItem("currentRep") || "مندوب";

// تحميل بيانات السيستم
let stock     = JSON.parse(localStorage.getItem("stock"))     || [];
let sales     = JSON.parse(localStorage.getItem("sales"))     || [];
let returns   = JSON.parse(localStorage.getItem("returns"))   || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

/* ===============================
   حماية صفحة المندوب
================================ */
function protectRepPage() {
  if (!localStorage.getItem("currentRep")) {
    window.location.href = "rep-login.html";
  }
}
protectRepPage();

/* ===============================
   بحث سريع عن صنف
================================ */
function searchItem(value) {
  if (!value) return;

  const item = stock.find(i =>
    i.name.toLowerCase().includes(value.toLowerCase())
  );

  if (item) {
    addItem(item);
    document.getElementById("search").value = "";
  }
}

/* ===============================
   إضافة صنف للفاتورة
================================ */
function addItem(item) {
  const exists = saleItems.find(i => i.name === item.name);

  if (exists) {
    exists.qty += 1;
  } else {
    saleItems.push({
      name: item.name,
      price: item.price,
      qty: 1
    });
  }
  renderItems();
}

/* ===============================
   رسم الفاتورة
================================ */
function renderItems() {
  const tbody = document.getElementById("rows");
  if (!tbody) return;

  tbody.innerHTML = "";
  total = 0;

  saleItems.forEach(i => {
    const lineTotal = i.qty * i.price;
    total += lineTotal;

    tbody.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.price}</td>
        <td>${lineTotal}</td>
      </tr>
    `;
  });

  document.getElementById("total").innerText = total.toFixed(2);
}

/* ===============================
   حفظ الفاتورة
================================ */
function saveSale() {
  const customerInput = document.getElementById("customer");
  const saleType = document.getElementById("saleType").value;
  const customer = customerInput.value || "نقدي";

  if (saleType === "credit" && !customerInput.value) {
    alert("اسم العميل مطلوب في البيع الآجل");
    return;
  }

  if (saleItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const sale = {
    id: Date.now(),
    rep: currentRep,
    customer,
    type: saleType,
    items: saleItems,
    total,
    date: new Date().toLocaleString()
  };

  // حفظ المبيعات
  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  // تحديث المخزون
  saleItems.forEach(i => {
    const s = stock.find(x => x.name === i.name);
    if (s) s.qty -= i.qty;
  });
  localStorage.setItem("stock", JSON.stringify(stock));

  alert("تم حفظ الفاتورة بنجاح");
  resetSale();
}

/* ===============================
   إعادة ضبط الفاتورة
================================ */
function resetSale() {
  saleItems = [];
  total = 0;
  renderItems();
  const c = document.getElementById("customer");
  if (c) c.value = "";
}

/* ===============================
   كشف حساب عميل (عرض فقط)
================================ */
function showStatement() {
  const customer = document.getElementById("customer").value;
  if (!customer) {
    alert("ادخل اسم العميل");
    return;
  }

  const salesTotal = sales
    .filter(s => s.customer === customer)
    .reduce((sum, s) => sum + s.total, 0);

  const returnsTotal = returns
    .filter(r => r.customer === customer)
    .reduce((sum, r) => sum + r.total, 0);

  const balance = salesTotal - returnsTotal;

  alert(
    `كشف حساب العميل: ${customer}\n` +
    `إجمالي المبيعات: ${salesTotal}\n` +
    `إجمالي المرتجعات: ${returnsTotal}\n` +
    `الرصيد: ${balance}`
  );
}

/* ===============================
   عمل مرتجع
================================ */
function makeReturn() {
  if (saleItems.length === 0) {
    alert("لا يوجد أصناف لعمل مرتجع");
    return;
  }

  const customer = document.getElementById("customer").value || "نقدي";

  const ret = {
    id: Date.now(),
    rep: currentRep,
    customer,
    items: saleItems,
    total,
    date: new Date().toLocaleString()
  };

  returns.push(ret);
  localStorage.setItem("returns", JSON.stringify(returns));

  // تحديث المخزون (رجوع)
  saleItems.forEach(i => {
    const s = stock.find(x => x.name === i.name);
    if (s) s.qty += i.qty;
  });
  localStorage.setItem("stock", JSON.stringify(stock));

  alert("تم تسجيل المرتجع");
  resetSale();
}

/* ===============================
   إضافة عميل جديد
================================ */
function addCustomer() {
  const name = prompt("اسم العميل");
  if (!name) return;

  customers.push({
    id: Date.now(),
    name,
    balance: 0
  });

  localStorage.setItem("customers", JSON.stringify(customers));
  document.getElementById("customer").value = name;
}

/* ===============================
   طباعة الفاتورة
================================ */
function printInvoice() {
  window.print();
}
