const table = document.getElementById("customersTable");

function loadCustomers() {
  table.innerHTML = "";
  db.transaction("customers", "readonly")
    .objectStore("customers")
    .getAll().onsuccess = e => {
      e.target.result.forEach(c => {
        table.innerHTML += `
          <tr>
            <td>${c.name}</td>
            <td>${c.phone || "-"}</td>
            <td>${(c.balance || 0).toFixed(2)}</td>
          </tr>
        `;
      });
    };
}

function addCustomer() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name) return alert("اسم العميل مطلوب");

  db.transaction("customers", "readwrite")
    .objectStore("customers")
    .add({
      name,
      phone,
      balance: 0
    });

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";

  loadCustomers();
}

setTimeout(loadCustomers, 500);
