const invoice = JSON.parse(localStorage.getItem("printInvoice"));

window.onload = () => {
  if (!invoice) {
    alert("لا توجد فاتورة للطباعة");
    return;
  }

  // بيانات الفاتورة
  document.getElementById("invNo").innerText = invoice.no;
  document.getElementById("invDate").innerText = invoice.date;
  document.getElementById("invCustomer").innerText = invoice.customer;
  document.getElementById("invPayment").innerText = invoice.payment;
  document.getElementById("invTotal").innerText = invoice.total;

  // الأصناف
  const itemsBody = document.getElementById("items");
  itemsBody.innerHTML = "";

  invoice.items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.qty * item.price}</td>
    `;
    itemsBody.appendChild(row);
  });

  // طباعة تلقائية
  setTimeout(() => {
    window.print();
  }, 500);
};
