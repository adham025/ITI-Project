import { firebaseConfig } from "../../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

let cartCount = document.querySelector(".cartCount");
let wishlistCount = document.querySelector(".wishlistCount");
let userId = localStorage.getItem("userId_iti");
let counter = 0;
let counterWish = [];

(function () {
  let usersRef = ref(db, "wishlist/" + userId);
  get(usersRef).then(async (snapshot) => {
    let data = snapshot.val();
    for (const key in data) {
      counterWish.push(data[key]);
      wishlistCount.innerHTML = counterWish.length;
    }
  });
})();

let count;
window.addWishlist = async (id) => {
  let userId = localStorage.getItem("userId_iti");
  if (localStorage.getItem("userId_iti") != null) {
    wishlistCount.innerHTML = +wishlistCount.innerHTML + 1;
    addToWishlist(id, userId);
    sweetAdd("wishlist");
  } else {
    let loginStatus = await sweetValidLogin();
    if (loginStatus.isConfirmed == true) {
      window.location.href = "../registration/login/login.html";
    }
  }
};

// async function getCountVal(id) {
//   let userId = localStorage.getItem("userId_iti");
//   let productsRef = ref(db, `wishlist/${userId}/${id}`);
//   try {
//     const snapshot = await get(productsRef);
//     if (snapshot.exists()) {
//       const count = snapshot.val().count;
//       return count;
//     } else {
//       console.log("No data available.");
//       count = 0;
//       return count;
//     }
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     count = 0;
//     return count; // Return 0 or handle errors appropriately
//   }
// }

function addToWishlist(id, userID) {
  update(ref(db, `wishlist/${userID}/` + id), {
    productId: id,
  }).then((data) => {});
}

function sweetAdd(value) {
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
    icon: "success",
    title: "Product added successfully to your " + value,
  });
}

async function sweetValidLogin() {
  const result = await Swal.fire({
    title: "You are not registrated?",
    text: "If you want to make this action, please registered Now!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Login Now!",
  });
  return result;
}
