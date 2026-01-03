/*********************************
 *  ملف منطق الإعدادات settings.js
 *********************************/

/* ===============================
   بيانات المتجر
================================ */

function saveStore() {
  const store = {
    name: document.getElementById("storeName").value,
    phone: document.getElementById("storePhone").value
  };

  localStorage.setItem("store", JSON.stringify(store));
  alert("✅ تم حفظ بيانات المتجر");
}

(function loadStore() {
  const store = JSON.parse(localStorage.getItem("store"));
  if (!store) return;

  document.getElementById("storeName").value = store.name || "";
  document.getElementById("storePhone").value = store.phone || "";
})();

/* ===============================
   إدارة المناديب
================================ */

function togglePass() {
  const pass = document.getElementById("repPass");
  pass.type = pass.type === "password" ? "text" : "password";
}

function addRep() {
  const name = repName.value.trim();
  const user = repUser.value.trim();
  const pass = repPass.value.trim();

  if (!name || !user || !pass) {
    alert("❌ أدخل كل بيانات المندوب");
    return;
  }

  let reps = JSON.parse(localStorage.getItem("reps")) || [];

  if (reps.find(r => r.username === user)) {
    alert("❌ اسم المستخدم موجود بالفعل");
    return;
  }

  reps.push({
    id: Date.now(),
    name,
    username: user,
    password: pass
  });

  localStorage.setItem("reps", JSON.stringify(reps));
  alert("✅ تم إضافة المندوب");
}

function removeRep() {
  const user = repUser.value.trim();
  if (!user) {
    alert("❌ اكتب اسم المستخدم");
    return;
  }

  let reps = JSON.parse(localStorage.getItem("reps")) || [];
  reps = reps.filter(r => r.username !== user);

  localStorage.setItem("reps", JSON.stringify(reps));
  alert("🗑 تم حذف المندوب");
}

/* ===============================
   تسجيل الخروج
================================ */

function logout() {
  localStorage.removeItem("currentRep");
  location.href = "login.html";
}

/* ===============================
   تحميل Excel حقيقي
================================ */

function exportExcel() {
  if (typeof XLSX === "undefined") {
    alert("❌ مكتبة Excel غير محملة");
    return;
  }

  const wb = XLSX.utils.book_new();

  function addSheet(name, data) {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }

  addSheet("المبيعات", JSON.parse(localStorage.getItem("sales")) || []);
  addSheet("المشتريات", JSON.parse(localStorage.getItem("purchases")) || []);
  addSheet("العملاء", JSON.parse(localStorage.getItem("customers")) || []);
  addSheet("الموردين", JSON.parse(localStorage.getItem("suppliers")) || []);
  addSheet("الأصناف", JSON.parse(localStorage.getItem("items")) || []);
  addSheet("المخزون", JSON.parse(localStorage.getItem("stock")) || []);
  addSheet("المناديب", JSON.parse(localStorage.getItem("reps")) || []);

  XLSX.writeFile(wb, "system-data.xlsx");
}

/* ===============================
   إعدادات الطباعة
================================ */

// طباعة بلوتوث (موبايل / POS)
function printBluetooth() {
  window.print();
}

// PDF حقيقي
function printPDF(title = "تقرير") {
  const win = window.open("", "_blank");

  win.document.write(`
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body{font-family:Arial;padding:20px}
        h2{text-align:center}
      </style>
    </head>
    <body>
      <h2>${title}</h2>
      <p>التاريخ: ${new Date().toLocaleString()}</p>
      <script>
        window.print();
      <\/script>
    </body>
    </html>
  `);

  win.document.close();
}
