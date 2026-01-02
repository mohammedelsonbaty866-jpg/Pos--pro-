/*********************************
 * customers.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  renderCustomers();
});

/*********************************
 * إضافة عميل
 *********************************/
function addCustomer() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const balance = Number(document.getElementById("custBalance").value) || 0;

  if (!name) {
    UI.showAlert("ادخل اسم العميل", "error");
    return;
  }

  POS_DB.addItem("customers", {
    name,
    phone,
    balance
  });

  UI.showAlert("تم إضافة العميل");

  document.getElementById("custName").value = "";
  document.getElementById("custPhone").value = "";
  document.getElementById("custBalance").value = 0;

  renderCustomers();
}

/*********************************
 * حذف عميل
 *********************************/
function deleteCustomer(id) {
  if (!UI.confirmAction("تأكيد حذف العميل؟")) return;

  POS_DB.deleteItem("customers", id);
  UI.showAlert("تم حذف العميل");

  renderCustomers();
}

/*********************************
 * عرض العملاء
 *********************************/
function renderCustomers() {
  const customers = POS_DB.DB.customers;

  if (customers.length === 0) {
    UI.showEmpty("customersTable", 5);
    return;
  }

  const tbody = document.getElementById("customersTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  customers.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td>${c.phone || "-"}</td>
      <td>${UI.formatCurrency(c.balance)}</td>
      <td>
        <button data-action="delete-customer" data-id="${c.id}">
          🗑
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
