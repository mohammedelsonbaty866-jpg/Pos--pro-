// js/db.js
// ===============================
// Simple LocalStorage Database
// ===============================

const DB = {
  products: "pos_products",
  customers: "pos_customers",
  suppliers: "pos_suppliers",
  expenses: "pos_expenses",
  sales: "pos_sales",
  settings: "pos_settings",
  reps: "pos_reps"
};

// ---------- Helpers ----------
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now();
}

// ---------- Products ----------
function getProducts() {
  return getData(DB.products);
}

// ---------- Customers ----------
function getCustomers() {
  return getData(DB.customers);
}

function addCustomer(customer) {
  const customers = getCustomers();
  customers.push({ id: generateId(), ...customer });
  setData(DB.customers, customers);
}

// ---------- Suppliers ----------
function getSuppliers() {
  return getData(DB.suppliers);
}

function addSupplier(supplier) {
  const suppliers = getSuppliers();
  suppliers.push({ id: generateId(), ...supplier });
  setData(DB.suppliers, suppliers);
}

// ---------- Expenses ----------
function getExpenses() {
  return getData(DB.expenses);
}

function addExpense(expense) {
  const expenses = getExpenses();
  expenses.push({ id: generateId(), ...expense });
  setData(DB.expenses, expenses);
}

// ---------- Sales ----------
function getSales() {
  return getData(DB.sales);
}

function saveSale(sale) {
  const sales = getSales();
  sales.push({ id: generateId(), date: new Date().toISOString(), ...sale });
  setData(DB.sales, sales);
}

// ---------- Settings ----------
function getSettings() {
  return JSON.parse(localStorage.getItem(DB.settings)) || {};
}

function saveSettings(settings) {
  localStorage.setItem(DB.settings, JSON.stringify(settings));
}

// ---------- Representatives ----------
function getReps() {
  return getData(DB.reps);
}

function addRep(name) {
  const reps = getReps();
  reps.push({ id: generateId(), name });
  setData(DB.reps, reps);
}
