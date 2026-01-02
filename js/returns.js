function saveReturn() {
  const type = returnType.value;
  const quantity = Number(qty.value);
  const value = Number(amount.value);

  // 1️⃣ حفظ المرتجع
  const tx = db.transaction(
    ["returns", "products"],
    "readwrite"
  );

  tx.objectStore("returns").add({
    type,
    invoiceNo: invoiceNo.value,
    productName: productName.value,
    qty: quantity,
    amount: value,
    reason: reason.value,
    date: new Date().toLocaleString()
  });

  // 2️⃣ تحديث المخزون
  const productsStore = tx.objectStore("products");
  const req = productsStore.getAll();

  req.onsuccess = () => {
    const product = req.result.find(
      p => p.name === productName.value
    );

    if (!product) {
      alert("الصنف غير موجود");
      return;
    }

    // مرتجع بيع = زيادة مخزون
    // مرتجع شراء = خصم مخزون
    product.stock += type === "sale" ? quantity : -quantity;

    productsStore.put(product);

    result.innerHTML = `
      <p>✔ تم تسجيل المرتجع</p>
      <p>📦 المخزون الحالي: ${product.stock}</p>
    `;
  };
}
