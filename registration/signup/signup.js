import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

import { firebaseConfig } from "../../config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const db = getDatabase();

let inputs = document.querySelectorAll(".container input");
let registerBtn = document.getElementById("registerBtn");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let repassword = document.getElementById("repassword");

// error handling each input has empty value when register

(function () {
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    inputs.forEach((input) => {
      if (input.value == "") {
        input.nextElementSibling.innerHTML = "fill this input please";
      }
    });

    let fFun = firstNameValidate();
    let lFun = lastNameValidate();
    let mailFun = validationEmail();
    let passFun = validationPassword();
    let rePassFun = validationRePassword();

    if (fFun && lFun && mailFun && passFun && rePassFun) {
      createUserWithEmailAndPassword(auth, mailFun, passFun)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          window.localStorage.setItem("userId_iti", user.uid);
          writeUserData(user.uid, fFun, lFun, mailFun, passFun);
          sweetAlertSuccess();
          window.location = "../../home.html";
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode == "auth/email-already-in-use") {
            sweetAlertFailed("Email already in use!");
          } else {
            sweetAlertFailed(errorCode);
          }
        });
    } else {
      console.log("input or more is empty");
    }
  });
})();

//  validation on firstName and lastName input
// firstName.addEventListener("blur" , userNameValidate);
// lastName.addEventListener("blur" , userNameValidate);
firstName.addEventListener("keyup", firstNameValidate);
lastName.addEventListener("keyup", lastNameValidate);

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

//  validation on Email input

email.addEventListener("keyup", validationEmail);

function validationEmail() {
  let pattern = /^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,6}$/;
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

//  validation on password input

password.addEventListener("keyup", validationPassword);
repassword.addEventListener("keyup", validationRePassword);

function validationPassword() {
  let pattern = /^((?=.*[A-Z])(?=.*\W)(?=.*[0-9])){6,}/;
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
  if (repassword.value != "" && repassword.value === password.value) {
    repassword.style.borderColor = "green";
    repassword.nextElementSibling.innerHTML =
      "RePassword is the same of password";
    repassword.nextElementSibling.style.color = "green";
    return repassword.value;
  } else if (repassword.value == "") {
    repassword.style.borderColor = "red";
    repassword.nextElementSibling.innerHTML = "RePassword is required *";
    repassword.nextElementSibling.style.color = "red";
    return false;
  } else if (repassword.value != "" && repassword.value !== password.value) {
    repassword.style.borderColor = "red";
    repassword.nextElementSibling.innerHTML =
      "RePassword must be same password value *";
    repassword.nextElementSibling.style.color = "red";
    return false;
  }
}

function writeUserData(userId, fName, lName, email, password) {
  set(ref(db, "users/" + userId), {
    firstName: fName,
    lastName: lName,
    email: email,
    password: password,
    role: "user",
  });
}

function sweetAlertSuccess() {
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
    title: "you are a valid user",
  });
  return Toast;
}

function sweetAlertFailed(errorMessage) {
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
    icon: "error",
    title: errorMessage,
  });
  return Toast;
}
