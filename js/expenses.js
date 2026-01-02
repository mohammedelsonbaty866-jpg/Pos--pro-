/*********************************
 * expenses.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  renderExpenses();
});

/*********************************
 * إضافة مصروف
 *********************************/
function addExpense() {
  const title = document.getElementById("expTitle").value.trim();
  const amount = Number(document.getElementById("expAmount").value);
  const date = document.getElementById("expDate").value || new Date().toISOString().slice(0, 10);

  if (!title || amount <= 0) {
    UI.showAlert("ادخل بيان وقيمة صحيحة", "error");
    return;
  }

  POS_DB.addItem("expenses", {
    title,
    amount,
    date
  });

  UI.showAlert("تم إضافة المصروف");

  document.getElementById("expTitle").value = "";
  document.getElementById("expAmount").value = "";
  document.getElementById("expDate").value = "";

  renderExpenses();
}

/*********************************
 * حذف مصروف
 *********************************/
function deleteExpense(id) {
  if (!UI.confirmAction("تأكيد حذف المصروف؟")) return;

  POS_DB.deleteItem("expenses", id);
  UI.showAlert("تم حذف المصروف");

  renderExpenses();
}

/*********************************
 * عرض المصروفات
 *********************************/
function renderExpenses() {
  const expenses = POS_DB.DB.expenses;

  if (expenses.length === 0) {
    UI.showEmpty("expensesTable", 5);
    return;
  }

  const tbody = document.getElementById("expensesTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  expenses.forEach((e, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${e.title}</td>
      <td>${UI.formatCurrency(e.amount)}</td>
      <td>${e.date}</td>
      <td>
        <button data-action="delete-expense" data-id="${e.id}">
          🗑
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
