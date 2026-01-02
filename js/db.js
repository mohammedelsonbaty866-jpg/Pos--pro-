/*********************************
 * db.js
 * Offline Database Layer
 *********************************/

// اسم التخزين
const STORAGE_KEY = "POS_PRO_DB_V1";

// الهيكل الافتراضي
const DEFAULT_DB = {
  meta: {
    version: "1.0",
    createdAt: new Date().toISOString()
  },

  settings: {
    storeName: "",
    storePhone: "",
    storeLogo: "",
    printType: "A4" // A4 | thermal
  },

  products: [],
  customers: [],
  suppliers: [],
  agents: [],

  invoices: [],
  purchases: [],
  returns: [],

  expenses: [],
  cashbox: [],

  inventoryLogs: []
};

/*********************************
 * تحميل / حفظ
 *********************************/
function loadDB() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveDB(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("DB Corrupted, Resetting...");
    saveDB(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// قاعدة البيانات في الذاكرة
let DB = loadDB();

/*********************************
 * أدوات عامة
 *********************************/
function generateId(prefix = "ID") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 5)
  );
}

function getNextInvoiceNumber() {
  const last = DB.invoices.at(-1);
  return last ? last.number + 1 : 1;
}

function commit() {
  saveDB(DB);
}

/*********************************
 * CRUD Helpers
 *********************************/
function addItem(collection, item) {
  item.id = item.id || generateId(collection.toUpperCase());
  DB[collection].push(item);
  commit();
  return item;
}

function updateItem(collection, id, data) {
  const index = DB[collection].findIndex(i => i.id === id);
  if (index === -1) return false;
  DB[collection][index] = { ...DB[collection][index], ...data };
  commit();
  return true;
}

function deleteItem(collection, id) {
  DB[collection] = DB[collection].filter(i => i.id !== id);
  commit();
}

function getItem(collection, id) {
  return DB[collection].find(i => i.id === id) || null;
}

/*********************************
 * كشف عام (Global Access)
 *********************************/
window.POS_DB = {
  get DB() {
    return DB;
  },
  set DB(val) {
    DB = val;
    commit();
  },

  addItem,
  updateItem,
  deleteItem,
  getItem,

  generateId,
  getNextInvoiceNumber,
  commit
};
