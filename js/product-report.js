const table = document.getElementById("reportTable");

function loadProductReport() {
  table.innerHTML = "";

  const salesMap = {};
  const purchaseMap = {};

  // قراءة المبيعات
  db.transaction("sales", "readonly")
    .objectStore("sales")
    .getAll().onsuccess = e => {
      e.target.result.forEach(s => {
        s.items.forEach(i => {
          if (!salesMap[i.id]) {
            salesMap[i.id] = { qty: 0, total: 0 };
          }
          salesMap[i.id].qty += i.qty;
          salesMap[i.id].total += i.qty * i.price;
        });
      });

      // قراءة المشتريات
      db.transaction("purchases", "readonly")
        .objectStore("purchases")
        .getAll().onsuccess = ev => {
          ev.target.result.forEach(p => {
            p.items.forEach(i => {
              if (!purchaseMap[i.id]) {
                purchaseMap[i.id] = { qty: 0, total: 0 };
              }
              purchaseMap[i.id].qty += i.qty;
              purchaseMap[i.id].total += i.qty * i.cost;
            });
          });

          // قراءة الأصناف
          db.transaction("products", "readonly")
            .objectStore("products")
            .getAll().onsuccess = res => {
              res.target.result.forEach(prod => {
                const sold = salesMap[prod.id] || { qty: 0, total: 0 };
                const bought = purchaseMap[prod.id] || { qty: 0, total: 0 };
                const profit = sold.total - bought.total;

                table.innerHTML += `
                  <tr>
                    <td>${prod.name}</td>
                    <td>${sold.qty}</td>
                    <td>${sold.total.toFixed(2)}</td>
                    <td>${bought.total.toFixed(2)}</td>
                    <td>${profit.toFixed(2)}</td>
                    <td>${prod.stock}</td>
                  </tr>
                `;
              });
            };
        };
    };
}
