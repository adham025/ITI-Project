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

function getProduct() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();
        const urlParams = new URLSearchParams(window.location.search);
        const selectedId = urlParams.get("id");
        if (!selectedId) {
          console.log("No ID found in the URL");
          return;
        }
        console.log(selectedId);
        let product = null;
        for (let p in products) {
          if (p === selectedId) {
            product = products[p];
          }
        }
        if (product) {
          let card = `
              <div class="item">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h2 class="product-title">${product.name}</h2>
                <h3 class="product-description">${product.description}</h3>
                <p class="product-color">${product.color}</p>
                <p class="product-price">${product.price} EGP</p>
                <button class="card-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="card-btn"><i class="fa-regular fa-heart"></i></button>
              </div>
            `;
          document.querySelector(".product-details").innerHTML = card;
        } else {
          console.log("shit");
          document.querySelector(".product-details").innerHTML =
            "<p>Product not found.</p>";
        }
      } else {
        console.log("No products found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}
getProduct();
