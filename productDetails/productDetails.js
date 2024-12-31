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
let overlay = document.querySelector(".overlay");

function getProduct() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();
        console.log(products);

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
        window.document.title = product.name + " " + "| Maas Store";
        if (product) {
          let card = `

              <div class="item">
                
                <div class="item-img">
                  <img src="${product.image}" alt="${product.name}" class="product-image" />
                </div>
                <div class="item-content">
                  <section>${product.category}</section>
                  <h2 class="product-title">${product.name}</h2>

                  <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                  </div>

                  <section>Availability: <span class="greenQuantity">${product.quantity} in stock</span></section>

                  <section class="product-description">
                  ${product.description}
                  </section>

                  <div class="list">
                    <li>4.5 inch HD Touch Screen</li>
                    <li>Android 4.4 KitKat OS</li>
                    <li>1.4 GHz Quad Core™ Processor</li>
                    <li>20 MP Electro and 28 megapixel CMOS rear camera</li>
                  </div>

                  <h3 class="product-price">${product.price} EGP</h3>

                 <div class="btns-end">
                   <button data-click="0" onclick="addCart('${product.id}', this , ${product.price})" class="card-btn">
                   <i class="fa-solid fa-cart-arrow-down"></i> Add to Cart
                   </button>
                   <button  onclick="addWishlist('${product.id}')" class="card-btn">
                     Wishlist <i class="fa-regular fa-heart"></i>
                   </button>
                 </div>
                </div>
              </div>
            `;
          document.querySelector(".product-details").innerHTML = card;
          overlay.style.display = "none";

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

// let productsRef = ref(db, "products/");
// get(productsRef)
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       let products = snapshot.val();
//       console.log(products);

//       const urlParams = new URLSearchParams(window.location.search);
//       const selectedId = urlParams.get("id");
//     }
//       })
//   .catch((error) => {
//     console.error("Error fetching products:", error);
//   });


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