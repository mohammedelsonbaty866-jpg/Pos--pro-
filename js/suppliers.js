/*********************************
 * suppliers.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  renderSuppliers();
});

/*********************************
 * إضافة مورد
 *********************************/
function addSupplier() {
  const name = document.getElementById("supName").value.trim();
  const phone = document.getElementById("supPhone").value.trim();
  const balance = Number(document.getElementById("supBalance").value) || 0;

  if (!name) {
    UI.showAlert("ادخل اسم المورد", "error");
    return;
  }

  POS_DB.addItem("suppliers", {
    name,
    phone,
    balance
  });

  UI.showAlert("تم إضافة المورد");

  document.getElementById("supName").value = "";
  document.getElementById("supPhone").value = "";
  document.getElementById("supBalance").value = 0;

  renderSuppliers();
}

/*********************************
 * حذف مورد
 *********************************/
function deleteSupplier(id) {
  if (!UI.confirmAction("تأكيد حذف المورد؟")) return;

  POS_DB.deleteItem("suppliers", id);
  UI.showAlert("تم حذف المورد");

  renderSuppliers();
}

/*********************************
 * عرض الموردين
 *********************************/
function renderSuppliers() {
  const suppliers = POS_DB.DB.suppliers;

  if (suppliers.length === 0) {
    UI.showEmpty("suppliersTable", 5);
    return;
  }

  const tbody = document.getElementById("suppliersTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  suppliers.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.phone || "-"}</td>
      <td>${UI.formatCurrency(s.balance)}</td>
      <td>
        <button data-action="delete-supplier" data-id="${s.id}">
          🗑
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
