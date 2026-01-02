function printInvoice() {
  const content = `
    <h2>فاتورة بيع</h2>
    <p>رقم الفاتورة: ${invoiceNo.value}</p>
    <p>العميل: ${customer.value}</p>
    <p>طريقة الدفع: ${payment.value}</p>
    <p>الإجمالي: ${total.value} جنيه</p>
  `;

  const win = window.open('', '', 'width=400,height=600');
  win.document.write(content);
  win.print();
  win.close();
}

// ================= PDF =================

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFont("Helvetica");
  pdf.text("فاتورة بيع", 80, 10);

  pdf.text(`رقم الفاتورة: ${invoiceNo.value}`, 10, 30);
  pdf.text(`العميل: ${customer.value}`, 10, 40);
  pdf.text(`طريقة الدفع: ${payment.value}`, 10, 50);
  pdf.text(`الإجمالي: ${total.value} جنيه`, 10, 60);

  pdf.save(`invoice_${invoiceNo.value}.pdf`);
}
