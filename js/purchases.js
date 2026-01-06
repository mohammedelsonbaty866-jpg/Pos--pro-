import { db } from "./firebase-init.js";
import {
 collection,addDoc,getDocs,deleteDoc,doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table=document.getElementById("table");
const modal=document.getElementById("modal");
const importExcel=document.getElementById("importExcel");

let cache=[];

/* باركود أرقام */
function genBarcode(){
  return Date.now().toString();
}

/* تحميل */
async function load(){
  table.innerHTML="";
  cache=[];
  const snap=await getDocs(collection(db,"products"));
  snap.forEach(d=>{
    const p=d.data();
    p.id=d.id;
    cache.push(p);
  });
  draw(cache);
}
load();

function draw(arr){
  table.innerHTML="";
  arr.forEach(p=>{
    table.innerHTML+=`
    <tr>
      <td>${p.barcode}</td>
      <td>${p.name}</td>
      <td>${p.unit}</td>
      <td>${p.buy}</td>
      <td>${p.minSell}</td>
      <td>${p.maxSell}</td>
      <td>${p.qty}</td>
      <td>
        <button onclick="remove('${p.id}')">🗑</button>
      </td>
    </tr>`;
  });
}

window.search=(v)=>{
  draw(cache.filter(p=>
    p.name.includes(v)||p.barcode.includes(v)
  ));
};

window.openModal=()=>{
  modal.style.display="flex";
  barcode.value=genBarcode();
};

window.closeModal=()=>modal.style.display="none";

window.save=async()=>{
  if(+minSell.value > +maxSell.value){
    alert("الحد الأدنى أكبر من الأقصى");
    return;
  }
  await addDoc(collection(db,"products"),{
    name:name.value,
    barcode:barcode.value,
    unit:unit.value,
    buy:+buy.value,
    minSell:+minSell.value,
    maxSell:+maxSell.value,
    qty:+qty.value,
    createdAt:new Date()
  });
  closeModal();
  load();
};

window.remove=async(id)=>{
  if(confirm("حذف الصنف؟")){
    await deleteDoc(doc(db,"products",id));
    load();
  }
};

/* Excel */
window.exportExcel=()=>{
  const ws=XLSX.utils.json_to_sheet(cache);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"products");
  XLSX.writeFile(wb,"products.xlsx");
};

importExcel.addEventListener("change",e=>{
  const r=new FileReader();
  r.onload=async ev=>{
    const wb=XLSX.read(ev.target.result,{type:"array"});
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for(const p of rows){
      await addDoc(collection(db,"products"),{
        ...p,
        createdAt:new Date()
      });
    }
    load();
    alert("✔ تم الاستيراد");
  };
  r.readAsArrayBuffer(e.target.files[0]);
});
