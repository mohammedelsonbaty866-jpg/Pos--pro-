/* =========================
   SYSTEM CORE
========================= */

const System = {

  /* ===== Helpers ===== */
  get(key){
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  set(key,value){
    localStorage.setItem(key, JSON.stringify(value));
  },

  /* ===== STOCK ===== */
  updateStock(itemId, qty, type){
    let stock = this.get("stock");
    let item = stock.find(i => i.id === itemId);
    if(!item) return;

    if(type === "sale") item.qty -= qty;
    if(type === "purchase") item.qty += qty;
    if(type === "return") item.qty += qty;

    this.set("stock", stock);
  },

  /* ===== TREASURY ===== */
  addCash(amount, note){
    let balance = Number(localStorage.getItem("cashBalance") || 0);
    let log = this.get("cashLog");

    balance += amount;
    log.push({date:new Date().toLocaleString(), type:"قبض", amount, note});

    localStorage.setItem("cashBalance", balance);
    this.set("cashLog", log);
  },

  removeCash(amount, note){
    let balance = Number(localStorage.getItem("cashBalance") || 0);
    let log = this.get("cashLog");

    balance -= amount;
    log.push({date:new Date().toLocaleString(), type:"صرف", amount, note});

    localStorage.setItem("cashBalance", balance);
    this.set("cashLog", log);
  },

  /* ===== SALES ===== */
  saveSale(data){
    let sales = this.get("sales");
    sales.push(data);
    this.set("sales", sales);

    data.items.forEach(i=>{
      this.updateStock(i.id, i.qty, "sale");
    });

    if(data.payment === "cash"){
      this.addCash(data.total, "مبيعات نقدي");
    }
  },

  /* ===== PURCHASES ===== */
  savePurchase(data){
    let purchases = this.get("purchases");
    purchases.push(data);
    this.set("purchases", purchases);

    data.items.forEach(i=>{
      this.updateStock(i.id, i.qty, "purchase");
    });

    if(data.payment === "cash"){
      this.removeCash(data.total, "مشتريات");
    }
  },

  /* ===== CUSTOMERS ===== */
  addCustomer(customer){
    let customers = this.get("customers");
    customers.push(customer);
    this.set("customers", customers);
  },

  collectFromCustomer(amount, name){
    this.addCash(amount, `تحصيل من ${name}`);
  },

  /* ===== SUPPLIERS ===== */
  paySupplier(amount, name){
    this.removeCash(amount, `سداد مورد ${name}`);
  },

  /* ===== REPORTS ===== */
  getReports(){
    return {
      sales: this.get("sales"),
      purchases: this.get("purchases"),
      cash: this.get("cashLog"),
      stock: this.get("stock")
    };
  }

};
