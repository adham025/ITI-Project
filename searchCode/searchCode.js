let searchBtn = document.querySelector(".search-btn");
let searchInpt = document.querySelector("#searchQuery");
searchBtn.addEventListener("click" , searchFun)

function searchFun(){
  if(searchInpt.value != ""){
    window.location = `../../search/index.html?search=${searchInpt.value}`
  }else{
    sweetSearch();
  }
}

function sweetSearch() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "warning",
    title: "You must fill search input by value",
  });
}