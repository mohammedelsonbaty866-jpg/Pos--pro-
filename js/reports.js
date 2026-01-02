/*********************************
 * reports.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  loadReports();
});

/*********************************
 * تحميل التقارير
 *********************************/
function loadReports() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const sales = filterByDate(POS_DB.DB.sales || [], from, to);
  const expenses = filterByDate(POS_DB.DB.expenses || [], from, to);

  const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const profit = totalSales - totalExpenses;

  document.getElementById("repSales").textContent =
    UI.formatCurrency(totalSales);

  document.getElementById("repExpenses").textContent =
    UI.formatCurrency(totalExpenses);

  document.getElementById("repProfit").textContent =
    UI.formatCurrency(profit);

  renderProductsReport(sales);
}

/*********************************
 * تقرير الأصناف
 *********************************/
function renderProductsReport(sales) {
  const tbody = document.getElementById("productsReport");
  if (!tbody) return;

  const map = {};

  sales.forEach(sale => {
    (sale.items || []).forEach(item => {
      if (!map[item.name]) {
        map[item.name] = { qty: 0, total: 0 };
      }
      map[item.name].qty += item.qty;
      map[item.name].total += item.qty * item.price;
    });
  });

  tbody.innerHTML = "";

  const keys = Object.keys(map);
  if (keys.length === 0) {
    UI.showEmpty("productsReport", 3);
    return;
  }

  keys.forEach(name => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td>${map[name].qty}</td>
      <td>${UI.formatCurrency(map[name].total)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/*********************************
 * فلترة حسب التاريخ
 *********************************/
function filterByDate(arr, from, to) {
  return arr.filter(item => {
    if (!item.date) return true;
    if (from && item.date < from) return false;
    if (to && item.date > to) return false;
    return true;
  });
}
