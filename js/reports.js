function profitLoss(sales, purchases, expenses) {
  return sales - purchases - expenses;
}
function generateReport() {
  const type = reportType.value;
  reportResult.innerHTML = "جارٍ التحميل...";

  if (type === "profit") return profitLossReport();
  if (type === "products") return productsReport();

  salesReport(type);
}

// ================== تقارير المبيعات ==================

function salesReport(type) {
  const tx = db.transaction("sales", "readonly");
  const store = tx.objectStore("sales");
  const req = store.getAll();

  req.onsuccess = () => {
    let total = 0;
    let html = `<h3>تقرير المبيعات</h3><ul>`;

    req.result.forEach(s => {
      total += s.total;
      html += `<li>${s.date} - ${s.total} جنيه</li>`;
    });

    html += `</ul><strong>الإجمالي: ${total} جنيه</strong>`;
    reportResult.innerHTML = html;
  };
}

// ================== ربح وخسارة ==================

function profitLossReport() {
  let salesTotal = 0;
  let purchasesTotal = 0;
  let expensesTotal = 0;

  db.transaction("sales").objectStore("sales").getAll().onsuccess = e => {
    e.target.result.forEach(s => salesTotal += s.total);

    db.transaction("purchases").objectStore("purchases").getAll().onsuccess = p => {
      p.target.result.forEach(x => purchasesTotal += x.total);

      db.transaction("expenses").objectStore("expenses").getAll().onsuccess = ex => {
        ex.target.result.forEach(e => expensesTotal += e.amount);
db.transaction("returns").objectStore("returns").getAll()
.onsuccess = r => {
  r.target.result.forEach(ret => {
    if (ret.type === "sale") salesTotal -= ret.amount;
    if (ret.type === "purchase") purchasesTotal -= ret.amount;
  });
};
        const profit = salesTotal - purchasesTotal - expensesTotal;

        reportResult.innerHTML = `
          <h3>تقرير ربح وخسارة</h3>
          <p>المبيعات: ${salesTotal}</p>
          <p>المشتريات: ${purchasesTotal}</p>
          <p>المصروفات: ${expensesTotal}</p>
          <h4>صافي الربح: ${profit}</h4>
        `;
      };
    };
  };
}

// ================== تقرير الأصناف ==================

function productsReport() {
  const tx = db.transaction("products", "readonly");
  tx.objectStore("products").getAll().onsuccess = e => {
    let html = `<h3>تقرير الأصناف</h3><table border="1" width="100%">
      <tr><th>الصنف</th><th>الرصيد</th><th>سعر البيع</th></tr>`;

    e.target.result.forEach(p => {
      html += `<tr>
        <td>${p.name}</td>
        <td>${p.stock}</td>
        <td>${p.price}</td>
      </tr>`;
    });

    html += `</table>`;
    reportResult.innerHTML = html;
  };
}

// ================== PDF ==================

function generateReportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text("تقرير النظام", 80, 10);

  let y = 30;
  const lines = reportResult.innerText.split("\n");

  lines.forEach(line => {
    pdf.text(line, 10, y);
    y += 8;
  });

  pdf.save("report.pdf");
}
