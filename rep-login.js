/* ===============================
   تحميل المندوبين
================================ */
// شكل التخزين في localStorage:
// reps = [
//   {id, name, username, password, active:true}
// ]

const reps = JSON.parse(localStorage.getItem("reps")) || [];

/* ===============================
   تسجيل الدخول
================================ */
function repLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("ادخل اسم المستخدم وكلمة المرور");
    return;
  }

  const rep = reps.find(r =>
    r.username === username &&
    r.password === password &&
    r.active !== false
  );

  if (!rep) {
    alert("بيانات الدخول غير صحيحة");
    return;
  }

  // حفظ المندوب الحالي
  localStorage.setItem("currentRep", rep.name);
  localStorage.setItem("currentRepId", rep.id);

  // تحويل لشاشة المندوب
  window.location.href = "rep-sales.html";
}

/* ===============================
   تسجيل الخروج
================================ */
function repLogout() {
  localStorage.removeItem("currentRep");
  localStorage.removeItem("currentRepId");
  window.location.href = "rep-login.html";
}

/* ===============================
   حماية الصفحات
================================ */
// تتحط في أعلى rep-sales.html
function protectRepPage() {
  const rep = localStorage.getItem("currentRep");
  if (!rep) {
    window.location.href = "rep-login.html";
  }
}
