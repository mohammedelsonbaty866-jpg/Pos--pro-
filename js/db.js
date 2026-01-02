let db;
const request = indexedDB.open("POS_DB", 5);

request.onupgradeneeded = e => {
  db = e.target.result;
db.createObjectStore("returns", {
  keyPath: "id",
  autoIncrement: true
  db.createObjectStore("users", {
  keyPath: "id",
  autoIncrement: true
    request.onsuccess = e => {
  db = e.target.result;
if (!db.objectStoreNames.contains("salesReturns")) {
  db.createObjectStore("salesReturns", {
    keyPath: "id",
    autoIncrement: true
  });
}
if (!db.objectStoreNames.contains("inventoryCounts")) {
  db.createObjectStore("inventoryCounts", {
    keyPath: "id",
    autoIncrement: true
  });
}
if (!db.objectStoreNames.contains("purchaseReturns")) {
  db.createObjectStore("purchaseReturns", {
    keyPath: "id",
    autoIncrement: true
  });
}
      if (!db.objectStoreNames.contains("cashbox")) {
  db.createObjectStore("cashbox", {
    keyPath: "id",
    autoIncrement: true
  });
}

if (!db.objectStoreNames.contains("dayClose")) {
  db.createObjectStore("dayClose", {
    keyPath: "id",
    autoIncrement: true
  });
}
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");

  store.add({
    username: "admin",
    password: "1234",
    role: "admin"
  });
};
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
let db;

const request = indexedDB.open("POS_DB", 1);

request.onupgradeneeded = e => {
  db = e.target.result;

  // العملاء
  if (!db.objectStoreNames.contains("customers")) {
    db.createObjectStore("customers", {
      keyPath: "id",
      autoIncrement: true
    });
  }

  // الموردين
  if (!db.objectStoreNames.contains("suppliers")) {
    db.createObjectStore("suppliers", {
      keyPath: "id",
      autoIncrement: true
    });
  }
};

request.onsuccess = e => {
  db = e.target.result;
};

request.onerror = () => {
  alert("خطأ في فتح قاعدة البيانات");
};
// الأصناف
if (!db.objectStoreNames.contains("products")) {
  db.createObjectStore("products", {
    keyPath: "id",
    autoIncrement: true
  });
}

// المشتريات
if (!db.objectStoreNames.contains("purchases")) {
  db.createObjectStore("purchases", {
    keyPath: "id",
    autoIncrement: true
  });
}
// داخل onupgradeneeded لو مش موجود
if (!db.objectStoreNames.contains("sales")) {
  db.createObjectStore("sales", {
    keyPath: "id",
    autoIncrement: true
  });
}
