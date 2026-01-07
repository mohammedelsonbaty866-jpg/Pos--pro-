import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== Firebase Config ===== */
const firebaseConfig = {
  apiKey: "AIzaSyBZwWxWIIE0exAPoL9P8pbmp19gnBFxQq0",
  authDomain: "pos-pro-996f0.firebaseapp.com",
  projectId: "pos-pro-996f0",
  storageBucket: "pos-pro-996f0.appspot.com",
  messagingSenderId: "591451935128",
  appId: "1:591451935128:web:683495139e62fb9b1e1bed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== DOM ===== */
const productsGrid = document.getElementById("productsGrid");
const searchInput  = document.getElementById("searchProduct");
const invoiceBody  = document.getElementById("invoiceBody");
const totalEl      = document.getElementById("total");
const saveBtn      = document.getElementById("saveSaleBtn");
const printBtn     = document.getElementById("printBtn");

const customerInput = document.getElementById("customerName");
const paymentType   = document.getElementById("paymentType");

/* ===== State ===== */
let products = [];
let cart = [];

/* ===== Load Products ===== */
async function loadProducts() {
  productsGrid.innerHTML = "";
  const snap = await getDocs(collection(db, "products"));

  products = [];
  snap.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });

  renderProducts(products);
}

/* ===== Render Products ===== */
function renderProducts(list) {
  productsGrid.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h4>${p.name}</h4>
      <span>${p.minPrice} - ${p.maxPrice}</span>
    `;
    div.onclick = () => addToCart(p);
    productsGrid.appendChild(div);
  });
}

/* ===== Search ===== */
searchInput.oninput = () => {
  const val = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(val)
  );
  renderProducts(filtered);
};

/* ===== Add To Cart ===== */
function addToCart(product) {
  const exist = cart.find(i => i.id === product.id);
  if (exist) {
    exist.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.minPrice,
      min: product.minPrice,
      max: product.maxPrice,
      qty: 1
    });
  }
  renderInvoice();
}

/* ===== Render Invoice ===== */
function renderInvoice() {
  invoiceBody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>
        <input type="number" min="${item.min}" max="${item.max}"
          value="${item.price}"
          onchange="updatePrice(${index}, this.value)">
      </td>
      <td>
        <input type="number" min="1" value="${item.qty}"
          onchange="updateQty(${index}, this.value)">
      </td>
      <td>${item.price * item.qty}</td>
      <td><button onclick="removeItem(${index})">✖</button></td>
    `;
    invoiceBody.appendChild(tr);
  });

  totalEl.textContent = total.toFixed(2);
}

/* ===== Global Functions ===== */
window.updatePrice = (i, val) => {
  val = +val;
  if (val < cart[i].min || val > cart[i].max) {
    alert("السعر خارج المسموح");
    return;
  }
  cart[i].price = val;
  renderInvoice();
};

window.updateQty = (i, val) => {
  cart[i].qty = +val;
  renderInvoice();
};

window.removeItem = (i) => {
  cart.splice(i, 1);
  renderInvoice();
};

/* ===== Save Sale ===== */
saveBtn.onclick = async () => {
  if (cart.length === 0) {
    alert("الفاتورة فاضية");
    return;
  }

  if (paymentType.value === "credit" && !customerInput.value) {
    alert("اسم العميل إجباري في البيع الآجل");
    return;
  }

  await addDoc(collection(db, "sales"), {
    customer: customerInput.value || "نقدي",
    paymentType: paymentType.value,
    items: cart,
    total: +totalEl.textContent,
    createdAt: Timestamp.now()
  });

  alert("تم حفظ الفاتورة");
  cart = [];
  renderInvoice();
};

/* ===== Print ===== */
printBtn.onclick = () => {
  window.print();
};

/* ===== Init ===== */
loadProducts();
