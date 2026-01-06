import { db } from "./firebase-init.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== عناصر ===== */
const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const modal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("productForm");
const tbody = document.querySelector("#productsTable tbody");

/* ===== ربط الأزرار ===== */
addBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalFn);
exportBtn.addEventListener("click", exportExcel);
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", importExcel);
form.addEventListener("submit", saveProduct);

/* ===== تحميل البيانات ===== */
loadProducts();

/* ===== الدوال ===== */
function openModal(p = null) {
  modal.style.display = "flex";
  form.reset();
  document.getElementById("pid").value = p?.id || "";
  if (p) {
    name.value = p.name;
    unit.value = p.unit;
    buy.value = p.buy;
    minSell.value = p.minSell;
    maxSell.value = p.maxSell;
    qty.value = p.qty;
  }
}

function closeModalFn() {
  modal.style.display = "none";
}

async function saveProduct(e) {
  e.preventDefault();
  const data = {
    name: name.value,
    unit: unit.value,
    buy: +buy.value,
    minSell: +minSell.value,
    maxSell: +maxSell.value,
    qty: +qty.value,
    updatedAt: new Date()
  };

  const id = pid.value;
  if (id) {
    await updateDoc(doc(db, "products", id), data);
  } else {
    data.createdAt = new Date();
    await addDoc(collection(db, "products"), data);
  }
  closeModalFn();
  loadProducts();
}

async function loadProducts() {
  tbody.innerHTML = "";
  const snap = await getDocs(collection(db, "products"));
  snap.forEach(d => {
    const p = { id: d.id, ...d.data() };
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.unit}</td>
      <td>${p.buy}</td>
      <td>${p.minSell}</td>
      <td>${p.maxSell}</td>
      <td>${p.qty}</td>
      <td>
        <button class="btn sm" data-edit="${p.id}">تعديل</button>
        <button class="btn sm danger" data-del="${p.id}">حذف</button>
      </td>`;
    tbody.appendChild(tr);

    tr.querySelector("[data-edit]").addEventListener("click", () => openModal(p));
    tr.querySelector("[data-del]").addEventListener("click", async () => {
      if (confirm("حذف الصنف؟")) {
        await deleteDoc(doc(db, "products", p.id));
        loadProducts();
      }
    });
  });
}

/* ===== Excel ===== */
function exportExcel() {
  alert("تصدير Excel (اربط SheetJS لو حابب)");
}
function importExcel() {
  alert("تم اختيار ملف Excel ✔");
}

/* ===== ربط POS =====
- السعر في POS لازم يكون بين minSell و maxSell
- الكمية تخصم مباشرة من qty
*/
