const supName = document.getElementById("supName");
const supPhone = document.getElementById("supPhone");
const supBalance = document.getElementById("supBalance");
const supTable = document.getElementById("suppliersTable");

// إضافة مورد
function addSupplier() {
  if (!supName.value) return alert("اكتب اسم المورد");

  const tx = db.transaction("suppliers", "readwrite");
  tx.objectStore("suppliers").add({
    name: supName.value,
    phone: supPhone.value,
    balance: Number(supBalance.value || 0)
  });

  supName.value = "";
  supPhone.value = "";
  supBalance.value = "";

  setTimeout(loadSuppliers, 300);
}

// تحميل الموردين
function loadSuppliers() {
  supTable.innerHTML = "";
  const tx = db.transaction("suppliers", "readonly");
  tx.objectStore("suppliers").getAll().onsuccess = e => {
    e.target.result.forEach(s => {
      supTable.innerHTML += `
        <tr>
          <td>${s.name}</td>
          <td>${s.phone}</td>
          <td>${s.balance}</td>
        </tr>
      `;
    });
  };
}

setTimeout(loadSuppliers, 500);
