/*********************************
 * settings.js
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  renderAgents();
});

/*********************************
 * تحميل الإعدادات
 *********************************/
function loadSettings() {
  const s = POS_DB.DB.settings || {};

  document.getElementById("setStoreName").value = s.storeName || "";
  document.getElementById("setStorePhone").value = s.storePhone || "";
  document.getElementById("printAuto").checked = s.printAuto || false;
}

/*********************************
 * حفظ الإعدادات
 *********************************/
function saveSettings() {
  const storeName = document.getElementById("setStoreName").value.trim();
  const storePhone = document.getElementById("setStorePhone").value.trim();
  const printAuto = document.getElementById("printAuto").checked;
  const logoInput = document.getElementById("setStoreLogo");

  if (!POS_DB.DB.settings) POS_DB.DB.settings = {};

  POS_DB.DB.settings.storeName = storeName;
  POS_DB.DB.settings.storePhone = storePhone;
  POS_DB.DB.settings.printAuto = printAuto;

  if (logoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      POS_DB.DB.settings.storeLogo = e.target.result;
      POS_DB.save();
      UI.showAlert("تم حفظ الإعدادات");
    };
    reader.readAsDataURL(logoInput.files[0]);
  } else {
    POS_DB.save();
    UI.showAlert("تم حفظ الإعدادات");
  }
}

/*********************************
 * إضافة مندوب
 *********************************/
function addAgent() {
  const name = document.getElementById("agentName").value.trim();
  if (!name) return;

  POS_DB.addItem("agents", { name });
  document.getElementById("agentName").value = "";

  renderAgents();
}

/*********************************
 * حذف مندوب
 *********************************/
function deleteAgent(id) {
  if (!UI.confirmAction("حذف المندوب؟")) return;

  POS_DB.deleteItem("agents", id);
  renderAgents();
}

/*********************************
 * عرض المندوبين
 *********************************/
function renderAgents() {
  const agents = POS_DB.DB.agents || [];
  const tbody = document.getElementById("agentsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  agents.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${a.name}</td>
      <td>
        <button data-action="delete-agent" data-id="${a.id}">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
