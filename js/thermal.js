const invoice = JSON.parse(localStorage.getItem("printInvoice"));

window.onload = () => {
  if (!invoice) {
    alert("لا توجد فاتورة للطباعة");
    return;
  }

  invNo.innerText = invoice.no;
  invDate.innerText = invoice.date;
  invCustomer.innerText = invoice.customer;
  invPayment.innerText = invoice.payment;
  invTotal.innerText = invoice.total;

  items.innerHTML = "";
  invoice.items.forEach(i => {
    items.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.price}</td>
        <td>${i.qty * i.price}</td>
      </tr>
    `;
  });

  // طباعة تلقائية
  setTimeout(() => window.print(), 500);
};
