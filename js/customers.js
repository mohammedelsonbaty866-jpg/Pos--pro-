const nameInput = document.getElementById("custName");
const phoneInput = document.getElementById("custPhone");
const balanceInput = document.getElementById("custBalance");
const tableBody = document.getElementById("customersTable");

// إضافة عميل
function addCustomer() {
  if (!nameInput.value) return alert("اكتب اسم العميل");

  const tx = db.transaction("customers", "readwrite");
  tx.objectStore("customers").add({
    name: nameInput.value,
    phone: phoneInput.value,
    balance: Number(balanceInput.value || 0)
  });

  nameInput.value = "";
  phoneInput.value = "";
  balanceInput.value = "";

  setTimeout(loadCustomers, 300);
}

// تحميل العملاء
function loadCustomers() {
  tableBody.innerHTML = "";
  const tx = db.transaction("customers", "readonly");
  tx.objectStore("customers").getAll().onsuccess = e => {
    e.target.result.forEach(c => {
      tableBody.innerHTML += `
        <tr>
          <td>${c.name}</td>
          <td>${c.phone}</td>
          <td>${c.balance}</td>
        </tr>
      `;
    });
  };
}

setTimeout(loadCustomers, 500);
