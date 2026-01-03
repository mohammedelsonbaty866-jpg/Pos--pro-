/*************************
 *  منطق شاشة الأصناف
 *************************/

// ===== تحميل البيانات =====
let products = JSON.parse(localStorage.getItem("products")) || [];

// ===== عناصر الصفحة =====
const productNameInput = document.getElementById("prodName");
const unitSelect       = document.getElementById("prodUnit");
const priceInput       = document.getElementById("prodPrice");
const stockInput       = document.getElementById("prodStock");

const productsTable    = document.getElementById("productsTable");
const productsSearch   = document.getElementById("productSearch");

// ===========================
// حفظ أو تعديل صنف
// ===========================
function saveProduct() {
  const name  = productNameInput.value.trim();
  const unit  = unitSelect.value;
  const price = Number(priceInput.value);
  const stock = Number(stockInput.value);

  if (!name || price <= 0 || stock < 0)
    return alert("بيانات الصنف غير صحيحة");

  let product = products.find(p => p.name === name);

  if (!product) {
    product = {
      id: Date.now(),
      name,
      units: {}
    };
    products.push(product);
  }

  product.units[unit] = {
    price,
    stock
  };

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  clearForm();

  alert("تم حفظ الصنف");
}

// ===========================
// عرض الأصناف
// ===========================
function renderProducts(filter = "") {
  productsTable.innerHTML = "";

  products
    .filter(p => p.name.includes(filter))
    .forEach(p => {

      let unitsHtml = "";
      let stockHtml = "";

      for (let u in p.units) {
        unitsHtml += `${u}: ${p.units[u].price} <br>`;
        stockHtml += `${u}: ${p.units[u].stock} <br>`;
      }

      productsTable.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${unitsHtml}</td>
          <td>${stockHtml}</td>
          <td>
            <button onclick="editProduct(${p.id})">✏️</button>
            <button onclick="deleteProduct(${p.id})">🗑</button>
          </td>
        </tr>
      `;
    });
}
renderProducts();

// ===========================
// تعديل صنف
// ===========================
function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  productNameInput.value = product.name;

  const firstUnit = Object.keys(product.units)[0];
  unitSelect.value = firstUnit;
  priceInput.value = product.units[firstUnit].price;
  stockInput.value = product.units[firstUnit].stock;
}

// ===========================
// حذف صنف (مع حماية)
// ===========================
function deleteProduct(id) {
  const usedInSales =
    (JSON.parse(localStorage.getItem("sales")) || [])
      .some(s => s.items.some(i => {
        const p = products.find(pr => pr.id === id);
        return p && i.name === p.name;
      }));

  if (usedInSales)
    return alert("لا يمكن حذف الصنف لأنه مستخدم في مبيعات");

  if (!confirm("تأكيد حذف الصنف؟")) return;

  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// ===========================
// بحث سريع
// ===========================
if (productsSearch) {
  productsSearch.addEventListener("input", e => {
    renderProducts(e.target.value);
  });
}

// ===========================
// تنظيف النموذج
// ===========================
function clearForm() {
  productNameInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
}
