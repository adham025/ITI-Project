document.getElementById("closeBtn").addEventListener("click", function() {
  document.getElementById("nav").style.left = "-250px";
})

document.getElementById("menuBtn").addEventListener("click", function() {
  document.getElementById("nav").style.left = "0";
});


const clickSearch = document.getElementById("searchMobBtn");
const showSearch = document.getElementById("search");

clickSearch.addEventListener("click", () => {
  const isHidden = getComputedStyle(showSearch).display === "none";

  if (isHidden) {
    showSearch.style.display = "flex";
    clickSearch.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    showSearch.style.display = "none";
    clickSearch.innerHTML = '<i class="fa-solid fa-search"></i>';
  }
});



