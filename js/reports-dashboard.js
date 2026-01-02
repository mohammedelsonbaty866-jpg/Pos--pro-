const salesBody = document.querySelector("#salesTab tbody");
const purchasesBody = document.querySelector("#purchasesTab tbody");
const expensesBody = document.querySelector("#expensesTab tbody");

function showTab(tab) {
  ["sales","purchases","expenses"].forEach(t => {
    document.getElementById(t+"Tab").style.display =
      t === tab ? "table" : "none";
  });
}

function inRange(date, from, to) {
  const d = new Date(date);
  if (from && d < new Date(from)) return false;
  if (to && d > new Date(to)) return false;
  return true;
}

function loadReports() {
  const from = fromDate.value;
  const to = toDate.value;

  let salesTotal = 0, purchasesTotal = 0, expensesTotal = 0;

  salesBody.innerHTML = "";
  purchasesBody.innerHTML = "";
  expensesBody.innerHTML = "";

  // المبيعات
  db.transaction("sales","readonly")
    .objectStore("sales").getAll().onsuccess = e => {
      e.target.result.forEach(s => {
        if (inRange(s.date, from, to)) {
          salesTotal += s.total;
          salesBody.innerHTML += `
            <tr>
              <td>${s.date}</td>
              <td>${s.total}</td>
              <td>${s.payment}</td>
            </tr>`;
        }
      });
      document.getElementById("salesTotal").innerText = salesTotal.toFixed(2);
    };

  // المشتريات
  db.transaction("purchases","readonly")
    .objectStore("purchases").getAll().onsuccess = e => {
      e.target.result.forEach(p => {
        if (inRange(p.date, from, to)) {
          purchasesTotal += p.total;
          purchasesBody.innerHTML += `
            <tr>
              <td>${p.date}</td>
              <td>${p.total}</td>
              <td>${p.payment}</td>
            </tr>`;
        }
      });
      document.getElementById("purchasesTotal").innerText =
        purchasesTotal.toFixed(2);
    };

  // المصروفات
  db.transaction("expenses","readonly")
    .objectStore("expenses").getAll().onsuccess = e => {
      e.target.result.forEach(x => {
        if (inRange(x.date, from, to)) {
          expensesTotal += x.amount;
          expensesBody.innerHTML += `
            <tr>
              <td>${x.date}</td>
              <td>${x.amount}</td>
              <td>${x.note}</td>
            </tr>`;
        }
      });
      document.getElementById("expensesTotal").innerText =
        expensesTotal.toFixed(2);

      const net = salesTotal - purchasesTotal - expensesTotal;
      document.getElementById("netProfit").innerText = net.toFixed(2);
    };
}

setTimeout(loadReports, 500);
