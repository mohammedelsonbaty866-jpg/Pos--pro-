function login() {
  if (username.value && password.value) {
    location.href = "dashboard.html";
  } else {
    alert("ادخل البيانات");
  }
}
