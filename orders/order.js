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

let billingInpts = document.querySelectorAll(".inpts");
let products = document.querySelector("#products");
let subtotal = document.querySelector("#subtotal");
let shappingWayLabel = document.querySelector("#shappingWayLabel");
let totalOrder = document.querySelector("#totalOrder");
let cashWay = document.querySelector("#cashWay");
let place_order = document.querySelector("#place_order");
let country = document.querySelector("#country");
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let streetAddress = document.querySelector("#streetAddress");
let town = document.querySelector("#town");
let phone = document.querySelector("#phone");
let email = document.querySelector("#email");
let query = window.location.search;
let searchQuery = new URLSearchParams(query);
let orderId = searchQuery.get("orderId");
let userId = localStorage.getItem("userId_iti");
let overlay = document.querySelector(".overlay");

firstName.addEventListener("keyup", firstNameValidate);
lastName.addEventListener("keyup", lastNameValidate);
streetAddress.addEventListener("keyup", streetValidate);
town.addEventListener("keyup", townValidate);
phone.addEventListener("keyup", phoneValidate);
email.addEventListener("keyup", validationEmail);

function firstNameValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(firstName.value) == true) {
    firstName.style.borderColor = "green";
    firstName.nextElementSibling.innerHTML = "FirstName input is valid";
    firstName.nextElementSibling.style.color = "green";
    return firstName.value;
  } else {
    firstName.style.borderColor = "red";
    firstName.nextElementSibling.innerHTML =
      "FirstName input must be more than or equal 3 English characters !";
    firstName.nextElementSibling.style.color = "red";
    return false;
  }
}

function lastNameValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(lastName.value) == true) {
    lastName.style.borderColor = "green";
    lastName.nextElementSibling.innerHTML = "LastName input is valid";
    lastName.nextElementSibling.style.color = "green";
    return lastName.value;
  } else {
    lastName.style.borderColor = "red";
    lastName.nextElementSibling.innerHTML =
      "LastName input must be more than or equal 3 English characters !";
    lastName.nextElementSibling.style.color = "red";
    return false;
  }
}

function streetValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(streetAddress.value) == true) {
    streetAddress.style.borderColor = "green";
    streetAddress.nextElementSibling.innerHTML =
      "street address input is valid";
    streetAddress.nextElementSibling.style.color = "green";
    return streetAddress.value;
  } else {
    streetAddress.style.borderColor = "red";
    streetAddress.nextElementSibling.innerHTML =
      "street address input must be more than or equal 3 English characters !";
    streetAddress.nextElementSibling.style.color = "red";
    return false;
  }
}

function townValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(town.value) == true) {
    town.style.borderColor = "green";
    town.nextElementSibling.innerHTML = "town input is valid";
    town.nextElementSibling.style.color = "green";
    return town.value;
  } else {
    town.style.borderColor = "red";
    town.nextElementSibling.innerHTML =
      "town input must be more than or equal 3 English characters !";
    town.nextElementSibling.style.color = "red";
    return false;
  }
}

function phoneValidate() {
  let pattern = /^(002)?01[0125][0-9]{8}$/;
  if (pattern.test(phone.value) == true) {
    phone.style.borderColor = "green";
    phone.nextElementSibling.innerHTML = "phone input is valid";
    phone.nextElementSibling.style.color = "green";
    return phone.value;
  } else {
    phone.style.borderColor = "red";
    phone.nextElementSibling.innerHTML =
      "phone Number must consists of 11 number like this 01554408494 and may be start (002)!";
    phone.nextElementSibling.style.color = "red";
    return false;
  }
}

function validationEmail() {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (pattern.test(email.value) == true) {
    email.style.borderColor = "green";
    email.nextElementSibling.innerHTML = "Email is valid";
    email.nextElementSibling.style.color = "green";
    return email.value;
  } else {
    email.style.borderColor = "red";
    email.nextElementSibling.innerHTML =
      "Email is not valid (must be like nametest@gmail.com)";
    email.nextElementSibling.style.color = "red";
    return false;
  }
}

async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const countries = await response.json();
    printAllCountries(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

getCountries();

function printAllCountries(countriesData) {
  const countryNames = countriesData
    .slice(0, 100)
    .map((country) => country.name.common);
  let box = "";
  for (let i = 0; i < countryNames.length; i++) {
    box += `
            <option>${countryNames[i]}</option>
        `;
  }

  country.innerHTML = box;
}

function getOrder() {
  return new Promise((resolve, reject) => {
    let ordersRef = ref(db, `orders/${userId}/`);
    get(ordersRef).then(async (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

let orders = await getOrder();
let idsOfProducts;
let finalTotalToReceive;
let finalSubTotalToReceive;
let finalShippingToReceive;
function printData() {
  for (const key in orders) {
    idsOfProducts = orders[key].productsId;
    subtotal.innerHTML = orders[key].subtotal + " EGP";
    totalOrder.innerHTML = orders[key].total + " EGP";
    shappingWayLabel.innerHTML = orders[key].shippingWord;
    finalTotalToReceive = orders[key].total;
    finalSubTotalToReceive = orders[key].subtotal;
    finalShippingToReceive = orders[key].shippingWord;
  }
}
printData();
let arrayOfIds = [];
let arrayOfCount = [];
function getIdsOfProducts() {
  for (const key in idsOfProducts) {
    arrayOfIds.push(idsOfProducts[key].productId);
    arrayOfCount.push(idsOfProducts[key].count);
  }
}
getIdsOfProducts();

function getProducts() {
  let productsArr = [];
  for (const element of arrayOfIds) {
    let usersRef = ref(db, `products/` + element);
    let promise = get(usersRef).then(async (snapshot) => snapshot.val());
    productsArr.push(promise);
  }
  return Promise.all(productsArr);
}
let allProducts = await getProducts();

function printProducts() {
  let box = "";
  for (let i = 0; i < allProducts.length; i++) {
    box += `
          <div class="product-flex">
              <p>
                  ${allProducts[i].name}
                  <strong> x ${arrayOfCount[i]}</strong>
              </p>
              <span>${allProducts[i].price * arrayOfCount[i]} EGP</span>
          </div>
      `;
  }
  products.innerHTML = box;
  overlay.style.display = "none";

}
printProducts();

place_order.addEventListener("click", getAllInpts);

function getAllInpts(e) {
  console.log(allProducts);

  billingInpts.forEach((el) => {
    if (el.value == "") {
      el.nextElementSibling.innerHTML = "This field is required *";
    }
  });

  let fName = firstNameValidate();
  let lName = lastNameValidate();
  let streetFun = streetValidate();
  let townFun = townValidate();
  let phoneFun = phoneValidate();
  let emailFun = validationEmail();
  console.log(finalTotalToReceive);
  
  if (fName && lName && streetFun && townFun && phoneFun && emailFun) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString('default', { month: 'long' });
    const day = today.getDate();

    const formattedDate = `${month} ${day}, ${year}`;

    console.log(formattedDate);
    
    let data = Date.now();
    set(ref(db, `finalOrders/${userId}/` + data), {
      userId: userId,
      firstName: fName,
      lastName: lName,
      street: streetFun,
      town: townFun,
      phone: phoneFun,
      email: emailFun,
      orders: orders,
      products: allProducts,
      paymentWay: cashWay.value,
      orderDate: formattedDate,
      finalTotalToReceive: finalTotalToReceive,
      finalSubTotalToReceive: finalSubTotalToReceive,
      finalShippingToReceive: finalShippingToReceive,
      arrayOfCount: arrayOfCount,
      orderStatus: "pending"
    });

    let usersRef = ref(db, `cart/${userId}/`);
    let totalPriceNavbar = document.querySelector(".totalPriceNavbar");
    remove(usersRef)
      .then(() => {
        console.log("cart is removed");
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });

    let totalPriceRef = ref(db, `totalPriceNavbar/${userId}/`);
    remove(totalPriceRef)
      .then(() => {
        console.log("total is removed");
        totalPriceNavbar.innerHTML = "0.00 EGP";
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
      
      window.location = `../order-receive/receive.html?orderId=${data}`;
  }
}
