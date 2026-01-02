document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addCustomerBtn")
    .addEventListener("click", addCustomer);

  renderCustomers();
});

function addCustomer() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const company = document.getElementById("customerCompany").value.trim();

  if (!name) {
    alert("اسم العميل مطلوب");
    return;
  }

  const customers = getCustomers();

  customers.push({
    id: Date.now(),
    name: name,
    phone: phone,
    company: company
  });

  localStorage.setItem("pos_customers", JSON.stringify(customers));

  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerCompany").value = "";

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
  if (!confirm("حذف العميل؟")) return;

  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem("pos_customers", JSON.stringify(customers));
  renderCustomers();
}
