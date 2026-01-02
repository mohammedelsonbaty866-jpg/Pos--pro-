// js/customers.js
document.addEventListener("DOMContentLoaded", () => {
  bindCustomersEvents();
  loadCustomers();
});

function bindCustomersEvents() {
  const addBtn = document.getElementById("addCustomerBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addCustomerHandler);
  }
}

function addCustomerHandler() {
  // الاسم ده من التصميم القديم
  const nameInput = document.getElementById("customerName");

  if (!nameInput) {
    alert("حقل اسم العميل غير موجود في الصفحة");
    return;
  }

  const name = nameInput.value.trim();
  if (!name) {
    alert("اكتب اسم العميل");
    return;
  }

  addCustomer({ name });
  nameInput.value = "";
  loadCustomers();
}

function loadCustomers() {
  const tableBody = document.getElementById("customersTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  const customers = getCustomers();

  customers.forEach((c, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">
          حذف
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function deleteCustomer(id) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;

  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem("pos_customers", JSON.stringify(customers));
  loadCustomers();
}
