// ============================
// عناصر الصفحة
// ============================
const auditProduct = document.getElementById("auditProduct");
const auditUnit = document.getElementById("auditUnit");
const actualQty = document.getElementById("actualQty");
const auditBtn = document.getElementById("auditBtn");
const auditResult = document.getElementById("auditResult");

// ============================
// تحميل الأصناف (بحث سريع)
// ============================
function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    list.appendChild(opt);
  });
}

// ============================
// تنفيذ الجرد
// ============================
auditBtn.addEventListener("click", () => {
  const name = auditProduct.value.trim();
  const unit = auditUnit.value;
  const realQty = Number(actualQty.value);

  if (!name || realQty < 0) {
    alert("بيانات الجرد غير صحيحة");
    return;
  }

  let stock = JSON.parse(localStorage.getItem("stock")) || [];

  let record = stock.find(
    s => s.name === name && s.unit === unit
  );

  const systemQty = record ? record.qty : 0;
  const diff = realQty - systemQty;

  // تحديث أو إضافة المخزون
  if (!record) {
    record = { name, unit, qty: realQty };
    stock.push(record);
  } else {
    record.qty = realQty;
  }

  localStorage.setItem("stock", JSON.stringify(stock));

  // حفظ سجل الجرد
  const audits = JSON.parse(localStorage.getItem("stock_audits")) || [];
  audits.push({
    name,
    unit,
    systemQty,
    actualQty: realQty,
    diff,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("stock_audits", JSON.stringify(audits));

  // عرض النتيجة
  renderResult(name, unit, systemQty, realQty, diff);

  // تفريغ
  actualQty.value = "";
});

// ============================
// عرض نتيجة الجرد
// ============================
function renderResult(name, unit, systemQty, realQty, diff) {
  auditResult.innerHTML = `
    <tr>
      <td>${name}</td>
      <td>${unit}</td>
      <td>${systemQty}</td>
      <td>${realQty}</td>
      <td style="color:${diff === 0 ? 'green' : 'red'}">
        ${diff}
      </td>
    </tr>
  `;
}

// ============================
// تحميل أولي
// ============================
loadProducts();
