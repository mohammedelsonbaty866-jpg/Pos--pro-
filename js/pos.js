const productsGrid = document.getElementById("productsGrid");
const cartBody = document.getElementById("cartBody");
const totalEl = document.getElementById("total");
const netEl = document.getElementById("net");
const discountInput = document.getElementById("discount");

let cart = [];

// أصناف تجريبية (هتتربط بـ Firestore)
const products = [
 {id:1,name:"بيبسي",price:10},
 {id:2,name:"مياه",price:5},
 {id:3,name:"شيبسي",price:7},
 {id:4,name:"عصير",price:12}
];

products.forEach(p=>{
 productsGrid.innerHTML += `
  <div class="product-card" onclick="addProduct(${p.id})">
    ${p.name}
    <small>${p.price} ج</small>
  </div>
 `;
});

function addProduct(id){
 const p = products.find(x=>x.id===id);
 const item = cart.find(x=>x.id===id);

 if(item){
  item.qty++;
 }else{
  cart.push({...p,qty:1});
 }
 renderCart();
}

function renderCart(){
 cartBody.innerHTML="";
 let total=0;

 cart.forEach((i,idx)=>{
  total+=i.qty*i.price;
  cartBody.innerHTML+=`
   <tr>
    <td>${i.name}</td>
    <td>${i.qty}</td>
    <td>${i.price}</td>
    <td onclick="removeItem(${idx})">❌</td>
   </tr>
  `;
 });

 totalEl.innerText=total;
 calcNet();
}

function removeItem(i){
 cart.splice(i,1);
 renderCart();
}

discountInput.oninput=calcNet;

function calcNet(){
 const total=+totalEl.innerText;
 const discount=+discountInput.value||0;
 netEl.innerText= total-discount;
}

function saveInvoice(){
 const type=document.getElementById("paymentType").value;
 const customer=document.getElementById("customerName").value;

 if(type==="credit" && !customer){
  alert("اسم العميل مطلوب في البيع الآجل");
  return;
 }

 alert("✔ تم حفظ الفاتورة (جاهز للربط مع Firebase)");
 cart=[];
 renderCart();
 discountInput.value="";
}
