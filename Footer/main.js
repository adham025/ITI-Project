// document.getElementById("closeBtn").addEventListener("click", function() {
//   document.getElementById("nav").style.left = "-250px";
// })

// document.getElementById("menuBtn").addEventListener("click", function() {
//   document.getElementById("nav").style.left = "0";
// });


// const clickSearch = document.getElementById("searchMobBtn");
// const showSearch = document.getElementById("search");

// clickSearch.addEventListener("click", () => {
//   const isHidden = getComputedStyle(showSearch).display === "none";

//   if (isHidden) {
//     showSearch.style.display = "flex";
//     clickSearch.innerHTML = '<i class="fa-solid fa-xmark"></i>';
//   } else {
//     showSearch.style.display = "none";
//     clickSearch.innerHTML = '<i class="fa-solid fa-search"></i>';
//   }
// });



// scroll to top

const toTopBtn = document.getElementById("toTopBtn");

window.onscroll = function () {
  // console.log(this.scrollY);
  if (this.scrollY >= 100) {
    toTopBtn.classList.add("show");
  } else {
    toTopBtn.classList.remove("show");
  }
};

toTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};