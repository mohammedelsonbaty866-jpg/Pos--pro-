// بيانات تجريبية (لاحقًا من الفاتورة الحقيقية)
const invoice = {
  no: "1001",
  date: new Date().toLocaleString(),
  customer: "عميل نقدي",
  payment: "نقدي",
  total: 150,
  items: [
    { name: "صنف 1", qty: 2, price: 25 },
    { name: "صنف 2", qty: 1, price: 100 }
  ]
};

// تحميل البيانات
window.onload = () => {
  invNo.innerText = invoice.no;
  invDate.innerText = invoice.date;
  invCustomer.innerText = invoice.customer;
  invPayment.innerText = invoice.payment;
  invTotal.innerText = invoice.total;

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
};

// الطباعة
function printThermal() {
  window.print();
}
