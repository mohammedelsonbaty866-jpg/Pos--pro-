function loadInventory() {
  const tx = db.transaction("products", "readonly");
  const store = tx.objectStore("products");
  const req = store.getAll();

  req.onsuccess = () => {
    inventoryTable.innerHTML = "";
    req.result.forEach(p => {
      inventoryTable.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${p.stock}</td>
          <td>
            <input type="number" id="actual_${p.id}" value="${p.stock}">
          </td>
          <td id="diff_${p.id}">0</td>
          <td>
            <button onclick="confirmInventory(${p.id}, ${p.stock})">
              اعتماد
            </button>
          </td>
        </tr>
      `;
    });
  };
}

function confirmInventory(id, bookStock) {
  const actualStock = Number(
    document.getElementById(`actual_${id}`).value
  );

  const diff = actualStock - bookStock;
  document.getElementById(`diff_${id}`).innerText = diff;

  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");

  const req = store.get(id);
  req.onsuccess = () => {
    const product = req.result;
    product.stock = actualStock;
    product.lastInventory = new Date().toLocaleString();
    store.put(product);

    alert(
      diff === 0
        ? "✔ لا يوجد فرق"
        : diff > 0
        ? `📈 زيادة ${diff}`
        : `📉 عجز ${Math.abs(diff)}`
    );
  };
}

// تحميل تلقائي
setTimeout(loadInventory, 500);
