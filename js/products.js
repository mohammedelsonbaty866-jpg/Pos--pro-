/*********************************
 * products.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

/*********************************
 * إضافة صنف
 *********************************/
function addProduct() {
  const name = document.getElementById("prodName").value.trim();
  const price = Number(document.getElementById("prodPrice").value);
  const unit = document.getElementById("prodUnit").value;

  if (!name || price <= 0) {
    UI.showAlert("ادخل اسم وسعر صحيح", "error");
    return;
  }

  POS_DB.addItem("products", {
    name,
    price,
    unit
  });

  UI.showAlert("تم إضافة الصنف");

  document.getElementById("prodName").value = "";
  document.getElementById("prodPrice").value = "";

  renderProducts();
}

/*********************************
 * حذف صنف
 *********************************/
function deleteProduct(id) {
  if (!UI.confirmAction("تأكيد حذف الصنف؟")) return;

  POS_DB.deleteItem("products", id);
  UI.showAlert("تم حذف الصنف");

  renderProducts();
}

/*********************************
 * عرض الأصناف
 *********************************/
function renderProducts() {
  const products = POS_DB.DB.products;

  if (products.length === 0) {
    UI.showEmpty("productsTable", 5);
    return;
  }

  const tbody = document.getElementById("productsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  products.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.unit}</td>
      <td>${UI.formatCurrency(p.price)}</td>
      <td>
        <button data-action="delete-product" data-id="${p.id}">
          🗑
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
