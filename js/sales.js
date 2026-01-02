function saveSale() {
  const tx = db.transaction("sales", "readwrite");
  tx.objectStore("sales").add({
    date: new Date().toLocaleDateString(),
    total: Number(total.value),
    payment: payment.value
  });
  alert("تم تسجيل البيع");
}
function saveSale() {
  const tx = db.transaction("sales", "readwrite");
  tx.objectStore("sales").add({
    invoiceNo: invoiceNo.value,
    customer: customer.value,
    payment: payment.value,
    total: Number(total.value),
    date: new Date().toLocaleString()
  });

  alert("تم حفظ الفاتورة");
}
function saveSale() {
  const user = JSON.parse(localStorage.getItem("user"));

  db.transaction("sales", "readwrite")
    .objectStore("sales")
    .add({
      total: Number(total.value),
      date: new Date().toLocaleString(),
      agent: user.username
    });

  alert("تم تسجيل البيع");
}
