const settings = JSON.parse(localStorage.getItem("settings")) || {};
const invoice = JSON.parse(localStorage.getItem("lastInvoice"));

if (!invoice) {
  alert("لا توجد فاتورة");
  history.back();
}

// بيانات المتجر
invStore.innerText = settings.storeName || "";
invPhone.innerText = settings.storePhone || "";
if (settings.logo) invLogo.src = settings.logo;

// بيانات الفاتورة
invNo.innerText = invoice.id || "";
invDate.innerText = invoice.date;
invCustomer.innerText = invoice.customer;
invPayment.innerText = invoice.payment === "cash" ? "نقدي" : "آجل";
invTotal.innerText = invoice.total;

// الأصناف
items.innerHTML = "";
invoice.items.forEach(i => {
  items.innerHTML += `
    <tr>
      <td>${i.name}</td>
      <td>${i.price}</td>
      <td>${i.qty}</td>
      <td>${i.total}</td>
    </tr>
  `;
});

// إعداد المقاس
if (settings.printSize === "58")
  document.body.classList.add("print-58");
