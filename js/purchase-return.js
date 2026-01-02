const supplierSelect = document.getElementById("supplier");

function loadSuppliers() {
  db.transaction("suppliers", "readonly")
    .objectStore("suppliers")
    .getAll().onsuccess = e => {
      supplierSelect.innerHTML = "<option value=''>اختر مورد</option>";
      e.target.result.forEach(s => {
        supplierSelect.innerHTML += `
          <option value="${s.id}">${s.name}</option>
        `;
      });
    };
}

function savePurchaseReturn() {
  const amount = Number(document.getElementById("amount").value);
  const supplierId = supplierSelect.value;
  const payment = document.getElementById("payment").value;

  if (!amount) return alert("أدخل قيمة المرتجع");

  const data = {
    date: new Date().toLocaleString(),
    supplierId,
    amount,
    payment
  };

  db.transaction("purchaseReturns", "readwrite")
    .objectStore("purchaseReturns")
    .add(data);

  // تحديث رصيد المورد
  if (payment === "آجل" && supplierId) {
    const tx = db.transaction("suppliers", "readwrite");
    tx.objectStore("suppliers").get(Number(supplierId)).onsuccess = e => {
      const s = e.target.result;
      s.balance -= amount;
      tx.objectStore("suppliers").put(s);
    };
  }

  alert("تم حفظ مرتجع الشراء");
}

setTimeout(loadSuppliers, 500);
