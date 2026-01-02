function addProduct() {
  const tx = db.transaction("products", "readwrite");
  tx.objectStore("products").add({
    name: name.value,
    price: Number(price.value),
    cost: Number(cost.value),
    unit: unit.value,
    packQty: Number(packQty.value),
    cartonQty: Number(cartonQty.value),
    stock: 0
  });
  alert("تم الحفظ");
}
