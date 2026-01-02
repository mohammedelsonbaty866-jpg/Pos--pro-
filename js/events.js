document.addEventListener("DOMContentLoaded", () => {

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  };

  bind("btnAddProduct", addProduct);
  bind("btnAddCustomer", addCustomer);
  bind("btnSaveInvoice", saveInvoice);
  bind("btnAddExpense", addExpense);

});
