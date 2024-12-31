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

let container = document.querySelector(".container");
let overlay = document.querySelector(".overlay");
let cartEmpty = document.querySelector(".cartEmpty");
let table = document.querySelector(".table");
let subtotalValue = document.querySelector(".subtotal-value");
let flatRate = document.querySelector(".flat-rate");
let finalTotal = document.querySelector(".finalTotal");
let totalCart = document.querySelector(".total-cart");
let shippingInpts = document.querySelectorAll(".shippingInpts");
let shippingInpt = document.querySelectorAll(".shippingInpt");
let bar = document.querySelector(".bar");
let priceValAdd = document.querySelector(".priceValAdd");
let offerText = document.querySelector(".offer-text");
let removeAll = document.querySelector("#removeAll");
let checkout = document.querySelector("#checkout");
let cartCount = document.querySelector(".cartCount");
let totalPriceNavbar = document.querySelector(".totalPriceNavbar");
let couponInput = document.querySelector("#couponInput");
let couponBtn = document.querySelector("#couponBtn");

let data;
async function getIdsOfProducts() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem("userId_iti") != null) {
      let userId = localStorage.getItem("userId_iti");
      let usersRef = ref(db, "cart/" + userId);
      get(usersRef).then(async (snapshot) => {
        data = await snapshot.val();
        resolve(data);
      });
    } else {
      overlay.style.display = "none";
      cartEmpty.style.display = "flex";
      totalCart.style.display = "none";
      table.style.display = "none";
      document.querySelector(".cart-parent").style.display = "none";
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
let subtotalOld;
let shipping = 0;
let shippingWord;
async function displayProducts() {
  let result = await displayCartProducts();
  let resultArr = await result[0];
  productsIDS = await result[1];
  let arr = null;

  if (resultArr.length > 0) {
    let box = "";

    for (let i = 0; i < resultArr.length; i++) {
      arr += resultArr[i].price * productsIDS[resultArr[i].id].count;

      box += `
        <tr>
            <td>
                <img src="${resultArr[i].image}" alt="${
        resultArr[i].name
      }" class="product-image" />
            </td>
            <td>
              <p class="product-title">${resultArr[i].description
                .split(" ")
                .slice(0, 5)}</p>
            </td>
            <td>
              <p class="product-price">${resultArr[i].price} E£</p>
            </td>
            <td class="quantity-td">
              <div class="quantity">
                  <button onclick="minusFun('${
                    productsIDS[resultArr[i].id].count
                  }','${resultArr[i].id}')" class="minus">-</button>
                  <input type="number" id="inptNum" disabled value="${
                    productsIDS[resultArr[i].id].count
                  }" min="1" />
                  <button onclick="plusFun('${
                    productsIDS[resultArr[i].id].count
                  }','${resultArr[i].id}')" class="plus">+</button>
              </div>
            </td>
            <td>
                <p class="product-subtotal">${
                  resultArr[i].price * productsIDS[resultArr[i].id].count
                } EGP</p>
            </td>
            <td>
              <button onclick="deleteActualProduct('${
                resultArr[i].id
              }')" class="card-btn"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr> 
      `;
    }
    container.innerHTML = box;
    table.style.display = "table";
    cartEmpty.style.display = "none";

    if (arr > 60000) {
      flatRate.innerHTML = "Free shipping";
      finalTotal.innerHTML = arr + " EGP";
      offerText.innerHTML = "Your order qualifies for free shipping!";
      bar.style.background = "#00A046";
      bar.style.width = "100%";
    } else {
      flatRate.innerHTML = "Flat rate: 500.00 EGP";
      finalTotal.innerHTML = arr + " EGP";
      offerText.innerHTML = `Add <strong class='priceValAdd'>${
        60000 - arr
      }E£</strong> to cart and get free shipping!`;
      bar.style.background = "#EF262C";
      bar.style.width = "60%";
    }
    subtotalValue.innerHTML = arr + " EGP";
  } else {
    cartEmpty.style.display = "flex";
    totalCart.style.display = "none";
    table.style.display = "none";
    document.querySelector(".cart-parent").style.display = "none";
  }

  shippingInpt.forEach((inpt) => {
    if (inpt.checked) {
      shippingWord = inpt.previousElementSibling.innerHTML;
      console.log(shippingWord);
      if (shippingWord == "Flat rate: 500.00 EGP") {
        shipping = 500;
        finalTotal.innerHTML = arr + 500 + " EGP";
      } else {
        shipping = 0;
        finalTotal.innerHTML = arr + " EGP";
      }
    }
  });

  shippingInpts.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.innerHTML == "Flat rate: 500.00 EGP") {
        finalTotal.innerHTML = arr + 500 + " EGP";
        shipping = 500;
        shippingWord = "Flat rate: 500.00 EGP";
      } else if (e.target.innerHTML == "Local pickup") {
        finalTotal.innerHTML = arr + " EGP";
        shipping = 0;
        shippingWord = "Local pickup";
      } else {
        shippingWord = "Free shipping";
        shipping = 0;
      }
    });
  });
  subtotalOld = arr;
  overlay.style.display = "none";
  return subtotalOld;
}
displayProducts();

removeAll.addEventListener("click", removeAllCart);

function removeAllCart() {
  let userId = localStorage.getItem("userId_iti");
  let usersRef = ref(db, `cart/${userId}/`);

  remove(usersRef)
    .then(() => {
      displayProducts();
      document.querySelector(".cart-parent").style.display = "none";
      cartCount.innerHTML = 0;
      // totalPriceNavbar.innerHTML = "0.00 EGP";
      remove(ref(db, `totalPriceNavbar/${userId}/`)).then((data) => {
        totalPriceNavbar.innerHTML = "0.00 EGP";
      });
      sweetCountProduct("products removed successfully!", "success");
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
}

checkout.addEventListener("click", addOrderToDatabase);
let shippingInp = document.querySelectorAll(".shippingInpt");
function addOrderToDatabase() {
  let userId = localStorage.getItem("userId_iti");
  let id = Date.now();
  console.log(productsIDS);
  checkout.setAttribute("href", `../orders/order.html?orderId=${id}`);
  set(ref(db, `orders/${userId}/` + id), {
    subtotal: subtotalOld,
    total: subtotalOld + shipping,
    shipping: shipping,
    shippingWord: shippingWord,
    productsId: productsIDS,
  }).then((data) => {
    console.log(data);
  });
}

window.minusFun = (countVal, id) => {
  let userId = localStorage.getItem("userId_iti");

  if (+countVal > 1) {
    update(ref(db, `cart/${userId}/` + id), {
      count: +countVal - 1,
    })
      .then(async (data) => {
        let dat = await displayProducts();
        if (dat) {
          totalPriceNavbar.innerHTML = dat + " EGP";
          update(ref(db, `totalPriceNavbar/${userId}/`), {
            total: dat || 0.0,
          }).then((data) => {
            // displayProducts();
            cartCount.innerHTML -= 1;
          });
        } else {
          totalPriceNavbar.innerHTML = "0.00 EGP";
        }
        sweetCountProduct(
          "product's quantity decreased successfully!",
          "success"
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (+countVal == 1) {
    sweetCountProduct("product's quantity must be 1 or more", "warning");
  }
};

window.plusFun = (countVal, id) => {
  let userId = localStorage.getItem("userId_iti");

  if (+countVal > 0) {
    update(ref(db, `cart/${userId}/` + id), {
      count: +countVal + 1,
    })
      .then(async (data) => {
        let dat = await displayProducts();
        if (dat) {
          totalPriceNavbar.innerHTML = dat + " EGP";
          update(ref(db, `totalPriceNavbar/${userId}/`), {
            total: dat || 0.0,
          }).then((data) => {
            // displayProducts();
            cartCount.innerHTML = +cartCount.innerHTML + 1;
          });
        } else {
          totalPriceNavbar.innerHTML = "0.00 EGP";
        }
        sweetCountProduct(
          "product's quantity increased successfully!",
          "success"
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

window.deleteActualProduct = async (id) => {
  let userId = localStorage.getItem("userId_iti");
  let usersRef = ref(db, `cart/${userId}/${id}`);

  remove(usersRef)
    .then(async () => {
      let prePrice = productsIDS[id];
      delete productsIDS[id];
      let dat = await displayProducts();
      if (productsIDS) {
        if (dat) {
          totalPriceNavbar.innerHTML = dat + " EGP";
          update(ref(db, `totalPriceNavbar/${userId}/`), {
            total: dat || 0.0,
          }).then((data) => {});
        } else {
          totalPriceNavbar.innerHTML = "0.00 EGP";
        }
      } else {
        remove(ref(db, `totalPriceNavbar/${userId}/`)).then((data) => {
          console.log(data);
          totalPriceNavbar.innerHTML = "0.00 EGP";
        });
      }

      cartCount.innerHTML -= prePrice.count;

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


async function getAllCoupons() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem("userId_iti") != null) {
      let usersRef = ref(db, "coupons/");
      get(usersRef).then(async (snapshot) => {
        data = await snapshot.val();
        resolve(data);
      });
    } 
  });
}

let coupons = await getAllCoupons();
console.log(coupons);

// couponInput
couponBtn.addEventListener("click" , freeCoupon);

function freeCoupon(){
  if(couponInput.value != ""){
    for (const key in coupons) {
      if(couponInput.value == coupons[key].name){
        // let dicsount = +finalTotal.innerHTML * 0.1;
        // finalTotal.innerHTML = finalTotal.innerHTML - dicsount;
        sweetCountProduct("this coupon applied", "success");
        // update(ref(db, `totalPriceNavbar/${userId}/`), {
        //   total: +finalTotal.innerHTML,
        // }).then((data) => {});
      }
      
    }
    console.log(couponInput.value);
  }else{
    sweetCountProduct("please fill this input", "warning")
  }
  
}