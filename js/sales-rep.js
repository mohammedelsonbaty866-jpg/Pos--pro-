const rep=JSON.parse(localStorage.getItem("currentRep"));
if(!rep) location.href="login.html";

let invoice=[];
let total=0;
const items=JSON.parse(localStorage.getItem("items"))||[];

function searchItem(){
  const i=items.find(x=>x.name.includes(itemSearch.value));
  if(i) price.value=i.price;
}

function addItem(){
  invoice.push({
    name:itemSearch.value,
    qty:+qty.value,
    price:+price.value,
    total:+qty.value*+price.value
  });
  render();
}

function render(){
  invoice.innerHTML="";
  total=0;
  invoice.forEach(i=>{
    total+=i.total;
    invoice.innerHTML+=`<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.total}</td></tr>`;
  });
  document.getElementById("total").innerText=total;
}

function saveSale(){
  const sales=JSON.parse(localStorage.getItem("sales"))||[];
  sales.push({
    id:Date.now(),
    repId:rep.id,
    customer:customer.value||"نقدي",
    type:saleType.value,
    items:invoice,
    total,
    date:new Date().toLocaleString()
  });
  localStorage.setItem("sales",JSON.stringify(sales));

  invoice.forEach(i=>updateStock(i.name,i.qty,"sale"));

  alert("تم الحفظ");
  invoice=[];
  render();
}
