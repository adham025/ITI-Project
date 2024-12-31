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
import { addToCart } from "../../cart/cartFun.js";
import { addToWishlist } from "../../wishlist/wishlistFun.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
let overlay = document.querySelector(".overlay");

let selectedBrands = new Set();
let selectedColors = new Set();
let maxPrice = null;

function getMobiles() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();

        let filteredProducts = Object.keys(products).filter((productId) => {
          let product = products[productId];
          let matchesCategory = product.category === "Mobiles";

          let matchesBrand =
            selectedBrands.size === 0 || selectedBrands.has(product.brand);
          let matchesColor =
            selectedColors.size === 0 || selectedColors.has(product.color);
          let matchesPrice = maxPrice === null || product.price <= maxPrice;

          return (
            matchesCategory && matchesBrand && matchesColor && matchesPrice
          );
        });

        displayProducts(filteredProducts.map((id) => products[id]));
      } else {
        document.querySelector(".products").innerHTML =
          "<p>No products found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}
document.getElementById("sort").addEventListener("change", (e) => {
  let productsContainer = document.querySelector(".products");
  if (productsContainer) {
    let productElements = Array.from(productsContainer.children);
    let products = productElements.map((e) => ({
      id: e
        .querySelector(".card-btn")
        .getAttribute("onclick")
        .match(/'([^']+)'/)[1],
      name: e.querySelector(".product-title").textContent,
      price: parseFloat(
        e.querySelector(".product-price").textContent.replace(" EGP", "")
      ),
      image: e.querySelector(".product-image").src,
    }));
    if (e.target.value === "lowest") {
      products.sort((a, b) => a.price - b.price);
      displayProducts(products);
    } else {
      products.sort((a, b) => b.price - a.price);
      displayProducts(products);
    }
  }
});

function displayProducts(products) {
  const productsContainer = document.querySelector(".products");
  if (products.length === 0) {
    productsContainer.innerHTML = "<p>No products match your filters.</p>";
    return;
  }

  let card = "";
  products.forEach((product) => {
    card += `
      <div class="item">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3 class="product-title">${product.name.split(" ").slice(0,10).join(" ")}</h3>
        <div class="stars">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-regular fa-star"></i>
        </div>
        <div class="cart-flex">
          <h4 class="product-price">${product.price} EGP</h4>
          <button data-click="0" onclick="addCart('${product.id}', this , ${product.price})" class="card-btn">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
        <div class="product-wishlist">
          <button  onclick="addWishlist('${product.id}')" class="card-btn"><i class="fa-regular fa-heart"></i></button>
          <button class="view-btn">
            <a href="../../productDetails/productDetails.html?id=${product.id}">
              <i class="fa-regular fa-eye"></i>
            </a>
          </button>
        </div>
      </div>
    `;
  });
  overlay.style.display = "none";
  productsContainer.innerHTML = card;
}

document.querySelectorAll(".brand-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectedBrands.add(event.target.value);
      console.log(selectedBrands);
    } else {
      selectedBrands.delete(event.target.value);
    }
    getMobiles();
  });
});

document.querySelectorAll(".color-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectedColors.add(event.target.value);
    } else {
      selectedColors.delete(event.target.value);
    }
    getMobiles();
  });
});

document.getElementById("priceRange").addEventListener("input", (event) => {
  document.getElementById("priceRangeValue").textContent = event.target.value;
});

document.getElementById("applyPriceFilter").addEventListener("click", () => {
  maxPrice = parseInt(document.getElementById("priceRange").value);
  getMobiles();
});

window.onload = getMobiles;

// let count;

// async function getCountVal(id) {
//   let userId = localStorage.getItem("userId_iti");
//   let productsRef = ref(db, `cart/${userId}/${id}`);
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

// let cartCount = document.querySelector(".cartCount");
// let wishlistCount = document.querySelector(".wishlistCount");
// let userId = localStorage.getItem("userId_iti");
// let counter = 0;
// let counterWish = [];

// (function () {
//   let usersRef = ref(db, "cart/" + userId);
//   get(usersRef).then(async (snapshot) => {
//     let data = snapshot.val();
//     console.log(data);
//     for (const key in data) {
//       counter += data[key].count;
//       cartCount.innerHTML = counter;
//     }
//   });
// })();

// (function () {
//   let usersRef = ref(db, "wishlist/" + userId);
//   get(usersRef).then(async (snapshot) => {
//     let data = snapshot.val();
//     for (const key in data) {
//       counterWish.push(data[key]);
//       wishlistCount.innerHTML = counterWish.length;
//     }
//   });
// })();

// window.addCart = async (id, element) => {
//   let countValBack = await getCountVal(id);
//   cartCount.innerHTML = +cartCount.innerHTML + 1;

//   if (localStorage.getItem("userId_iti") != null) {
//     let userId = localStorage.getItem("userId_iti");

//     if (element.getAttribute("data-click") == "0") {
//       countValBack = countValBack + 1;
//       element.setAttribute("data-click", countValBack);
//     } else {
//       countValBack = +element.getAttribute("data-click") + 1;
//       element.setAttribute("data-click", countValBack);
//     }

//     addToCart(id, userId, countValBack);
//     sweetAdd("cart");
//   } else {
//     let result = await sweetValidLogin();
//     if (result.isConfirmed) {
//       window.location.href = "../registration/login/login.html";
//     }
//   }
// };

// window.addWishlist = async (id) => {
//   console.log(id);
//   wishlistCount.innerHTML = +wishlistCount.innerHTML + 1;
//   if (localStorage.getItem("userId_iti") != null) {
//     let userId = localStorage.getItem("userId_iti");
//     addToWishlist(id, userId);
//     sweetAdd("wishlist");
//   } else {
//     let result = await sweetValidLogin();
//     if (result.isConfirmed) {
//       window.location.href = "../registration/login/login.html";
//     }
//   }
// };

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

let bars = document.querySelector(".bars");
let filterBar = document.querySelector(".filter-bar");
let overlayBar = document.querySelector(".overlay-bar");
bars.addEventListener("click", barsFun);

function barsFun(e) {
  console.log(e.target);
  if (e.target.classList.contains("fa-bars-staggered")) {
    filterBar.style.left = "0px";
    overlayBar.style.display = "block";
    e.target.classList.replace("fa-bars-staggered", "fa-xmark");
  } else {
    filterBar.style.left = "-300px";
    overlayBar.style.display = "none";
    e.target.classList.replace("fa-xmark", "fa-bars-staggered");
  }
}

