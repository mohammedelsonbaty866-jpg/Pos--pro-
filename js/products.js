// js/products.js

document.addEventListener("DOMContentLoaded", () => {
  initProducts();
});

function initProducts() {
  const btn = document.getElementById("addProductBtn");
  if (btn) btn.addEventListener("click", addProduct);

  renderProducts();
}

/* ========= إضافة صنف ========= */
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const priceKg = parseFloat(document.getElementById("priceKg").value) || 0;
  const priceBox = parseFloat(document.getElementById("priceBox").value) || 0;
  const priceCarton =
    parseFloat(document.getElementById("priceCarton").value) || 0;
  const pricePacket =
    parseFloat(document.getElementById("pricePacket").value) || 0;

  if (!name) {
    alert("اسم الصنف مطلوب");
    return;
  }

  const products = getProducts();

  products.push({
    id: Date.now(),
    name,
    priceKg,
    priceBox,
    priceCarton,
    pricePacket
  });

  localStorage.setItem("pos_products", JSON.stringify(products));

  clearProductInputs();
  renderProducts();
}

/* ========= عرض الأصناف ========= */
function renderProducts() {
  const tbody = document.getElementById("productsTable");
  if (!tbody) return;

  tbody.innerHTML = "";
  const products = getProducts();

  products.forEach((p, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.priceKg || ""}</td>
      <td>${p.priceBox || ""}</td>
      <td>${p.priceCarton || ""}</td>
      <td>${p.pricePacket || ""}</td>
      <td>
        <button onclick="deleteProduct(${p.id})">حذف</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* ========= حذف ========= */
function deleteProduct(id) {
  if (!confirm("حذف الصنف؟")) return;

  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem("pos_products", JSON.stringify(products));
  renderProducts();
}

/* ========= تنظيف الحقول ========= */
function clearProductInputs() {
  document.getElementById("productName").value = "";
  document.getElementById("priceKg").value = "";
  document.getElementById("priceBox").value = "";
  document.getElementById("priceCarton").value = "";
  document.getElementById("pricePacket").value = "";
}
