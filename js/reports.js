const salesTotalEl = document.getElementById("salesTotal");
const purchasesTotalEl = document.getElementById("purchasesTotal");
const profitTotalEl = document.getElementById("profitTotal");
const reportTable = document.getElementById("reportTable");

function loadProfitLoss() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  let salesTotal = 0;
  let purchasesTotal = 0;

  // المبيعات
  const salesTx = db.transaction("sales", "readonly");
  salesTx.objectStore("sales").getAll().onsuccess = e => {
    e.target.result.forEach(s => {
      if (checkDate(s.date, from, to)) {
        salesTotal += Number(s.total);
      }
    });

    // المشتريات
    const purTx = db.transaction("purchases", "readonly");
    purTx.objectStore("purchases").getAll().onsuccess = ev => {
      ev.target.result.forEach(p => {
        if (checkDate(p.date, from, to)) {
          purchasesTotal += Number(p.total);
        }
      });

      const profit = salesTotal - purchasesTotal;

      salesTotalEl.innerText = salesTotal.toFixed(2);
      purchasesTotalEl.innerText = purchasesTotal.toFixed(2);
      profitTotalEl.innerText = profit.toFixed(2);

      reportTable.innerHTML = `
        <tr>
          <td>${from || "بداية"} → ${to || "نهاية"}</td>
          <td>${salesTotal}</td>
          <td>${purchasesTotal}</td>
          <td>${profit}</td>
        </tr>
      `;
    };
  };
}

function checkDate(dateStr, from, to) {
  const d = new Date(dateStr);
  if (from && d < new Date(from)) return false;
  if (to && d > new Date(to)) return false;
  return true;
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
    };function agentSalesReport() {
  const user = JSON.parse(localStorage.getItem("user"));
  let total = 0;

  db.transaction("sales")
    .objectStore("sales")
    .getAll().onsuccess = e => {
      e.target.result
        .filter(s => s.agent === user.username)
        .forEach(s => total += s.total);

      reportResult.innerHTML =
        `<h3>مبيعاتك: ${total}</h3>`;
    };
}
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
