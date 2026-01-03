/* ===============================
   تحميل البيانات
================================ */
let items = JSON.parse(localStorage.getItem("items")) || [];
let stock = JSON.parse(localStorage.getItem("stock")) || {};

/* ===============================
   حفظ البيانات
================================ */
function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

function saveStock() {
  localStorage.setItem("stock", JSON.stringify(stock));
}

/* ===============================
   إضافة صنف جديد
================================ */
function addItem(name, buyPrice = 0, sellPrice = 0) {
  if (!name) return alert("اسم الصنف مطلوب");

  const exists = items.find(i => i.name === name);
  if (exists) return alert("الصنف موجود بالفعل");

  items.push({
    id: Date.now(),
    name,
    buyPrice: Number(buyPrice),
    price: Number(sellPrice)
  });

  stock[name] = stock[name] || 0;

  saveItems();
  saveStock();
}

/* ===============================
   تحديث سعر الصنف
================================ */
function updateItemPrice(name, buyPrice, sellPrice) {
  const item = items.find(i => i.name === name);
  if (!item) return;

  if (buyPrice !== undefined) item.buyPrice = Number(buyPrice);
  if (sellPrice !== undefined) item.price = Number(sellPrice);

  saveItems();
}

/* ===============================
   حذف صنف
================================ */
function deleteItem(name) {
  items = items.filter(i => i.name !== name);
  delete stock[name];

  saveItems();
  saveStock();
}

/* ===============================
   جلب كل الأصناف
================================ */
function getItems() {
  return items;
}

/* ===============================
   جلب صنف واحد
================================ */
function getItem(name) {
  return items.find(i => i.name === name);
}

/* ===============================
   تحديث المخزون
   type = "sale" | "purchase" | "adjust"
================================ */
function updateStock(itemName, qty, type) {
  stock[itemName] = stock[itemName] || 0;

  if (type === "sale") {
    if (stock[itemName] < qty) {
      alert(`المخزون غير كافي للصنف: ${itemName}`);
      throw new Error("Stock not enough");
    }
    stock[itemName] -= qty;
  }

  if (type === "purchase") {
    stock[itemName] += qty;
  }

  if (type === "adjust") {
    stock[itemName] = qty;
  }

  saveStock();
}

/* ===============================
   جلب كمية المخزون
================================ */
function getStock(itemName) {
  return stock[itemName] || 0;
}

/* ===============================
   ربط مع المشتريات
================================ */
function applyPurchase(itemsList) {
  itemsList.forEach(i => {
    let item = getItem(i.name);

    if (!item) {
      addItem(i.name, i.buy, i.sell);
      item = getItem(i.name);
    } else {
      updateItemPrice(i.name, i.buy, i.sell);
    }

    updateStock(i.name, i.qty, "purchase");
  });
}

/* ===============================
   ربط مع المبيعات
================================ */
function applySale(itemsList) {
  itemsList.forEach(i => {
    updateStock(i.name, i.qty, "sale");
  });
}

/* ===============================
   جرد المخزون
================================ */
function inventoryAudit(newStock) {
  Object.keys(newStock).forEach(name => {
    stock[name] = Number(newStock[name]);
  });
  saveStock();
}

/* ===============================
   تقارير مساعدة
================================ */
function getItemsReport() {
  return items.map(i => ({
    name: i.name,
    buyPrice: i.buyPrice,
    sellPrice: i.price,
    stock: getStock(i.name),
    stockValue: getStock(i.name) * i.buyPrice
  }));
}
