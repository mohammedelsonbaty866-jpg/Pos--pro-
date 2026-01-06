import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* Firebase */
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
const ref = collection(db,"products");

const body = document.getElementById("productsBody");
const search = document.getElementById("search");

let allProducts=[];

/* Load */
async function load(){
  body.innerHTML="";
  allProducts=[];
  const snap = await getDocs(ref);
  snap.forEach(d=>{
    allProducts.push({id:d.id,...d.data()});
  });
  render(allProducts);
}

/* Render */
function render(list){
  body.innerHTML="";
  list.forEach(p=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td><input value="${p.name}" onchange="update('${p.id}','name',this.value)"></td>
      <td><select onchange="update('${p.id}','unit',this.value)">
        <option ${p.unit=="قطعة"?"selected":""}>قطعة</option>
        <option ${p.unit=="علبة"?"selected":""}>علبة</option>
        <option ${p.unit=="كرتونة"?"selected":""}>كرتونة</option>
        <option ${p.unit=="كيلو"?"selected":""}>كيلو</option>
      </select></td>
      <td><input type="number" value="${p.buyPrice}" onchange="update('${p.id}','buyPrice',this.value)"></td>
      <td><input type="number" value="${p.minPrice}" onchange="update('${p.id}','minPrice',this.value)"></td>
      <td><input type="number" value="${p.maxPrice}" onchange="update('${p.id}','maxPrice',this.value)"></td>
      <td class="actions">
        <button onclick="remove('${p.id}')">حذف</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

/* Add */
window.addProduct=async()=>{
  const name=nameInput.value.trim();
  if(!name)return alert("اسم الصنف مطلوب");
  await addDoc(ref,{
    name,
    unit:unit.value,
    buyPrice:+buyPrice.value||0,
    minPrice:+minPrice.value||0,
    maxPrice:+maxPrice.value||0,
    createdAt:serverTimestamp()
  });
  document.querySelectorAll("input").forEach(i=>i.value="");
  load();
};

/* Update Inline */
window.update=async(id,field,val)=>{
  await updateDoc(doc(db,"products",id),{
    [field]:field.includes("Price")?+val:val
  });
};

/* Delete */
window.remove=async(id)=>{
  if(confirm("حذف الصنف؟")){
    await deleteDoc(doc(db,"products",id));
    load();
  }
};

/* Search */
search.oninput=()=>{
  const v=search.value.toLowerCase();
  render(allProducts.filter(p=>p.name.toLowerCase().includes(v)));
};

load();
/* =========================
   Excel Import
========================= */
window.importExcel = async () => {
  const fileInput = document.getElementById("excelFile");
  if (!fileInput.files.length) {
    alert("اختر ملف Excel");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const r of rows) {
      if (!r.name && !r["اسم الصنف"]) continue;

      await addDoc(ref, {
        name: r.name || r["اسم الصنف"],
        unit: r.unit || r["الوحدة"] || "قطعة",
        buyPrice: +r.buyPrice || +r["سعر الشراء"] || 0,
        minPrice: +r.minPrice || +r["أدنى بيع"] || 0,
        maxPrice: +r.maxPrice || +r["أقصى بيع"] || 0,
        createdAt: serverTimestamp()
      });
    }

    alert("✔ تم استيراد الأصناف بنجاح");
    load();
  };

  reader.readAsArrayBuffer(file);
};

/* =========================
   Excel Export
========================= */
window.exportExcel = () => {
  const data = allProducts.map(p => ({
    "اسم الصنف": p.name,
    "الوحدة": p.unit,
    "سعر الشراء": p.buyPrice,
    "أدنى بيع": p.minPrice,
    "أقصى بيع": p.maxPrice
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "الأصناف");

  XLSX.writeFile(wb, "products.xlsx");
};
