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

let query = window.location.search;
let searchQuery = new URLSearchParams(query);
let orderId = searchQuery.get("orderId");
let userId = localStorage.getItem("userId_iti");

let orderNumber = document.getElementById("orderNumber");
let orderDate = document.getElementById("orderDate");
let orderEmail = document.getElementById("orderEmail");
let orderTotal = document.getElementById("orderTotal");
let orderPayment = document.getElementById("orderPayment");
let subtotal = document.getElementById("subtotal");
let shipping = document.getElementById("shipping");
let payment = document.getElementById("payment");
let total = document.getElementById("total");
let tbody = document.getElementById("tbody");
let overlay = document.querySelector(".overlay");

function getDetails() {
  let ordersRef = ref(db, `finalOrders/${userId}/${orderId}`);
  get(ordersRef).then(async (snapshot) => {
    let details = snapshot.val();
    console.log(details.products);
    let arr = details.products;
    for (let i = 0; i < arr.length; i++) {
        tbody.insertAdjacentHTML('afterbegin', `
            <tr>
                <td>${arr[i].name} x <strong>${details.arrayOfCount[i]}</strong></td>
                <td>${arr[i].price * details.arrayOfCount[i]} EGP</td>
            </tr>
        `);
    }
    orderNumber.innerHTML = orderId;
    orderDate.innerHTML = details.orderDate;
    orderEmail.innerHTML = details.email;
    orderTotal.innerHTML = details.finalTotalToReceive + " EGP";
    orderPayment.innerHTML = details.paymentWay;
    subtotal.innerHTML = details.finalSubTotalToReceive + " EGP";
    shipping.innerHTML = details.finalShippingToReceive;
    payment.innerHTML = details.paymentWay;
    total.innerHTML = details.finalSubTotalToReceive + " EGP";
    overlay.style.display = "none";

  });
}
getDetails();





