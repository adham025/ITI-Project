import { firebaseConfig } from "../config.js";
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

let tbody = document.querySelector(".tbody");
let overlay = document.querySelector(".overlay");
let cartEmpty = document.querySelector(".cartEmpty");
let containerWishlist = document.querySelector(".container-wishlist");
let wishlistTitle = document.querySelector(".wishlist-title");
let wishlistCount = document.querySelector(".wishlistCount");

let data;
async function getIdsOfProducts() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem("userId_iti") != null) {
      let userId = localStorage.getItem("userId_iti");
      let usersRef = ref(db, "wishlist/" + userId);
      get(usersRef).then(async (snapshot) => {
        data = await snapshot.val();
        resolve(data);
      });
    } else {
      cartEmpty.style.display = "block";
      containerWishlist.style.display = "none";
      wishlistTitle.style.display = "none";
      overlay.style.display = "none";
    }
  });
}

async function displayCartProducts() {
  let productsIDS = await getIdsOfProducts();
  let promiseArr = [];
  for (let product in productsIDS) {
    let usersRef = ref(db, "products/" + product);
    let promise = get(usersRef).then((snapshot) => snapshot.val());
    promiseArr.push(promise);
  }
  return [Promise.all(promiseArr), productsIDS];
}

let productsIDS;
async function displayProducts() {
  let result = await displayCartProducts();
  let resultArr = await result[0];
  productsIDS = await result[1];
  console.log(productsIDS);

  let box = "";

  if (resultArr.length != 0) {
    for (let i = 0; i < resultArr.length; i++) {
      box += `
      <tr>
  
          <td>
            <button onclick="deleteActualProduct('${resultArr[i].id}')" class="card-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </td>
  
          <td>
              <img src="${resultArr[i].image}" alt="${resultArr[i].name}" class="product-image" />
          </td>
          <td>
            <p class="product-title">${resultArr[i].name}</p>
          </td>
          <td>
            <p class="product-price">${resultArr[i].price} E£</p>
          </td>
          
          <td>
            <button data-click="0" onclick="addCart('${resultArr[i].id}', this , ${resultArr[i].price})" class="card-btn carto">Add to cart</button>
          </td>
          
      </tr> 
    `;
    }
    tbody.innerHTML = box;
  } else {
    cartEmpty.style.display = "block";
    containerWishlist.style.display = "none";
    wishlistTitle.style.display = "none";
  }
  overlay.style.display = "none";
}
displayProducts();

window.deleteActualProduct = async (id) => {
  let userId = localStorage.getItem("userId_iti");
  let usersRef = ref(db, `wishlist/${userId}/${id}`);

  remove(usersRef)
    .then(() => {
      delete productsIDS[id];
      displayProducts();
      wishlistCount.innerHTML = +wishlistCount.innerHTML - 1;
      sweetCountProduct("product removed successfully!", "success");
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
};

function sweetCountProduct(msg, icon) {
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
    icon: icon,
    title: msg,
  });
}

// let count = 0;
// window.addCart = async (id, element) => {
//   if (localStorage.getItem("userId_iti") != null) {
//     let userId = localStorage.getItem("userId_iti");

//     if (element.getAttribute("data-click") == "0") {
//       count = 1;
//       element.setAttribute("data-click", count);
//     } else {
//       count = +element.getAttribute("data-click") + 1;
//       element.setAttribute("data-click", count);
//     }

//     addToCart(id, userId, count);
//     sweetAdd("cart");
//   } else {
//     let result = await sweetValidLogin();
//     if (result.isConfirmed) {
//       window.location.href = "../registration/login/login.html";
//     }
//   }
// };

// window.addToCart = (id, userID, countVal) => {
//   update(ref(db, `cart/${userID}/` + id), {
//     productId: id,
//     count: countVal,
//   }).then((data) => {
//     const categoryRef = ref(db, `wishlist/${userID}/` + id);
//     remove(categoryRef);
//     displayProducts();
//   });
// };

// async function sweetValidLogin() {
//   const result = await Swal.fire({
//     title: "You are not registrated?",
//     text: "If you want to make this action, please registered Now!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Login Now!",
//   });
//   return result;
// }

// function sweetAdd(value) {
//   const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.onmouseenter = Swal.stopTimer;
//       toast.onmouseleave = Swal.resumeTimer;
//     },
//   });
//   Toast.fire({
//     icon: "success",
//     title: "Product added successfully to your " + value,
//   });
// }
