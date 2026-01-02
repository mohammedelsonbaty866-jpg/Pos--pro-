// تحميل الإعدادات
document.addEventListener("DOMContentLoaded", loadSettings);

function loadSettings() {
  const s = JSON.parse(localStorage.getItem("settings")) || {};

  storeName.value = s.storeName || "";
  storePhone.value = s.storePhone || "";
  printSize.value = s.printSize || "80";
  printLang.value = s.printLang || "ar";

  loadReps(s.reps || []);
}

// حفظ
btnSaveSettings.addEventListener("click", () => {
  const reader = new FileReader();

  reader.onload = () => {
    const settings = {
      storeName: storeName.value,
      storePhone: storePhone.value,
      logo: reader.result || null,
      printSize: printSize.value,
      printLang: printLang.value,
      reps: reps
    };

    localStorage.setItem("settings", JSON.stringify(settings));
    alert("تم حفظ الإعدادات");
  };

  if (storeLogo.files[0])
    reader.readAsDataURL(storeLogo.files[0]);
  else reader.onload();
});

// مندوبين
let reps = [];

function loadReps(list) {
  reps = list;
  renderReps();
}

btnAddRep.addEventListener("click", () => {
  if (!repName.value) return;
  reps.push(repName.value);
  repName.value = "";
  renderReps();
});

function renderReps() {
  repsList.innerHTML = "";
  reps.forEach((r, i) => {
    repsList.innerHTML += `
      <li>
        ${r}
        <button class="btn btn-danger btn-icon"
          onclick="removeRep(${i})">🗑️</button>
      </li>`;
  });
}

function removeRep(i) {
  reps.splice(i, 1);
  renderReps();
}
