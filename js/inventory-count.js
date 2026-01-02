const tableBody = document.getElementById("inventoryTable");
let productsCache = [];

// تحميل الأصناف
function loadProducts() {
  tableBody.innerHTML = "";
  db.transaction("products", "readonly")
    .objectStore("products")
    .getAll().onsuccess = e => {
      productsCache = e.target.result;

      productsCache.forEach(p => {
        tableBody.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.stock}</td>
            <td>
              <input type="number" value="${p.stock}"
                     oninput="calcDiff(this, ${p.stock})">
            </td>
            <td class="diff">0</td>
          </tr>
        `;
      });
    };
}

// حساب الفرق
function calcDiff(input, stock) {
  const diffCell = input.closest("tr").querySelector(".diff");
  diffCell.innerText = input.value - stock;
}

// حفظ الجرد وتحديث المخزون
function saveInventoryCount() {
  const rows = tableBody.querySelectorAll("tr");
  const countDate = new Date().toLocaleString();

  rows.forEach((row, i) => {
    const actual = Number(row.querySelector("input").value);
    const systemStock = productsCache[i].stock;
    const diff = actual - systemStock;

    // حفظ حركة الجرد
    db.transaction("inventoryCounts", "readwrite")
      .objectStore("inventoryCounts")
      .add({
        productId: productsCache[i].id,
        date: countDate,
        systemStock,
        actualStock: actual,
        diff
      });

    // تحديث المخزون
    const tx = db.transaction("products", "readwrite");
    const store = tx.objectStore("products");
    const product = productsCache[i];
    product.stock = actual;
    store.put(product);
  });

  alert("تم حفظ الجرد وتحديث المخزون");
}
