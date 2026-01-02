/*********************************
 * ui.js
 * User Interface Helpers
 *********************************/

/************* Alerts *************/
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `alert ${type}`;
  alert.textContent = message;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

/************* Tables *************/
function renderTable(tbodyId, rows, columns) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");

    columns.forEach(col => {
      const td = document.createElement("td");
      td.textContent =
        typeof col === "function" ? col(row, index) : row[col] ?? "";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

/************* Selects *************/
function fillSelect(selectId, items, valueKey, labelKey) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="">-- اختر --</option>`;

  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item[valueKey];
    opt.textContent = item[labelKey];
    select.appendChild(opt);
  });
}

/************* Format *************/
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ar-EG");
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("ar-EG", {
    minimumFractionDigits: 2
  });
}

/************* Confirm *************/
function confirmAction(message) {
  return window.confirm(message);
}

/************* Empty State *************/
function showEmpty(tbodyId, colspan, text = "لا توجد بيانات") {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="${colspan}" style="text-align:center;color:#999">
        ${text}
      </td>
    </tr>
  `;
}

/*********************************
 * كشف عام
 *********************************/
window.UI = {
  showAlert,
  renderTable,
  fillSelect,
  formatDate,
  formatCurrency,
  confirmAction,
  showEmpty
};
