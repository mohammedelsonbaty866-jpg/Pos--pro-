// ============================
// عناصر الصفحة
// ============================
const stockTable = document.getElementById("stockTable");

// ============================
// تحميل المخزون
// ============================
function loadStock() {
  stockTable.innerHTML = "";

  const stock = JSON.parse(localStorage.getItem("stock")) || [];

  if (stock.length === 0) {
    stockTable.innerHTML = `
      <tr>
        <td colspan="4">لا يوجد مخزون</td>
      </tr>
    `;
    return;
  }

  stock.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${item.qty}</td>
    `;

    stockTable.appendChild(tr);
  });
}

// ============================
// تحديث المخزون (دالة عامة)
// ============================
// type = sale | purchase | return_sale | return_purchase | audit
function updateStock(productName, unit, qty, type) {
  let stock = JSON.parse(localStorage.getItem("stock")) || [];

  let record = stock.find(
    s => s.name === productName && s.unit === unit
  );

  if (!record) {
    record = {
      name: productName,
      unit: unit,
      qty: 0
    };
    stock.push(record);
  }

  switch (type) {
    case "purchase":
    case "return_sale":
      record.qty += qty;
      break;

    case "sale":
    case "return_purchase":
      record.qty -= qty;
      if (record.qty < 0) record.qty = 0;
      break;

    case "audit":
      record.qty = qty;
      break;
  }

  localStorage.setItem("stock", JSON.stringify(stock));
}

// ============================
// تحميل أولي
// ============================
loadStock();
