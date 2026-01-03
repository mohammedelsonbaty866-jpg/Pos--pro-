<script>
/* ===============================
   تحميل البيانات من السيستم
================================ */
const sales     = JSON.parse(localStorage.getItem("sales"))     || [];
const returns   = JSON.parse(localStorage.getItem("returns"))   || [];
const stock     = JSON.parse(localStorage.getItem("stock"))     || [];
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const cashbox   = JSON.parse(localStorage.getItem("cashbox"))   || [];

/* ===============================
   عناصر الصفحة
================================ */
const tabs = document.querySelectorAll(".tab");
const tbody = document.querySelector("tbody");
const cards = document.querySelectorAll(".card span");

/* ===============================
   التبويبات
================================ */
tabs.forEach(tab=>{
  tab.onclick=()=>{
    tabs.forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    loadTab(tab.innerText);
  }
});

/* ===============================
   تحميل أول مرة
================================ */
loadDashboard();
loadTab("المبيعات");

/* ===============================
   الداشبورد
================================ */
function loadDashboard(){
  let totalSales = sales.reduce((a,s)=>a+s.total,0);
  let totalReturns = returns.reduce((a,r)=>a+r.total,0);
  let cash = cashbox.reduce((a,c)=>a+c.amount,0);

  cards[0].innerText = totalSales.toFixed(2);
  cards[1].innerText = totalReturns.toFixed(2);
  cards[2].innerText = (totalSales-totalReturns).toFixed(2);
  cards[3].innerText = cash.toFixed(2);
  cards[4].innerText = sales.length;
  cards[5].innerText = customers.length;
}

/* ===============================
   تحميل التبويب
================================ */
function loadTab(type){
  tbody.innerHTML="";

  if(type==="المبيعات"){
    sales.forEach(s=>{
      tbody.innerHTML+=row(
        s.date,
        s.customer,
        s.rep||"-",
        s.type||"بيع",
        s.total
      );
    });
  }

  if(type==="المرتجعات"){
    returns.forEach(r=>{
      tbody.innerHTML+=row(
        r.date,
        r.customer,
        r.rep||"-",
        "مرتجع",
        -r.total
      );
    });
  }

  if(type==="المخزون"){
    stock.forEach(i=>{
      tbody.innerHTML+=`
        <tr>
          <td>${i.name}</td>
          <td colspan="2">${i.unit}</td>
          <td>رصيد</td>
          <td>${i.qty}</td>
        </tr>`;
    });
  }

  if(type==="العملاء"){
    customers.forEach(c=>{
      tbody.innerHTML+=`
        <tr>
          <td>${c.name}</td>
          <td colspan="2">${c.phone||""}</td>
          <td>رصيد</td>
          <td>${c.balance||0}</td>
        </tr>`;
    });
  }

  if(type==="الخزنة"){
    cashbox.forEach(c=>{
      tbody.innerHTML+=row(
        c.date,
        c.note||"-",
        "-",
        c.type,
        c.amount
      );
    });
  }
}

/* ===============================
   صف جدول
================================ */
function row(d,c,r,t,v){
  return `
  <tr>
    <td>${d}</td>
    <td>${c}</td>
    <td>${r}</td>
    <td>${t}</td>
    <td>${v}</td>
  </tr>`;
}

/* ===============================
   طباعة
================================ */
function printReport(){
  window.print();
}

/* ===============================
   تصدير Excel (CSV حقيقي)
================================ */
function exportExcel(){
  let csv="التاريخ,العميل,المندوب,النوع,القيمة\n";
  document.querySelectorAll("tbody tr").forEach(tr=>{
    let row=[];
    tr.querySelectorAll("td").forEach(td=>{
      row.push(td.innerText);
    });
    csv+=row.join(",")+"\n";
  });

  const blob=new Blob([csv],{type:"text/csv"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="report.csv";
  a.click();
}
</script>
