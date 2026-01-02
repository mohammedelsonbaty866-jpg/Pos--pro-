const supplierSelect = document.getElementById("supplierSelect");
const tableBody = document.getElementById("supplierTable");
const finalBalanceEl = document.getElementById("supplierBalance");

// تحميل الموردين
function loadSuppliers() {
  db.transaction("suppliers", "readonly")
    .objectStore("suppliers")
    .getAll().onsuccess = e => {
      supplierSelect.innerHTML = "<option value=''>اختر مورد</option>";
      e.target.result.forEach(s => {
        supplierSelect.innerHTML += `
          <option value="${s.id}">${s.name}</option>
        `;
      });
    };
}

function loadSupplierStatement() {
  if (!supplierSelect.value) return;

  let balance = 0;
  tableBody.innerHTML = "";

  db.transaction("purchases", "readonly")
    .objectStore("purchases")
    .getAll().onsuccess = e => {
      e.target.result
        .filter(p => p.supplierId == supplierSelect.value && p.payment === "آجل")
        .forEach(p => {
          balance += Number(p.total);
          tableBody.innerHTML += `
            <tr>
              <td>${p.date}</td>
              <td>فاتورة شراء</td>
              <td>${p.total}</td>
              <td>0</td>
            </tr>
          `;
        });

      finalBalanceEl.innerText = balance.toFixed(2);
    };
}

setTimeout(loadSuppliers, 500);
