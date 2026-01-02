const customerSelect = document.getElementById("customer");

function loadCustomers() {
  db.transaction("customers", "readonly")
    .objectStore("customers")
    .getAll().onsuccess = e => {
      customerSelect.innerHTML = "<option value=''>اختر عميل</option>";
      e.target.result.forEach(c => {
        customerSelect.innerHTML += `
          <option value="${c.id}">${c.name}</option>
        `;
      });
    };
}

function saveSalesReturn() {
  const amount = Number(document.getElementById("amount").value);
  const customerId = customerSelect.value;
  const payment = document.getElementById("payment").value;

  if (!amount) return alert("أدخل قيمة المرتجع");

  const data = {
    date: new Date().toLocaleString(),
    customerId,
    amount,
    payment
  };

  // حفظ المرتجع
  db.transaction("salesReturns", "readwrite")
    .objectStore("salesReturns")
    .add(data);

  // تحديث رصيد العميل
  if (payment === "آجل" && customerId) {
    const tx = db.transaction("customers", "readwrite");
    tx.objectStore("customers").get(Number(customerId)).onsuccess = e => {
      const c = e.target.result;
      c.balance -= amount;
      tx.objectStore("customers").put(c);
    };
  }

  alert("تم حفظ مرتجع البيع");
}

setTimeout(loadCustomers, 500);
