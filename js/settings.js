/* ===== بيانات المتجر ===== */
function saveStore(){
  const store={
    name:storeName.value,
    phone:storePhone.value
  };
  localStorage.setItem("store",JSON.stringify(store));
  alert("تم حفظ بيانات المتجر");
}

(function loadStore(){
  const store=JSON.parse(localStorage.getItem("store"));
  if(store){
    storeName.value=store.name||"";
    storePhone.value=store.phone||"";
  }
})();

/* ===== تسجيل خروج ===== */
function logout(){
  localStorage.removeItem("currentRep");
  location.href="login.html";
}

/* ===== تغيير تسجيل الدخول ===== */
function changeLogin(){
  alert("تغيير بيانات الدخول يتم من شاشة الأدمن (قريبًا)");
}

/* ===== المناديب ===== */
function addRep(){
  let reps=JSON.parse(localStorage.getItem("reps"))||[];
  reps.push({
    id:Date.now(),
    name:repName.value,
    username:repUser.value,
    password:repPass.value
  });
  localStorage.setItem("reps",JSON.stringify(reps));
  alert("تم إضافة المندوب");
}

function removeRep(){
  let reps=JSON.parse(localStorage.getItem("reps"))||[];
  reps=reps.filter(r=>r.username!==repUser.value);
  localStorage.setItem("reps",JSON.stringify(reps));
  alert("تم حذف المندوب");
}

/* ===== تصدير البيانات ===== */
function exportExcel(){
  const data={
    sales:JSON.parse(localStorage.getItem("sales"))||[],
    purchases:JSON.parse(localStorage.getItem("purchases"))||[],
    customers:JSON.parse(localStorage.getItem("customers"))||[],
    suppliers:JSON.parse(localStorage.getItem("suppliers"))||[],
    items:JSON.parse(localStorage.getItem("items"))||[],
    stock:JSON.parse(localStorage.getItem("stock"))||{}
  };

  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="backup.json";
  a.click();
}
