document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", handleActions);
});

function handleActions(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case "add-to-cart":
      if (typeof addItemToInvoice === "function") {
        addItemToInvoice();
      }
      break;

    case "save-invoice":
      if (typeof saveInvoice === "function") {
        saveInvoice();
      }
      break;

    case "add-customer":
      if (typeof addCustomer === "function") {
        addCustomer();
      }
      break;

    case "add-supplier":
      if (typeof addSupplier === "function") {
        addSupplier();
      }
      break;

    case "add-expense":
      if (typeof addExpense === "function") {
        addExpense();
      }
      break;

    default:
      console.warn("Unknown action:", action);
  }
}
