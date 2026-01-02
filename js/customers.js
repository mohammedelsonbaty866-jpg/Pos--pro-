// js/customers.js

document.addEventListener("DOMContentLoaded", () => {
  initCustomers();
});

function initCustomers() {
  document
    .getElementById("addCustomerBtn")
    .addEventListener("click", addCustomerHandler);

  renderCustomers();
}

function addCustomerHandler() {
  const input = document.getElementById("customerName");
  const name = input.value.trim();

  if (!name) {
    alert("اكتب اسم العميل");
    return;
  }

  addCustomer({ name });
  input.value = "";
  renderCustomers();
}

function renderCustomers() {
  const tbody = document.getElementById("customersTable");
  tbody.innerHTML = "";

  const customers = getCustomers();

  customers.forEach((c, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>
        <button onclick="deleteCustomer(${c.id})">حذف</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function deleteCustomer(id) {
  if (!confirm("حذف العميل؟")) return;

  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem("pos_customers", JSON.stringify(customers));
  renderCustomers();
}
