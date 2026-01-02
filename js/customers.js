// js/customers.js

document.addEventListener("DOMContentLoaded", () => {
  initCustomers();
});

function initCustomers() {
  const addBtn = document.getElementById("addCustomerBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addCustomerHandler);
  }
  renderCustomers();
}

function addCustomerHandler() {
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const companyInput = document.getElementById("customerCompany");

  if (!nameInput) return;

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const company = companyInput.value.trim();

  if (!name) {
    alert("اسم العميل مطلوب");
    return;
  }

  addCustomer({
    name,
    phone,
    company
  });

  nameInput.value = "";
  phoneInput.value = "";
  companyInput.value = "";

  renderCustomers();
}

function renderCustomers() {
  const tbody = document.getElementById("customersTable");
  if (!tbody) return;

  tbody.innerHTML = "";
  const customers = getCustomers();

  customers.forEach((c, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.name || ""}</td>
      <td>${c.phone || ""}</td>
      <td>${c.company || ""}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function deleteCustomer(id) {
  if (!confirm("هل تريد حذف العميل؟")) return;

  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem("pos_customers", JSON.stringify(customers));
  renderCustomers();
}
