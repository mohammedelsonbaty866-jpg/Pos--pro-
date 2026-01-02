const customerSelect = document.getElementById("customerSelect");
const tableBody = document.getElementById("statementTable");
const finalBalanceEl = document.getElementById("finalBalance");

// تحميل العملاء
function loadCustomers() {
  db.transaction("customers", "readonly")
    .objectStore("customers")
    .getAll().onsuccess = e => {
      customerSelect.innerHTML = "<option value=''>اختر عميل</option>";
      e.target.result.forEach(c => {
        customerSelect.innerHTML += `
          <option value="${c.id}">${c.name}</option>
        `;
      });
    };
}

function loadCustomerStatement() {
  if (!customerSelect.value) return;

  let balance = 0;
  tableBody.innerHTML = "";

  db.transaction("sales", "readonly")
    .objectStore("sales")
    .getAll().onsuccess = e => {
      e.target.result
        .filter(s => s.customerId == customerSelect.value && s.payment === "آجل")
        .forEach(s => {
          balance += Number(s.total);
          tableBody.innerHTML += `
            <tr>
              <td>${s.date}</td>
              <td>فاتورة بيع</td>
              <td>${s.total}</td>
              <td>0</td>
            </tr>
          `;
        });

      finalBalanceEl.innerText = balance.toFixed(2);
    };
}

setTimeout(loadCustomers, 500);
