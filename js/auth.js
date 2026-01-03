function login() {
  const u = username.value;
  const p = password.value;

  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");
  const req = store.getAll();

  req.onsuccess = () => {
    const user = req.result.find(
      x => x.username === u && x.password === p
    );

    if (!user) {
      alert("بيانات غير صحيحة");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
      location.href = "../dashboard.html";
    } else {
      location.href = "agents.html";
    }
  };
}

function currentUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function login(){
  const u=username.value;
  const p=password.value;

  const reps=JSON.parse(localStorage.getItem("reps"))||[];
  const rep=reps.find(r=>r.username===u && r.password===p);

  if(!rep) return alert("بيانات غير صحيحة");

  localStorage.setItem("currentRep",JSON.stringify(rep));
  location.href="sales-rep.html";
}
