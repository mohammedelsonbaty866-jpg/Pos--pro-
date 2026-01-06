import { db } from "./firebase-init.js";
import {
  collection, addDoc, getDocs,
  deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("productsTable");
const modal = document.getElementById("modal");
const importFile = document.getElementById("importFile");

let editId = null;

/* ===== تحميل ===== */
async function loadProducts(){
  table.innerHTML = "";
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(d=>{
    const p=d.data();
    table.innerHTML+=`
      <tr>
        <td>${p.name}</td>
        <td>${p.unit}</td>
        <td>${p.buy}</td>
        <td>${p.minSell}</td>
        <td>${p.maxSell}</td>
        <td>${p.qty}</td>
        <td>
          <button onclick="remove('${d.id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}
loadProducts();

/* ===== مودال ===== */
window.openModal=()=>modal.style.display="flex";
window.closeModal=()=>{modal.style.display="none";editId=null};

/* ===== حفظ ===== */
window.saveProduct=async()=>{
  const data={
    name:name.value,
    unit:unit.value,
    buy:+buy.value,
    minSell:+minSell.value,
    maxSell:+maxSell.value,
    qty:+qty.value,
    createdAt:new Date()
  };
  await addDoc(collection(db,"products"),data);
  closeModal(); loadProducts();
};

/* ===== حذف ===== */
window.remove=async(id)=>{
  if(confirm("حذف الصنف؟")){
    await deleteDoc(doc(db,"products",id));
    loadProducts();
  }
};

/* ===== تصدير Excel ===== */
window.exportExcel=async()=>{
  const snap=await getDocs(collection(db,"products"));
  const arr=[];
  snap.forEach(d=>{
    const p=d.data();
    arr.push({
      "اسم الصنف":p.name,
      "الوحدة":p.unit,
      "سعر الشراء":p.buy,
      "أدنى سعر بيع":p.minSell,
      "أقصى سعر بيع":p.maxSell,
      "الكمية":p.qty
    });
  });
  const ws=XLSX.utils.json_to_sheet(arr);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Products");
  XLSX.writeFile(wb,"products.xlsx");
};

/* ===== استيراد Excel ===== */
importFile.addEventListener("change",async(e)=>{
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=async(ev)=>{
    const wb=XLSX.read(ev.target.result,{type:"array"});
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for(const r of rows){
      await addDoc(collection(db,"products"),{
        name:r["اسم الصنف"],
        unit:r["الوحدة"],
        buy:+r["سعر الشراء"],
        minSell:+r["أدنى سعر بيع"],
        maxSell:+r["أقصى سعر بيع"],
        qty:+r["الكمية"],
        createdAt:new Date()
      });
    }
    loadProducts();
    alert("✔ تم الاستيراد");
  };
  reader.readAsArrayBuffer(file);
});
