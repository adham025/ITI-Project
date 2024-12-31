// config
import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getDatabase();
import {
  getDatabase,
  set,
  ref,
  onValue,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

//                          inputs

const input = document.getElementById("first-name");
const lastname = document.getElementById("last-name");
const emailselect = document.getElementById("email");
const phoneselect = document.getElementById("phone");
//                    errors massage
const error = document.getElementById("FError");
const FemptyError = document.getElementById("FeError");
const LError = document.getElementById("LError");
const LemptyLError = document.getElementById("LeError");
const EmailError = document.getElementById("EmailError");
const FemptyEError = document.getElementById("EmailEError");
const PhoneError = document.getElementById("PhoneError");
const PemptyEError = document.getElementById("PEError");
const date = document.getElementById("dob");
const datee = document.getElementById("date");
const reorder = document.getElementById("reorder");
const track = document.getElementById("track");
const statuss = document.getElementById("status");
const old = document.getElementById("oldpassword");
const password = document.getElementById("password");
const rePassword = document.getElementById("repassword");

const Personal = document.getElementById("personal-info0");
const Security = document.getElementById("securityy");
const Orders = document.getElementById("Orderss");
const table = document.getElementById("tbody");
let overlay = document.querySelector(".overlay");

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const menuItems = document.querySelectorAll(".sidebar ul li");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "block"; // إظهار القسم المطلوب
  }

  const activeItem = document.querySelectorAll(`.try`);
  activeItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.target.classList.add("active");
    });
  });
}

const vald = /^.{3,}$/;
const emailval = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneval = /^01[0-2,5][0-9]{8}$/;

// first name valdation
input.addEventListener("keyup", () => {
  if (!vald.test(input.value.trim())) {
    error.style.display = "block";
  } else {
    error.style.display = "none";
  }
});
input.addEventListener("blur", () => {
  if (!input.value.trim()) {
    FemptyError.style.display = "block";
  } else {
    FemptyError.style.display = "none";
  }
});

// last name valdation

lastname.addEventListener("keyup", () => {
  if (!vald.test(lastname.value.trim())) {
    LError.style.display = "block";
  } else {
    LError.style.display = "none";
  }
});
lastname.addEventListener("blur", () => {
  if (!lastname.value.trim()) {
    LemptyLError.style.display = "block";
  } else {
    LemptyLError.style.display = "none";
  }
});

// Email valdation

emailselect.addEventListener("keyup", () => {
  if (!emailval.test(emailselect.value.trim())) {
    EmailError.style.display = "block";
  } else {
    EmailError.style.display = "none";
  }
});
emailselect.addEventListener("blur", () => {
  if (!emailselect.value.trim()) {
    FemptyEError.style.display = "block";
  } else {
    FemptyEError.style.display = "none";
  }
});

// Phone valdation

phoneselect.addEventListener("keyup", () => {
  if (!phoneval.test(phoneselect.value.trim())) {
    PhoneError.style.display = "block";
  } else {
    PhoneError.style.display = "none";
  }
});
phoneselect.addEventListener("blur", () => {
  if (!phoneselect.value.trim()) {
    PemptyEError.style.display = "block";
  } else {
    PemptyEError.style.display = "none";
  }
});

//          date valdation

var younger = new Date("1/1/2006");

date.addEventListener("change", () => {
  var userDate = new Date(date.value);

  if (userDate > younger) {
    datee.style.display = "block";
  } else {
    datee.style.display = "none";
  }
});

//    pass

let pattern = /^(?=(.*[A-Z]))(?=(.*\d))(?=(.*\W)).{3,}$/;
old.addEventListener("keyup", validationOldPassword);
password.addEventListener("keyup", validationPassword);
rePassword.addEventListener("keyup", validationRePassword);

function validationOldPassword() {
  if (pattern.test(old.value) == true) {
    old.style.borderColor = "green";
    old.nextElementSibling.innerHTML = "Password is valid";
    old.nextElementSibling.style.color = "green";
    return old.value;
  } else {
    old.style.borderColor = "red";
    old.nextElementSibling.innerHTML =
      "Password is not valid (must have at least one capital letter, one special character, one digit and count is 6 or more than)";
    old.nextElementSibling.style.color = "red";
    return false;
  }
}

function validationPassword() {
  if (pattern.test(password.value) == true) {
    password.style.borderColor = "green";
    password.nextElementSibling.innerHTML = "Password is valid";
    password.nextElementSibling.style.color = "green";
    return password.value;
  } else {
    password.style.borderColor = "red";
    password.nextElementSibling.innerHTML =
      "Password is not valid (must have at least one capital letter, one special character, one digit and count is 6 or more than)";
    password.nextElementSibling.style.color = "red";
    return false;
  }
}

function validationRePassword() {
  if (rePassword.value != "" && rePassword.value === password.value) {
    rePassword.style.borderColor = "green";
    rePassword.nextElementSibling.innerHTML =
      "RePassword is the same of password";
    rePassword.nextElementSibling.style.color = "green";
    return rePassword.value;
  } else if (rePassword.value == "") {
    rePassword.style.borderColor = "red";
    rePassword.nextElementSibling.innerHTML = "RePassword is required *";
    rePassword.nextElementSibling.style.color = "red";
    return false;
  } else if (rePassword.value != "" && rePassword.value !== password.value) {
    rePassword.style.borderColor = "red";
    rePassword.nextElementSibling.innerHTML =
      "RePassword must be same password value *";
    rePassword.nextElementSibling.style.color = "red";
    return false;
  }
}

Personal.addEventListener("click", (e) => {
  showSection("personal-info");
});

Security.addEventListener("click", () => {
  showSection("security");
});
Orders.addEventListener("click", () => {
  showSection("Orders");
});

let userid = localStorage.getItem("userId_iti");
let dataa;
let usersRef = ref(db, `users/${userid}`);
get(usersRef).then(async (snapshot) => {
  dataa = await snapshot.val();

  emailselect.value = `${dataa.email}`;
  input.value = `${dataa.firstName}`;
  lastname.value = `${dataa.lastName}`;
  phoneselect.value = `${dataa.phone}`;
  date.value = `${dataa.date}`;
  overlay.style.display = "none";
});

function updatenames() {
  if (
    vald.test(lastname.value.trim()) &&
    vald.test(input.value.trim()) &&
    phoneval.test(phoneselect.value.trim())
  ) {
    sweetCountProduct("data is updated", "success");
  } else {
    update(ref(db, `users/${userid}/`), {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      phone: document.getElementById("phone").value,
      date: document.getElementById("dob").value,
    })
      .then((respo) => {
        console.log("names updated successfully!");
        sweetCountProduct("data is updated", "success");
      })
      .catch((error) => {
        console.error("Error updating names:", error);
      });
  }
}
document.getElementById("menu-toggle").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
});

document.getElementById("update").addEventListener("click", () => {
  updatenames();
});

old.addEventListener("keyup", () => {
  if (old.value == dataa.password) {
    password.removeAttribute("disabled");
    rePassword.removeAttribute("disabled");
  } else {
    old.nextElementSibling.innerHTML = "your old password is wrong ";
  }
});
async function getorders() {
  let OrderRef = await ref(db, "finalOrders/" + userid);
  console.log(userid);
  let arr = [];
  let arrProducts = [];
  await get(OrderRef).then((snapshot) => {
    let orderdata = snapshot.val();

    function formatToDesiredDate(inputDate) {
      let date = new Date(inputDate);

      // أسماء الشهور
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let month = months[date.getMonth()]; // اسم الشهر
      let day = date.getDate(); // اليوم
      let year = date.getFullYear(); // السنة

      return `${month} ${day}, ${year}`; // التنسيق النهائي
    }
    let products_box = document.querySelector(".products_box");
    let products_item = document.querySelector(".products_item");
    function checkAndAddDays(inputDate, status) {
      if (status !== "waiting admin") {
        let date = new Date(inputDate);
        date.setDate(date.getDate() + 3);
        return formatToDesiredDate(date);
      }
      return formatToDesiredDate(inputDate);
    }
    console.log(orderdata);

    let box = ""; // Accumulate order details
    if (orderdata != null) {
      for (const [orderId, orderDetails] of Object.entries(orderdata)) {
        console.log(orderId);
        console.log(orderDetails);

        // Build the order details box
        box += `
      <div class="top-order">
        <div class="title-order">
          <div>
            <h3>Order</h3>
          <span>#${orderId}</span>
          </div>
          <div>
            <h3>Date</h3>
            <span>${orderDetails.orderDate}</span>
          </div>
          <div>
            <h3>Status</h3>
            <span>${orderDetails.orderStatus}</span>
          </div>
          <div>
            <h3>Total</h3>
            <span>${orderDetails.finalTotalToReceive}</span>
          </div>
          
          </div>
        <div class="products-list">
    `;

        // Build the product details for the current order
        orderDetails.products.forEach((product, index) => {
          console.log(product);
          box += `
        <div class="product-item">
          <p>${product.name}</p>
          <img style="width: 200px" src="${product.image}" alt="${product.name}" />
        </div>
      `;
        });

        box += `</div></div>`; // Close products list and order container
      }
      // Update the HTML for the container
      products_box.innerHTML = box;
    } else {
      products_box.innerHTML =
        "<h2 style='text-align: center' >No Orders founded</h2>";
    }
  });
}
getorders();

let logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  window.localStorage.removeItem("userId_iti");
  // window.location = "../categories/mobiles/mobiles.html"
});

const updatee = document.getElementById("updatepass");

let userId = localStorage.getItem("userId_iti");

updatee.addEventListener("click", async (e) => {
  e.preventDefault();
  const oldPassword = document.querySelector("#oldpassword").value;
  const newPassword = document.querySelector("#password").value;
  const rePassword = document.querySelector("#repassword").value;
  if (oldPassword && newPassword && rePassword) {
    await updateUserPassword(oldPassword, newPassword, rePassword);
  } else {
    sweetCountProduct("please fill all inputs", "error");
  }
});

async function updateUserPassword(oldPassword, newPassword, rePassword) {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);

  if (!user) {
    console.error("No user is logged in.");
    return;
  }

  if (newPassword !== rePassword) {
    console.error("Passwords do not match.");
    return;
  }

  try {
    // Step 1: Re-authenticate user with old password
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    // Step 2: Update the password in Firebase Authentication
    await updatePassword(user, newPassword);

    update(ref(db, `users/${user.uid}/`), {
      password: newPassword,
    }).then((data) => {
      console.log("password updated");
    });

    sweetCountProduct("password is updated successfully", "success");
  } catch (error) {
    sweetCountProduct(`Error ${error.code}`, "error");
  }
}

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
