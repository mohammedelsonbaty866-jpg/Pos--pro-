/*********************************
 * تحميل البيانات
 *********************************/
let products   = JSON.parse(localStorage.getItem("products"))   || [];
let stock      = JSON.parse(localStorage.getItem("stock"))      || [];
let customers  = JSON.parse(localStorage.getItem("customers"))  || [];
let sales      = JSON.parse(localStorage.getItem("sales"))      || [];
let reports    = JSON.parse(localStorage.getItem("reports"))    || [];

let saleItems = [];
let discount = 0;

/*********************************
 * عناصر الصفحة
 *********************************/
const customerInput   = document.getElementById("saleCustomer");
const saleTypeInput   = document.getElementById("saleType"); // نقدي / آجل
const productInput    = document.getElementById("saleProduct");
const qtyInput        = document.getElementById("saleQty");
const discountInput   = document.getElementById("saleDiscount");
const tableBody       = document.getElementById("saleTableBody");
const totalSpan       = document.getElementById("saleTotal");

/*********************************
 * تحميل العملاء في البحث
 *********************************/
function loadCustomers() {
  customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    customerInput.appendChild(opt);
  });
}

/*********************************
 * تحميل الأصناف في البحث
 *********************************/
function loadProducts() {
  productInput.innerHTML = "";
  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    productInput.appendChild(opt);
  });
}
// تحميل الأصناف
const items = JSON.parse(localStorage.getItem("items")) || [];

function searchItems(text) {
  const list = document.getElementById("itemsList");
  list.innerHTML = "";

  if (!text) return;

  const results = items.filter(i =>
    i.name.includes(text)
  );

  results.forEach(item => {
    const div = document.createElement("div");
    div.innerText = item.name;
    div.onclick = () => selectItem(item);
    list.appendChild(div);
  });
}

function selectItem(item) {
  document.getElementById("itemSearch").value = item.name;
  document.getElementById("price").value = item.price || 0;
  document.getElementById("itemsList").innerHTML = "";
}
/*********************************
 * إضافة صنف للفاتورة
 *********************************/
function addItem() {
  const name = itemSearch.value;
  const q = Number(qty.value);
  const p = Number(price.value);

  if (!name || q <= 0 || p <= 0)
    return alert("بيانات غير صحيحة");

  invoice.push({
    name,
    qty: q,
    price: p,
    total: q * p
  });

  render();
}

  const product = products.find(p => p.name === name);
  if (!product) {
    alert("الصنف غير موجود");
    return;
  }

  const stockItem = stock.find(s => s.name === name);
  if (!stockItem || stockItem.qty < qty) {
    alert("الكمية غير متوفرة في المخزون");
    return;
  }

  const total = qty * product.price;

  saleItems.push({
    name,
    unit: product.unit,
    qty,
    price: product.price,
    total
  });

  renderTable();
}

/*********************************
 * عرض الفاتورة
 *********************************/
function renderTable() {
  tableBody.innerHTML = "";
  let sum = 0;

  saleItems.forEach((item, index) => {
    sum += item.total;

    tableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.total}</td>
        <td>
          <button onclick="removeItem(${index})">❌</button>
        </td>
      </tr>
    `;
  });

  discount = Number(discountInput.value) || 0;
  sum -= discount;

  totalSpan.innerText = sum.toFixed(2);
}

/*********************************
 * حذف صنف
 *********************************/
function removeItem(index) {
  saleItems.splice(index, 1);
  renderTable();
}

/*********************************
 * حفظ الفاتورة
 *********************************/
function saveSale() {
  if (saleItems.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  const saleType = saleTypeInput.value;
  const customer = customerInput.value;

  if (saleType === "آجل" && !customer) {
    alert("اسم العميل إجباري في البيع الآجل");
    return;
  }

  const total = Number(totalSpan.innerText);

  const sale = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    type: saleType,
    customer: customer || "نقدي",
    items: saleItems,
    discount,
    total
  };

  /******** تحديث المخزون ********/
  saleItems.forEach(item => {
    const s = stock.find(x => x.name === item.name);
    s.qty -= item.qty;
  });

  /******** حفظ البيانات ********/
  sales.push(sale);
  reports.push({
    type: "sale",
    date: sale.date,
    total: sale.total
  });

  localStorage.setItem("sales", JSON.stringify(sales));
  localStorage.setItem("stock", JSON.stringify(stock));
  localStorage.setItem("reports", JSON.stringify(reports));

  alert("تم حفظ الفاتورة بنجاح");

  resetSale();
}

/*********************************
 * إعادة ضبط الشاشة
 *********************************/
function resetSale() {
  saleItems = [];
  discountInput.value = "";
  customerInput.value = "";
  qtyInput.value = 1;
  renderTable();
}

/*********************************
 * طباعة
 *********************************/
function printSale() {
  window.print();
}

/*********************************
 * تشغيل أولي
 *********************************/
loadCustomers();
loadProducts();
renderTable();
