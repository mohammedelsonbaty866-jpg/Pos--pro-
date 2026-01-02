function confirmDelete(msg, callback) {
  if (confirm(msg)) callback();
}
function deleteProduct(id) {
  confirmDelete("هل تريد حذف الصنف؟", () => {
    db.transaction("products", "readwrite")
      .objectStore("products")
      .delete(id);
    loadProducts();
  });
}
