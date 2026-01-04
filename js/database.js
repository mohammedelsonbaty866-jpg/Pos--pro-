/* =========================
   DATABASE INIT
========================= */

function initDB(){

  if(!localStorage.getItem("stock")){
    localStorage.setItem("stock", JSON.stringify([]));
  }

  if(!localStorage.getItem("customers")){
    localStorage.setItem("customers", JSON.stringify([]));
  }

  if(!localStorage.getItem("suppliers")){
    localStorage.setItem("suppliers", JSON.stringify([]));
  }

  if(!localStorage.getItem("sales")){
    localStorage.setItem("sales", JSON.stringify([]));
  }

  if(!localStorage.getItem("purchases")){
    localStorage.setItem("purchases", JSON.stringify([]));
  }

  if(!localStorage.getItem("cashLog")){
    localStorage.setItem("cashLog", JSON.stringify([]));
  }

  if(!localStorage.getItem("cashBalance")){
    localStorage.setItem("cashBalance", "0");
  }

  if(!localStorage.getItem("reps")){
    localStorage.setItem("reps", JSON.stringify([]));
  }
}

initDB();
