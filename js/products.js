const table = document.getElementById("productsTable");

function loadProducts() {
  table.innerHTML = "";
  db.transaction("products", "readonly")
    .objectStore("products")
    .getAll().onsuccess = e => {
      e.target.result.forEach(p => {
        table.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.cost}</td>
            <td>${p.stock}</td>
            <td>${p.unit}</td>
            <td>
              <button onclick="deleteProduct(${p.id})">🗑️</button>
            </td>
          </tr>
        `;
      });
    };
}

function addProduct() {
  const product = {
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    cost: Number(document.getElementById("cost").value),
    stock: Number(document.getElementById("stock").value),
    unit: document.getElementById("unit").value
  };

  if (!product.name) return alert("اسم الصنف مطلوب");

  db.transaction("products", "readwrite")
    .objectStore("products")
    .add(product);

  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("unit").value = "قطعة";

  loadProducts();
}

function deleteProduct(id) {
  if (!confirm("حذف الصنف؟")) return;

  db.transaction("products", "readwrite")
    .objectStore("products")
    .delete(id);

  loadProducts();
}

setTimeout(loadProducts, 500);
