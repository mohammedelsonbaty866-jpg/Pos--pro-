const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user || user.role !== "rep") {
  alert("غير مصرح بالدخول");
  window.location.href = "rep-login.html";
}
