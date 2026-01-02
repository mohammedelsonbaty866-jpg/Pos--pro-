function addUser(username, password, role) {
  const tx = db.transaction("users", "readwrite");
  tx.objectStore("users").add({
    username,
    password,
    role // admin | agent
  });

  alert("تم إضافة المستخدم");
}
