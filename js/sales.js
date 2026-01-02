function saveSale() {
  const tx = db.transaction("sales", "readwrite");
  tx.objectStore("sales").add({
    date: new Date().toLocaleDateString(),
    total: Number(total.value),
    payment: payment.value
  });
  alert("تم تسجيل البيع");
}
