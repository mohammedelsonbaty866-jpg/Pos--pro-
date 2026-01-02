const table = document.getElementById("expensesTable");

function loadExpenses() {
  table.innerHTML = "";
  db.transaction("expenses", "readonly")
    .objectStore("expenses")
    .getAll().onsuccess = e => {
      e.target.result.forEach(x => {
        table.innerHTML += `
          <tr>
            <td>${x.date}</td>
            <td>${x.amount}</td>
            <td>${x.note}</td>
          </tr>
        `;
      });
    };
}

function addExpense() {
  const amount = Number(document.getElementById("amount").value);
  const note = document.getElementById("note").value;

  if (!amount) return alert("أدخل قيمة المصروف");

  // حفظ المصروف
  db.transaction("expenses", "readwrite")
    .objectStore("expenses")
    .add({
      date: new Date().toLocaleString(),
      amount,
      note
    });

  // تسجيله في الخزنة (نقد خارج)
  db.transaction("cashbox", "readwrite")
    .objectStore("cashbox")
    .add({
      date: new Date().toLocaleString(),
      amount,
      type: "out",
      note: "مصروف: " + note
    });

  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";

  loadExpenses();
}

setTimeout(loadExpenses, 500);
