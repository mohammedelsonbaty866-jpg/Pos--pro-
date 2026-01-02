const balanceEl = document.getElementById("cashBalance");

// حساب الرصيد
function loadBalance() {
  let balance = 0;

  db.transaction("cashbox", "readonly")
    .objectStore("cashbox")
    .getAll().onsuccess = e => {
      e.target.result.forEach(c => {
        balance += c.type === "in" ? c.amount : -c.amount;
      });
      balanceEl.innerText = balance.toFixed(2);
    };
}

function saveCash() {
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const note = document.getElementById("note").value;

  if (!amount) return alert("أدخل مبلغ");

  db.transaction("cashbox", "readwrite")
    .objectStore("cashbox")
    .add({
      date: new Date().toLocaleString(),
      amount,
      type,
      note
    });

  alert("تم تسجيل الحركة");
  loadBalance();
}

// إغلاق اليوم
function closeDay() {
  let balance = Number(balanceEl.innerText);

  db.transaction("dayClose", "readwrite")
    .objectStore("dayClose")
    .add({
      date: new Date().toLocaleDateString(),
      balance
    });

  alert("تم إغلاق اليوم بنجاح");
}

setTimeout(loadBalance, 500);
