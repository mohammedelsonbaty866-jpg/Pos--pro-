/*********************************
 * تحميل البيانات
 *********************************/
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let sales     = JSON.parse(localStorage.getItem("sales")) || [];
let reports   = JSON.parse(localStorage.getItem("reports")) || [];

/*********************************
 * عناصر الصفحة
 *********************************/
const nameInput   = document.getElementById("customerName");
const phoneInput  = document.getElementById("customerPhone");
const notesInput  = document.getElementById("customerNotes");
const tableBody   = document.getElementById("customersTableBody");

/*********************************
 * حفظ العملاء
 *********************************/
function saveCustomers() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

/*********************************
 * إضافة عميل
 *********************************/
function addCustomer() {
  const name = nameInput.value.trim();

  if (!name) {
    alert("اسم العميل إجباري");
    return;
  }

  const exists = customers.find(c => c.name === name);
  if (exists) {
    alert("العميل موجود بالفعل");
    return;
  }

  const customer = {
    id: Date.now(),
    name,
    phone: phoneInput.value || "",
    notes: notesInput.value || "",
    balance: 0
  };

  customers.push(customer);
  saveCustomers();
  renderCustomers();
  clearForm();
}

/*********************************
 * عرض العملاء
 *********************************/
function renderCustomers() {
  tableBody.innerHTML = "";

  customers.forEach((c, index) => {
    tableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.balance.toFixed(2)}</td>
        <td>
          <button onclick="viewAccount(${c.id})">كشف حساب</button>
          <button onclick="deleteCustomer(${c.id})">حذف</button>
        </td>
      </tr>
    `;
  });
}

/*********************************
 * حذف عميل
 *********************************/
function deleteCustomer(id) {
  const hasSales = sales.some(s => s.customerId === id);
  if (hasSales) {
    alert("لا يمكن حذف عميل له معاملات");
    return;
  }

  if (!confirm("تأكيد الحذف؟")) return;

  customers = customers.filter(c => c.id !== id);
  saveCustomers();
  renderCustomers();
}

/*********************************
 * كشف حساب عميل
 *********************************/
function viewAccount(customerId) {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;

  const customerSales = sales.filter(
    s => s.customerId === customerId
  );

  let details = `كشف حساب: ${customer.name}\n\n`;

  let total = 0;
  customerSales.forEach(s => {
    details += `${s.date} | ${s.type} | ${s.total}\n`;
    total += s.total;
  });

  details += `\nالرصيد الحالي: ${customer.balance}`;

  alert(details);
}

/*********************************
 * تحديث رصيد العميل من المبيعات
 * (يستدعى من sales.js)
 *********************************/
function updateCustomerBalance(customerName, amount) {
  const customer = customers.find(c => c.name === customerName);
  if (!customer) return;

  customer.balance += amount;

  saveCustomers();
}

/*********************************
 * مسح الفورم
 *********************************/
function clearForm() {
  nameInput.value  = "";
  phoneInput.value = "";
  notesInput.value = "";
}

/*********************************
 * تشغيل أولي
 *********************************/
renderCustomers();
