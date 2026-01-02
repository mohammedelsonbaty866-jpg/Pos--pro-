let db;
const request = indexedDB.open("POS_DB", 1);

request.onupgradeneeded = e => {
  db = e.target.result;
db.createObjectStore("returns", {
  keyPath: "id",
  autoIncrement: true
  db.createObjectStore("users", {
  keyPath: "id",
  autoIncrement: true
});
});
  db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("customers", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("suppliers", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("sales", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("purchases", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("agents", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = e => db = e.target.result;
db.createObjectStore("inventory_logs", {
  keyPath: "id",
  autoIncrement: true
});
db.transaction("inventory_logs","readwrite")
  .objectStore("inventory_logs")
  .add({
    productId: id,
    bookStock,
    actualStock,
    diff,
    date: new Date().toLocaleString()
  });
