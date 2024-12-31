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
let totalPriceNav = document.querySelector(".totalPriceNav");
let userId = localStorage.getItem("userId_iti");
let counter = 0;
let counterWish = [];
let totalPriceNavbar = document.querySelector(".totalPriceNavbar");

(function () {
  let usersRef = ref(db, "cart/" + userId);
  get(usersRef).then(async (snapshot) => {
    let data = snapshot.val();
    if(data){
      for (const key in data) {
        counter += data[key].count;
        cartCount.innerHTML = counter;
      }
    }
  });

  let totalPrice = ref(db, "totalPriceNavbar/" + userId);
  get(totalPrice).then(async (snapshot) => {
    if (snapshot.val()) {
      let data = await snapshot.val();
      console.log(data);
      totalPriceNavbar.innerHTML = data.total + " EGP";
    }
  });
})();

let count;
let allPrice = 0;

// let totalPrice = ref(db, "totalPriceNavbar/" + userId);
// get(totalPrice).then(async (snapshot) => {
//   if (snapshot.val()) {
//     let data = await snapshot.val().total;
//     console.log(data);
//     totalPriceNavbar.innerHTML = data.total;
//   }
// });

function getPriceTotalNavbar() {
  return new Promise((resolve, reject) => {
    let totalPrice = ref(db, "totalPriceNavbar/" + userId);
    get(totalPrice).then(async (snapshot) => {
      if (snapshot.val()) {
        let data = await snapshot.val().total;
        allPrice = data;
        resolve(allPrice);
        // totalPriceNavbar.innerHTML = data.total;
      } else {
        allPrice = 0;

        resolve(allPrice);
      }
    });
  });
}

window.addCart = async (id, element, priceVal) => {
  let userId = localStorage.getItem("userId_iti");
  let totalPriceNavbarResult = await getPriceTotalNavbar();

  console.log(totalPriceNavbarResult);

  if (localStorage.getItem("userId_iti") != null) {
    let countValBack = await getCountVal(id);
    allPrice += priceVal;
    totalPriceNavbar.innerHTML = allPrice + " EGP";

    set(ref(db, `totalPriceNavbar/${userId}/`), {
      total: allPrice,
    }).then((data) => {
      console.log(data);
    });

    cartCount.innerHTML = +cartCount.innerHTML + 1;
    if (element.getAttribute("data-click") == "0") {
      countValBack = countValBack + 1;
      element.setAttribute("data-click", countValBack);
    } else {
      countValBack = +element.getAttribute("data-click") + 1;
      element.setAttribute("data-click", countValBack);
    }

    addToCart(id, userId, countValBack);
    sweetAdd("cart");
  } else {
    let loginStatus = await sweetValidLogin();
    if (loginStatus.isConfirmed == true) {
      window.location.href = "../../registration/login/login.html";
    }
  }
};

async function getCountVal(id) {
  let userId = localStorage.getItem("userId_iti");
  let productsRef = ref(db, `cart/${userId}/${id}`);
  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const count = snapshot.val().count;
      return count;
    } else {
      console.log("No data available.");
      count = 0;
      return count;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    count = 0;
    return count; // Return 0 or handle errors appropriately
  }
}

function addToCart(id, userID, countVal) {
  update(ref(db, `cart/${userID}/` + id), {
    productId: id,
    count: countVal,
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
