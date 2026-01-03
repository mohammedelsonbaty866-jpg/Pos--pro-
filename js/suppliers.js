// ============================
// عناصر الصفحة
// ============================
const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierCompany = document.getElementById("supplierCompany");
const addSupplierBtn = document.getElementById("addSupplierBtn");
const suppliersTable = document.getElementById("suppliersTable");

// ============================
// تحميل الموردين
// ============================
function loadSuppliers() {
  suppliersTable.innerHTML = "";

  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

  suppliers.forEach((s, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${s.name}</td>
      <td>${s.phone || "-"}</td>
      <td>${s.company || "-"}</td>
      <td>
        <button onclick="deleteSupplier(${index})">حذف</button>
      </td>
    `;

    suppliersTable.appendChild(tr);
  });
}

// ============================
// إضافة مورد
// ============================
addSupplierBtn.addEventListener("click", () => {
  if (!supplierName.value.trim()) {
    alert("اسم المورد مطلوب");
    return;
  }

  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

  suppliers.push({
    name: supplierName.value.trim(),
    phone: supplierPhone.value.trim(),
    company: supplierCompany.value.trim()
  });

  localStorage.setItem("suppliers", JSON.stringify(suppliers));

  supplierName.value = "";
  supplierPhone.value = "";
  supplierCompany.value = "";

  loadSuppliers();
});

// ============================
// حذف مورد
// ============================
window.deleteSupplier = function(index) {
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  suppliers.splice(index, 1);
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  loadSuppliers();
};

// ============================
// تحميل أولي
// ============================
loadSuppliers();
