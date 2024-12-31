// Start Search Code

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
import { addToCart } from "../cart/cartFun.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
let query = window.location.search;
let searchQuery = new URLSearchParams(query);
let searchWord = searchQuery.get("search");
const searchDiv = document.getElementById("searchQuery");
const productData = document.querySelector("#searchLayout");
let searchBtn = document.querySelector(".search-btn");
let overlay = document.querySelector(".overlay");

if(searchWord){
  searchDiv.value = searchWord;
}

function getProducts() {
  return new Promise((resolve, reject) => {
    const productsRef = ref(db, "products/");
    get(productsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let products = snapshot.val();
          console.log(products);
          resolve(products);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });
}

let data = await getProducts();

searchBtn.addEventListener("click", () => getSearchedProducts(searchDiv.value));

function getSearchedProducts(val) {
  productData.innerHTML = "";
  let div = document.createElement("div");
  let img = document.createElement("img");
  img.setAttribute("src", "images/no-product-found.png");
  div.setAttribute("class", "product-not-found-img");
  div.appendChild(img);
  productData.after(div);
  const searchVal = val;
  let container = null;
  const matchedProducts = Object.entries(data).filter(([key, product]) => {
    return (
      product.name.toLowerCase().includes(val.toLowerCase()) ||
      product.description.toLowerCase().includes(val.toLowerCase())
    );
  });

  if (matchedProducts.length > 0) {
    matchedProducts.forEach(([key, product]) => {
      container = `
              <div class="item">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3 class="product-title">${product.name}</h3>
        <div class="cart-flex">
          <h4 class="product-price">${product.price} EGP</h4>
          <button data-click="0" onclick="addCart('${product.id}', this , ${product.price})" class="card-btn">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
        <div class="product-wishlist">
          <button  onclick="addWishlist('${product.id}')" class="card-btn"><i class="fa-regular fa-heart"></i></button>
          <button class="view-btn">
            <a href="../productDetails/productDetails.html?id=${product.id}">
              <i class="fa-regular fa-eye"></i>
            </a>
          </button>
        </div>
      </div>
            `;
      productData.innerHTML += container;
      
      overlay.style.display = "none";
      div.remove();
    });
  } else {
    productData.innerHTML = "";
    productData.after(div);
  }
}

getSearchedProducts(searchWord);

// End Search Code

// Start Header Code

document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("nav").style.left = "-250px";
});

document.getElementById("menuBtn").addEventListener("click", function () {
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

// End Header Code
