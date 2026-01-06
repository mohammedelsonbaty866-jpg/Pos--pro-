import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* عناصر */
const body = document.getElementById("productsBody");
const unitsDiv = document.getElementById("units");
const importInput = document.getElementById("importFile");

/* ===== Modal ===== */
window.openModal = () => {
  document.getElementById("productModal").style.display = "flex";
  unitsDiv.innerHTML = "";
};

window.closeModal = () => {
  document.getElementById("productModal").style.display = "none";
};

/* ===== Units ===== */
window.addUnit = () => {
  unitsDiv.innerHTML += `
    <div class="unit">
      <input placeholder="الوحدة">
      <input type="number" placeholder="سعر بيع">
      <input type="number" placeholder="أدنى">
      <input type="number" placeholder="أقصى">
    </div>`;
};

/* ===== Load Products ===== */
async function loadProducts() {
  body.innerHTML = "";
  const snap = await getDocs(collection(db, "products"));

  snap.forEach(d => {
    const p = d.data();
    body.innerHTML += `
    <tr>
      <td>${p.name}</td>
      <td>${p.barcode || "-"}</td>
      <td>${p.units?.map(u => u.name).join(" , ")}</td>
      <td>${p.buyPrice}</td>
      <td>${p.units?.[0]?.price || "-"}</td>
      <td>
        <button onclick="deleteProduct('${d.id}')">🗑</button>
      </td>
    </tr>`;
  });
}
loadProducts();

/* ===== Save ===== */
window.saveProduct = async () => {
  const units = [...document.querySelectorAll(".unit")].map(u => {
    const i = u.querySelectorAll("input");
    return {
      name: i[0].value,
      price: +i[1].value,
      min: +i[2].value,
      max: +i[3].value
    };
  });

  await addDoc(collection(db, "products"), {
    name: name.value,
    barcode: barcode.value,
    buyPrice: +buyPrice.value,
    units,
    createdAt: new Date()
  });

  closeModal();
  loadProducts();
};

/* ===== Delete ===== */
window.deleteProduct = async (id) => {
  if (confirm("تأكيد حذف الصنف؟")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};

/* ===== Excel Export ===== */
window.exportExcel = () => {
  const wb = XLSX.utils.table_to_book(document.querySelector("table"));
  XLSX.writeFile(wb, "products.xlsx");
};

/* ===== Excel Import ===== */
window.triggerImport = () => importInput.click();

importInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const data = new Uint8Array(evt.target.result);
    const wb = XLSX.read(data, { type: "array" });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    for (const r of rows) {
      await addDoc(collection(db, "products"), {
        name: r["اسم الصنف"],
        buyPrice: r["سعر الشراء"],
        units: [{
          name: "قطعة",
          price: r["سعر بيع أقصى"],
          min: r["سعر بيع أدنى"],
          max: r["سعر بيع أقصى"]
        }],
        stock: r["الكمية"] || 0
      });
    }

    loadProducts();
    alert("تم استيراد الأصناف بنجاح");
  };
  reader.readAsArrayBuffer(file);
});
