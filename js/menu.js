function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function go(page) {
  window.location.href = page;
}
document.querySelectorAll(".menu-item").forEach(item => {
  if (item.getAttribute("onclick")?.includes(location.pathname.split("/").pop())) {
    item.classList.add("active");
  }
});
