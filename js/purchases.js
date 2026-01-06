import { db } from "./firebase-init.js";
import {
 collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const body = document.getElementById("productsBody");
const unitsDiv = document.getElementById("units");

window.openModal = ()=>productModal.style.display="flex";
window.closeModal = ()=>productModal.style.display="none";

window.addUnit = ()=>{
  unitsDiv.innerHTML += `
  <div class="unit">
    <input placeholder="الوحدة">
    <input type="number" placeholder="سعر بيع">
    <input type="number" placeholder="أدنى">
    <input type="number" placeholder="أقصى">
  </div>`;
};

async function load(){
  body.innerHTML="";
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(d=>{
    const p=d.data();
    body.innerHTML+=`
<tr>
<td>${p.name}</td>
<td>${p.barcode}</td>
<td>${p.units.map(u=>u.name).join(" , ")}</td>
<td>${p.buyPrice}</td>
<td>${p.units[0]?.price}</td>
<td>
<button onclick="del('${d.id}')">🗑</button>
</td>
</tr>`;
  });
}
load();

window.saveProduct = async ()=>{
  const units=[...document.querySelectorAll(".unit")].map(u=>{
    const i=u.querySelectorAll("input");
    return {
      name:i[0].value,
      price:+i[1].value,
      min:+i[2].value,
      max:+i[3].value
    };
  });

  await addDoc(collection(db,"products"),{
    name:name.value,
    barcode:barcode.value,
    buyPrice:+buyPrice.value,
    units
  });
  closeModal();
  load();
};

window.del = async(id)=>{
  if(confirm("حذف الصنف؟")){
    await deleteDoc(doc(db,"products",id));
    load();
  }
};

// Excel
window.exportExcel=()=>{
  const wb=XLSX.utils.table_to_book(document.querySelector("table"));
  XLSX.writeFile(wb,"products.xlsx");
};

window.importExcel=(e)=>{
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=evt=>{
    const data=new Uint8Array(evt.target.result);
    const wb=XLSX.read(data,{type:"array"});
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    rows.forEach(r=>{
      addDoc(collection(db,"products"),r);
    });
    load();
  };
  reader.readAsArrayBuffer(file);
};
