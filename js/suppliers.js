/* ===== Helpers ===== */
function getData(key){
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setData(key,data){
  localStorage.setItem(key, JSON.stringify(data));
}

/* ===== تحميل ===== */
document.addEventListener("DOMContentLoaded", renderSuppliers);

/* ===== حفظ / تعديل مورد ===== */
function saveSupplier(){
  const id = supplierId.value;
  const name = supplierName.value.trim();
  if(!name){ alert("اسم المورد مطلوب"); return; }

  let suppliers = getData("suppliers");
  let balance = Number(supplierBalance.value || 0);

  if(id){
    let s = suppliers.find(x=>x.id==id);
    s.name = name;
    s.phone = supplierPhone.value;
    s.company = supplierCompany.value;
  } else {
    suppliers.push({
      id:Date.now(),
      name,
      phone:supplierPhone.value,
      company:supplierCompany.value,
      balance
    });

    addSupplierTransaction({
      supplierName:name,
      type:"opening",
      amount:balance
    });
  }

  setData("suppliers",suppliers);
  clearForm();
  renderSuppliers();
}

/* ===== عرض الموردين ===== */
function renderSuppliers(){
  let suppliers = getData("suppliers");
  suppliersTable.innerHTML = "";

  suppliers.forEach(s=>{
    suppliersTable.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.company||"-"}</td>
        <td>${s.phone||"-"}</td>
        <td>${s.balance.toFixed(2)}</td>
        <td class="actions">
          <button onclick="editSupplier(${s.id})">✏️</button>
          <button onclick="showSupplierStatement(${s.id})">📄</button>
          <button onclick="openPayModal(${s.id})">💰</button>
        </td>
      </tr>`;
  });
}

/* ===== تعديل ===== */
function editSupplier(id){
  let s = getData("suppliers").find(x=>x.id==id);
  supplierId.value=s.id;
  supplierName.value=s.name;
  supplierPhone.value=s.phone;
  supplierCompany.value=s.company;
  supplierBalance.value=s.balance;
}

/* ===== تنظيف ===== */
function clearForm(){
  supplierId.value="";
  supplierName.value="";
  supplierPhone.value="";
  supplierCompany.value="";
  supplierBalance.value="";
}

/* ===== حركات المورد ===== */
function addSupplierTransaction(tx){
  let arr = getData("supplierTransactions");
  arr.push({
    id:Date.now(),
    supplierName:tx.supplierName,
    type:tx.type,
    amount:tx.amount,
    date:new Date().toLocaleString()
  });
  setData("supplierTransactions",arr);
}

/* ===== كشف حساب ===== */
function showSupplierStatement(id){
  let s = getData("suppliers").find(x=>x.id==id);
  let txs = getData("supplierTransactions")
    .filter(t=>t.supplierName===s.name);

  let html=`<h3>كشف حساب: ${s.name}</h3>
  <table border="1" width="100%">
  <tr><th>التاريخ</th><th>البيان</th><th>مدين</th><th>دائن</th></tr>`;

  txs.forEach(t=>{
    html+=`<tr>
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>${t.type==="purchase"?t.amount:""}</td>
      <td>${t.type==="payment"?t.amount:""}</td>
    </tr>`;
  });

  html+="</table>";
  let w=window.open("","","width=600,height=500");
  w.document.write(html);
}

/* ===== دفع مورد ===== */
function openPayModal(id){
  paySupplierId.value=id;
  payAmount.value="";
  payModal.style.display="block";
}
function closePayModal(){
  payModal.style.display="none";
}
function confirmPaySupplier(){
  let id=Number(paySupplierId.value);
  let amount=Number(payAmount.value);
  if(amount<=0){alert("مبلغ غير صحيح");return;}

  let suppliers=getData("suppliers");
  let treasury=getData("treasury")||{balance:0};

  if(treasury.balance<amount){
    alert("رصيد الخزنة لا يكفي"); return;
  }

  let s=suppliers.find(x=>x.id===id);
  s.balance-=amount;
  treasury.balance-=amount;

  addSupplierTransaction({
    supplierName:s.name,
    type:"payment",
    amount
  });

  setData("suppliers",suppliers);
  setData("treasury",treasury);

  closePayModal();
  renderSuppliers();
  alert("تم الدفع بنجاح");
}

/* ===== ربط مع المشتريات ===== */
function onPurchaseSaved(purchase){
  let suppliers=getData("suppliers");
  let s=suppliers.find(x=>x.id===purchase.supplierId);
  let remain=purchase.total-purchase.paid;
  s.balance+=remain;

  addSupplierTransaction({
    supplierName:s.name,
    type:"purchase",
    amount:purchase.total
  });

  setData("suppliers",suppliers);
}
