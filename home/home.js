import { firebaseConfig } from "./config.js";
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

let productArea = document.querySelector(".product-area");
let overlay = document.querySelector(".overlay");

let productsRef = ref(db, "products/");

(async () => {
  try {
    let snapshot = await get(productsRef);

    if (snapshot.exists()) {
      let product = snapshot.val();


      let productsArray = Object.keys(product).map((id) => ({
        id,
        ...product[id],
      }));

      // Shuffle the products array
      let shuffledProducts = productsArray.sort(() => Math.random() - 0.5);

      // Get the first 8 products
      let limitedProducts = shuffledProducts.slice(0, 12);
      console.log(limitedProducts);
      

      let card = "";
      for(let i = 0; i < limitedProducts.length; i++){
        card += `
      <div class="item">
        <img src="${limitedProducts[i].image}" alt="${
          limitedProducts[i].name
        }" class="product-image" />
        <h3 class="product-title">${limitedProducts[i].name
          .split(" ")
          .slice(0, 10)
          .join(" ")}</h3>
        <div class="stars">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-regular fa-star"></i>
        </div>
        <div class="cart-flex">
          <h4 class="product-price">${limitedProducts[i].price} EGP</h4>
          <button data-click="0" onclick="addCart('${
            limitedProducts[i].id
          }', this , ${limitedProducts[i].price})" class="card-btn">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
        <div class="product-wishlist">
          <button  onclick="addWishlist('${
            limitedProducts[i].id
          }')" class="card-btn"><i class="fa-regular fa-heart"></i></button>
          <button class="view-btn">
            <a href="productDetails/productDetails.html?id=${limitedProducts[i].id}">
              <i class="fa-regular fa-eye"></i>
            </a>
          </button>
        </div>
      </div>
        `;
      }
      // for (const key in product) {
      //   card += `
      // <div class="item">
      //   <img src="${product[key].image}" alt="${
      //     product[key].name
      //   }" class="product-image" />
      //   <h3 class="product-title">${product[key].name
      //     .split(" ")
      //     .slice(0, 10)
      //     .join(" ")}</h3>
      //   <div class="stars">
      //     <i class="fa-solid fa-star"></i>
      //     <i class="fa-solid fa-star"></i>
      //     <i class="fa-solid fa-star"></i>
      //     <i class="fa-solid fa-star"></i>
      //     <i class="fa-regular fa-star"></i>
      //   </div>
      //   <div class="cart-flex">
      //     <h4 class="product-price">${product[key].price} EGP</h4>
      //     <button data-click="0" onclick="addCart('${
      //       product[key].id
      //     }', this , ${product[key].price})" class="card-btn">
      //       <i class="fa-solid fa-cart-shopping"></i>
      //     </button>
      //   </div>
      //   <div class="product-wishlist">
      //     <button  onclick="addWishlist('${
      //       product[key].id
      //     }')" class="card-btn"><i class="fa-regular fa-heart"></i></button>
      //     <button class="view-btn">
      //       <a href="productDetails/productDetails.html?id=${product[key].id}">
      //         <i class="fa-regular fa-eye"></i>
      //       </a>
      //     </button>
      //   </div>
      // </div>
      //   `;
      // }

      productArea.innerHTML = card;
      overlay.style.display = "none";
    } else {
      document.querySelector(".products").innerHTML =
        "<p>No products found.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
})();
