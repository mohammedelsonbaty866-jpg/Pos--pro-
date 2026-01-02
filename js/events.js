/*********************************
 * events.js
 * Global Events Handler
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  bindActions();
});

/*********************************
 * ربط الأزرار
 *********************************/
function bindActions() {
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", handleAction);
  });
}

/*********************************
 * Router للأحداث
 *********************************/
function handleAction(e) {
  const action = e.currentTarget.dataset.action;

  if (!action) return;

  switch (action) {
    case "add-product":
      if (window.addProduct) addProduct();
      break;

    case "delete-product":
      if (window.deleteProduct)
        deleteProduct(e.currentTarget.dataset.id);
      break;

    case "add-customer":
      if (window.addCustomer) addCustomer();
      break;

    case "delete-customer":
      if (window.deleteCustomer)
        deleteCustomer(e.currentTarget.dataset.id);
      break;

    case "add-supplier":
      if (window.addSupplier) addSupplier();
      break;

    case "delete-supplier":
      if (window.deleteSupplier)
        deleteSupplier(e.currentTarget.dataset.id);
      break;

    case "save-invoice":
      if (window.saveInvoice) saveInvoice();
      break;

    case "print-invoice":
      window.print();
      break;

    case "save-settings":
      if (window.saveSettings) saveSettings();
      break;

    default:
      console.warn("Unhandled action:", action);
  }
}
